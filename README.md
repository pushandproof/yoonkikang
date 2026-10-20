# Yoon Kikang — website

Static site (no build step). Open `index.html` or serve the folder.

## Editing content
Everything lives in `content.js`:
- **Works** — title, year, images, installation-view caption.
  Put image files in `images/` and add `src: "images/filename.jpg"`. Missing `src` = grey placeholder.
- **About** — statement, CV rows, texts and contact, in KOR and ENG.
- **CV PDF** — drop it at `files/cv+portfolio.pdf`.

## Views
| Work | View |
|---|---|
| 시 | `scatter` — off-grid scrollable layout (`x`, `y`, `w`, `ratio` per image) |
| Okinawa.pkg, Breathing Faces, Blooming Flaws | `strip` — horizontal scroll, hover to magnify; tiles keep each image's `ratio` |
| 백 초 세기 | `grid` — pinch / ⌘+scroll to zoom |

`ratio` is height / width. A work with no installation images hides its "installation view" link.
Installation images can carry their own `caption`; otherwise the work's caption is used.

Routes: `#/works/<slug>`, `#/works/<slug>/installation`, `#/about/cv|text|contact`.

## Deploy
GitHub Pages → Settings → Pages → Deploy from branch `main`, folder `/ (root)`.
