import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const brandDir = path.join(root, "public", "brand");
const iconSource = await readFile(path.join(brandDir, "favicon.png"));
const logoSource = await readFile(path.join(brandDir, "myfreepdfeditor-logo.png"));

const trimmedIcon = await sharp(iconSource)
  .trim({ background: "#ffffff", threshold: 12 })
  .png()
  .toBuffer();
const trimmedLogo = await sharp(logoSource)
  .trim({ background: "#ffffff", threshold: 12 })
  .png()
  .toBuffer();

async function createSquareIcon(size, fileName) {
  const inset = Math.max(2, Math.round(size * 0.08));
  const buffer = await sharp(trimmedIcon)
    .resize(size - inset * 2, size - inset * 2, { fit: "contain", background: "#ffffff" })
    .extend({ top: inset, bottom: inset, left: inset, right: inset, background: "#ffffff" })
    .png({ compressionLevel: 9, palette: true, colours: 32, effort: 10, dither: 0 })
    .toBuffer();
  await writeFile(path.join(brandDir, fileName), buffer);
  return buffer;
}

const favicon16 = await createSquareIcon(16, "favicon-16.png");
const favicon32 = await createSquareIcon(32, "favicon-32.png");
await createSquareIcon(180, "apple-touch-icon.png");
await createSquareIcon(192, "icon-192.png");
await createSquareIcon(512, "icon-512.png");
await createSquareIcon(192, "favicon.png");

const icoImages = [
  { size: 16, buffer: favicon16 },
  { size: 32, buffer: favicon32 },
];
const icoHeader = Buffer.alloc(6 + icoImages.length * 16);
icoHeader.writeUInt16LE(0, 0);
icoHeader.writeUInt16LE(1, 2);
icoHeader.writeUInt16LE(icoImages.length, 4);
let imageOffset = icoHeader.length;
icoImages.forEach(({ size, buffer }, index) => {
  const entryOffset = 6 + index * 16;
  icoHeader.writeUInt8(size, entryOffset);
  icoHeader.writeUInt8(size, entryOffset + 1);
  icoHeader.writeUInt8(0, entryOffset + 2);
  icoHeader.writeUInt8(0, entryOffset + 3);
  icoHeader.writeUInt16LE(1, entryOffset + 4);
  icoHeader.writeUInt16LE(32, entryOffset + 6);
  icoHeader.writeUInt32LE(buffer.length, entryOffset + 8);
  icoHeader.writeUInt32LE(imageOffset, entryOffset + 12);
  imageOffset += buffer.length;
});
await writeFile(
  path.join(brandDir, "favicon.ico"),
  Buffer.concat([icoHeader, ...icoImages.map(({ buffer }) => buffer)]),
);

const optimizedLogo = await sharp(trimmedLogo)
  .resize({ width: 720, withoutEnlargement: true })
  .png({ compressionLevel: 9, palette: true, quality: 92 })
  .toBuffer();
await writeFile(path.join(brandDir, "myfreepdfeditor-logo.png"), optimizedLogo);

const socialBackground = Buffer.from(`
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#f8fafc"/>
  <rect x="0" y="0" width="1200" height="14" fill="#e11d48"/>
  <rect x="64" y="56" width="1072" height="518" rx="22" fill="#ffffff" stroke="#dfe5ec" stroke-width="2"/>
  <text x="90" y="244" font-family="Arial, sans-serif" font-size="58" font-weight="700" fill="#17202b">Free PDF Editor</text>
  <text x="90" y="296" font-family="Arial, sans-serif" font-size="25" fill="#52606f">Edit, sign, and export PDFs in your browser.</text>
  <g font-family="Arial, sans-serif" font-size="20" font-weight="700">
    <rect x="90" y="337" width="151" height="43" rx="7" fill="#fff1f2"/><text x="112" y="365" fill="#be123c">No signup</text>
    <rect x="253" y="337" width="174" height="43" rx="7" fill="#ecfdf5"/><text x="275" y="365" fill="#047857">No watermark</text>
    <rect x="90" y="392" width="266" height="43" rx="7" fill="#fffbeb"/><text x="112" y="420" fill="#a16207">Files stay on device</text>
  </g>
  <rect x="702" y="112" width="382" height="398" rx="12" fill="#eef2f6" stroke="#d4dce5" stroke-width="2"/>
  <rect x="702" y="112" width="382" height="56" rx="12" fill="#1f2933"/>
  <circle cx="730" cy="140" r="7" fill="#fb7185"/><circle cx="754" cy="140" r="7" fill="#fbbf24"/><circle cx="778" cy="140" r="7" fill="#34d399"/>
  <rect x="722" y="188" width="62" height="302" rx="5" fill="#fff1f2"/>
  <rect x="734" y="204" width="38" height="54" rx="3" fill="#ffffff" stroke="#d9e0e8"/>
  <rect x="734" y="271" width="38" height="54" rx="3" fill="#ffffff" stroke="#d9e0e8"/>
  <rect x="812" y="188" width="244" height="302" rx="4" fill="#ffffff" stroke="#d9e0e8"/>
  <rect x="838" y="218" width="148" height="15" rx="3" fill="#202a35"/>
  <rect x="838" y="250" width="188" height="8" rx="3" fill="#cbd5df"/>
  <rect x="838" y="269" width="168" height="8" rx="3" fill="#dce3e9"/>
  <rect x="832" y="305" width="190" height="78" rx="5" fill="#fff1f2" stroke="#fb7185" stroke-width="2"/>
  <rect x="850" y="325" width="128" height="12" rx="3" fill="#e11d48"/>
  <rect x="850" y="348" width="150" height="8" rx="3" fill="#fecdd3"/>
  <path d="M861 438 C900 401 906 477 951 427 C976 400 991 448 1014 421" fill="none" stroke="#0f766e" stroke-width="5" stroke-linecap="round"/>
</svg>`);

const socialLogo = await sharp(trimmedLogo)
  .resize({ width: 470, withoutEnlargement: true })
  .png({ compressionLevel: 9, palette: true })
  .toBuffer();

await sharp(socialBackground)
  .composite([{ input: socialLogo, left: 90, top: 90 }])
  .jpeg({ quality: 84, progressive: true, chromaSubsampling: "4:2:0" })
  .toFile(path.join(brandDir, "og-free-pdf-editor.jpg"));

console.log("Generated optimized brand, favicon, PWA, and social preview assets.");
