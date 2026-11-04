# Third-party processing assets

These packages are pinned in package-lock.json. Runtime assets are copied from npm dependencies at build time by `scripts/prepare-tool-assets.mjs`.

| Component | Upstream | License |
| --- | --- | --- |
| Tesseract.js worker | https://github.com/naptha/tesseract.js | Apache-2.0 |
| Tesseract.js Core WASM | https://github.com/naptha/tesseract.js-core | Apache-2.0 |
| OCR language packages (eng, nld, deu, fra, spa, ita) | https://github.com/naptha/tessdata | MIT, as declared by the npm language packages |
| Noto Sans via Fontsource | https://github.com/fontsource/fontsource | Font: SIL Open Font License 1.1 |
| pdf-lib | https://github.com/Hopding/pdf-lib | MIT |
| @pdf-lib/fontkit | https://github.com/Hopding/fontkit | MIT |
| PDF.js | https://github.com/mozilla/pdf.js | Apache-2.0 |
| docx | https://github.com/dolanmiu/docx | MIT |
| JSZip | https://github.com/Stuk/jszip | MIT or GPL-3.0-or-later; used under MIT |

The worker/core and font license texts are served under `/tool-assets/licenses/`. Other bundled package notices are retained by the production bundler where provided. These assets contain code, fonts and public recognition models, not user documents.
