# JavaScript ZIP Library Comparison

Scope: browser-only, buildless (CDN `<script>` tags, no bundler), producing a ZIP of two files (one JSON + one CSV).

---

## Candidates

### JSZip v3.10.1

| Attribute | Value |
|---|---|
| GitHub stars | ~10.3k |
| License | MIT / GPLv3 (dual) |
| Minified size | ~92 kB |
| Gzipped size | ~26 kB |
| Last meaningful code update | ~4 years ago |
| CDN | `https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js` |
| Browser support | IE 6+ |
| ES Modules | No (UMD/CommonJS only) |
| Async ZIP | Yes (Promise-based) |
| Tree-shakeable | No |

**API (browser, buildless)**:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
```

```javascript
const zip = new JSZip();
zip.file("template.json", jsonString);
zip.file("data.csv", csvString);
zip.generateAsync({ type: "blob" }).then((blob) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "svengali.zip";
  a.click();
  URL.revokeObjectURL(url);
});
```

**Pros**:
- Extremely well-documented with many Stack Overflow examples
- Familiar to nearly all JavaScript developers
- Simple, readable API for the basic use case
- Widely battle-tested

**Cons**:
- ~92 kB minified — noticeably large for a CDN load
- Not actively maintained (last code change ~4 years ago; 372 open issues)
- No tree-shaking (entire library is always loaded)

---

### fflate v0.8.2

| Attribute | Value |
|---|---|
| GitHub stars | ~2.8k |
| License | MIT |
| Minified size | ~31 kB (full); ~7 kB (ZIP compression only, with tree-shaking) |
| Gzipped size | ~11.5 kB (full) |
| Last meaningful code update | ~2 years ago |
| CDN (UMD, full) | `https://cdn.jsdelivr.net/npm/fflate@0.8.2/umd/index.js` |
| CDN (unpkg, full) | `https://unpkg.com/fflate@0.8.2` |
| Browser support | IE 11+ |
| ES Modules | Yes (also UMD for CDN) |
| Async ZIP | Yes (Worker-based, parallel per-file) |
| Tree-shakeable | Yes (with a bundler; not applicable when loading from CDN) |

**API (browser, buildless)**:

```html
<script src="https://cdn.jsdelivr.net/npm/fflate@0.8.2/umd/index.js"></script>
```

```javascript
// fflate works with Uint8Array; convert strings first
const enc = new TextEncoder();
const zipped = fflate.zipSync({
  "template.json": enc.encode(jsonString),
  "data.csv": enc.encode(csvString),
});
const blob = new Blob([zipped], { type: "application/zip" });
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = "svengali.zip";
a.click();
URL.revokeObjectURL(url);
```

**Pros**:
- Much smaller full CDN build (~31 kB vs ~92 kB)
- Significantly faster compression (up to 60% faster than pako; async variant runs in a Worker)
- MIT-only license (simpler than JSZip's dual license)
- Actively maintained (more recent than JSZip)

**Cons**:
- Less widely known; fewer Stack Overflow examples
- API requires `Uint8Array` input — string content needs `TextEncoder` wrapping
- CDN load brings the full ~31 kB regardless (no tree-shaking without a bundler)
- Async variant requires Workers; sync `zipSync` blocks the main thread (fine for small files)

---

## Comparison Table

| | JSZip | fflate |
|---|---|---|
| CDN minified size | ~92 kB | ~31 kB |
| API complexity | Low (strings accepted directly) | Low–Medium (requires `Uint8Array`) |
| Maintenance | Stale (~4 yrs) | Active (~2 yrs) |
| Documentation | Excellent | Good |
| Community familiarity | Very high | Moderate |
| Performance | Moderate | High |
| License | MIT / GPLv3 | MIT |

---

## Recommendation for Svengali

For this use case (two small text files, no streaming, no parallelism needed, buildless browser app):

**fflate** is the better choice. The ~31 kB CDN build is 3× lighter than JSZip's ~92 kB, the license is simpler (MIT only), and the additional API friction (`TextEncoder`) is a one-liner. Performance is irrelevant at this file size, but fflate's recency and smaller footprint are meaningful advantages for a static site loading everything via CDN.

**CDN line to add to `index.html`**:

```html
<script src="https://cdn.jsdelivr.net/npm/fflate@0.8.2/umd/index.js"></script>
```

The global `fflate` object is then available to all subsequent scripts. Use `fflate.zipSync` for the synchronous path (appropriate for files of this size).
