"use client";

type PendingUploadRecord = {
  id: string;
  name: string;
  type: string;
  lastModified: number;
  file: Blob;
  createdAt: number;
};

const DB_NAME = "pdf-studio-web";
const STORE_NAME = "pendingUploads";
const DB_VERSION = 1;

export async function storePendingUpload(file: File) {
  const db = await openUploadDb();
  const id = crypto.randomUUID();
  const record: PendingUploadRecord = {
    id,
    name: file.name,
    type: file.type || "application/pdf",
    lastModified: file.lastModified,
    file,
    createdAt: Date.now(),
  };

  await transactionPromise(db, STORE_NAME, "readwrite", (store) => {
    store.put(record);
    const cutoff = Date.now() - 1000 * 60 * 60;
    const request = store.openCursor();
    request.onsuccess = () => {
      const cursor = request.result;
      if (!cursor) return;
      const value = cursor.value as PendingUploadRecord;
      if (value.createdAt < cutoff) cursor.delete();
      cursor.continue();
    };
  });

  db.close();
  return id;
}

export async function consumePendingUpload(id: string) {
  const db = await openUploadDb();
  const record = await getRecord(db, id);
  if (record) {
    await transactionPromise(db, STORE_NAME, "readwrite", (store) => {
      store.delete(id);
    });
  }
  db.close();

  if (!record) return null;
  return new File([record.file], record.name, {
    type: record.type,
    lastModified: record.lastModified,
  });
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

function getRecord(db: IDBDatabase, id: string) {
  return new Promise<PendingUploadRecord | null>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);
    request.onsuccess = () => resolve((request.result as PendingUploadRecord | undefined) ?? null);
    request.onerror = () => reject(request.error);
  });
}

function transactionPromise(
  db: IDBDatabase,
  storeName: string,
  mode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => void,
) {
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(storeName, mode);
    callback(transaction.objectStore(storeName));
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}
