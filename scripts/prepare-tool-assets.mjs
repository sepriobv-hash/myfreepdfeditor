import { mkdir, copyFile, readdir } from "node:fs/promises";
import { join } from "node:path";
const root = new URL("../", import.meta.url).pathname;
const dest = join(root, "public/tool-assets");
await mkdir(join(dest, "ocr"), { recursive: true });
await mkdir(join(dest, "fonts"), { recursive: true });
await copyFile(
  join(root, "node_modules/tesseract.js/dist/worker.min.js"),
  join(dest, "ocr/worker.min.js"),
);
for (const name of await readdir(
  join(root, "node_modules/tesseract.js-core"),
)) {
  if (/\.wasm(?:\.js)?$/.test(name))
    await copyFile(
      join(root, "node_modules/tesseract.js-core", name),
      join(dest, "ocr", name),
    );
}
for (const lang of ["eng", "nld", "deu", "fra", "spa", "ita"])
  await copyFile(
    join(
      root,
      `node_modules/@tesseract.js-data/${lang}/4.0.0_best_int/${lang}.traineddata.gz`,
    ),
    join(dest, `ocr/${lang}.traineddata.gz`),
  );
for (const weight of [400, 700])
  await copyFile(
    join(
      root,
      `node_modules/@fontsource/noto-sans/files/noto-sans-latin-${weight}-normal.woff`,
    ),
    join(dest, `fonts/noto-${weight}.woff`),
  );
console.log(
  "Prepared same-origin OCR engines, six language packs and document fonts.",
);

await mkdir(join(dest, "licenses"), { recursive: true });
for (const [source, name] of [
  ["tesseract.js/LICENSE.md", "tesseract-js.txt"],
  ["tesseract.js-core/LICENSE", "tesseract-core.txt"],
  ["@fontsource/noto-sans/LICENSE", "noto-sans.txt"],
])
  await copyFile(
    join(root, "node_modules", source),
    join(dest, "licenses", name),
  );

await import("./prepare-example-assets.mjs");
