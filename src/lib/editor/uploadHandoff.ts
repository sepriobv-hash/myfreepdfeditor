"use client";

type PendingUploadRecord = {
  id: string;
  name: string;
  type: string;
  lastModified: number;
  file: Blob | ArrayBuffer;
  createdAt: number;
};

const DB_NAME = "pdf-studio-web";
const STORE_NAME = "pendingUploads";
const DB_VERSION = 1;
const UPLOAD_TTL_MS = 60 * 60 * 1000;

export async function storePendingUpload(file: File) {
  const id = crypto.randomUUID();
  // Store bytes so the handoff works where IndexedDB cannot persist Blob/File values.
  const record: PendingUploadRecord = {
    id,
    name: file.name,
    type: file.type || "application/pdf",
    lastModified: file.lastModified,
    file: await file.arrayBuffer(),
    createdAt: Date.now(),
  };

  const db = await openUploadDb();
  try {
    await withPendingUploads(db, store => {
      store.put(record);
      pruneUploads(store, Date.now() - UPLOAD_TTL_MS);
    });
    return id;
  } finally {
    db.close();
  }
}

export async function consumePendingUpload(id: string) {
  const db = await openUploadDb();
  const consumed: { record?: PendingUploadRecord } = {};
  const cutoff = Date.now() - UPLOAD_TTL_MS;

  try {
    await withPendingUploads(db, store => {
      const request = store.get(id);
      request.onsuccess = () => {
        const record = request.result as PendingUploadRecord | undefined;
        if (record && record.createdAt >= cutoff) consumed.record = record;
        store.delete(id);
      };
      pruneUploads(store, cutoff);
    });
    const { record } = consumed;
    return record
      ? new File([record.file], record.name, { type: record.type, lastModified: record.lastModified })
      : null;
  } finally {
    db.close();
  }
}

export function clearUploadParameters(uploadId: string, clearTool = false) {
  const url = new URL(window.location.href);
  if (url.searchParams.get("uploadId") !== uploadId) return;
  url.searchParams.delete("uploadId");
  if (clearTool) url.searchParams.delete("tool");
  window.history.replaceState(window.history.state, "", url);
}

export function clearPendingUploads() {
  return new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error("Close other editor tabs and try again."));
  });
}

function openUploadDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function pruneUploads(store: IDBObjectStore, cutoff: number) {
  const request = store.openCursor();
  request.onsuccess = () => {
    const cursor = request.result;
    if (!cursor) return;
    if ((cursor.value as PendingUploadRecord).createdAt < cutoff) cursor.delete();
    cursor.continue();
  };
}

function withPendingUploads(db: IDBDatabase, callback: (store: IDBObjectStore) => void) {
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    callback(transaction.objectStore(STORE_NAME));
    transaction.oncomplete = () => resolve();
    transaction.onabort = () => reject(transaction.error ?? new Error("Local file transfer was interrupted"));
  });
}
