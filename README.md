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
| Breathing Faces | `strip` — centred row, hover to magnify; tiles keep each image's `ratio` |
| 백 초 세기 | `grid` — scroll / pinch to zoom, drag to move |
| Okinawa.pkg, Blooming Flaws | no `images`, only `installation.images` → the title opens straight into the installation view |

`ratio` is height / width. A work with no installation images hides its "installation view" link.
Installation images can carry their own `caption`; otherwise the work's caption is used.
Hovering a title on the Works index shows the work's first image (or `cover`).

## Images
Full size (2400px) in `images/`, a 1400px copy of each in `images/m/` used for the grid, strip, 시 and previews.
Add both when adding an image.

## Links between pages (wiki)
- CV exhibition rows with an `id` and `works` link to those works' installation views; `#/about/cv/<id>` jumps to and highlights the row.
- An installation's `exhibition` id links its caption title back to that CV row.
- In texts, 〈Work title〉 / *Work title* and exhibition titles become links automatically; a text with `exhibition` is listed under that installation view, and `#/about/text/<id>` jumps to it.
- Texts are bilingual: `title`, `author`, `body` each have `kor` and `eng`.

## Deploy
GitHub Pages → Settings → Pages → Deploy from branch `main`, folder `/ (root)`.
