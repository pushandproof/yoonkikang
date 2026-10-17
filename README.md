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
| 시 | off-grid scrollable layout (`x`, `y`, `w`, `ratio` per image) |
| Breathing Faces | horizontal scroll, hover to magnify |
| 백 초 세기 | grid, pinch / ⌘+scroll to zoom, hover "focusing" |

Routes: `#/works/<slug>`, `#/works/<slug>/installation`, `#/about/cv|text|contact`.

## Deploy
GitHub Pages → Settings → Pages → Deploy from branch `main`, folder `/ (root)`.
