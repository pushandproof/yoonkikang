(() => {
  const S = window.SITE;
  const app = document.getElementById("app");
  const body = document.body;
  let cleanup = [];

  /* ---------- helpers ---------- */
  const h = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content; };
  const on = (el, ev, fn, opt) => { el.addEventListener(ev, fn, opt); cleanup.push(() => el.removeEventListener(ev, fn, opt)); };
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  let lang = store.get("yk-lang") === "eng" ? "eng" : "kor";
  const L = (v) => (v && typeof v === "object" && !Array.isArray(v) ? v[lang] ?? v.kor : v);
  const hover = matchMedia("(hover: hover)").matches;

  // medium-size copy (images/m/…) for anything shown small; full size for close looks
  const med = (src) => src && src.replace(/^images\//, "images/m/");
  const small = (src) => src && src.replace(/^images\//, "images/s/");     // 480px, 백 초 세기 grid only
  const phone = () => !matchMedia("(min-width: 761px)").matches;
  // installation: the 1400px copy is plenty on a phone screen
  const instSrc = (src) => (phone() ? med(src) : src);
  const preload = (src) => { if (!src) return Promise.resolve(); const i = new Image(); i.decoding = "async"; i.src = src; return i.decode().catch(() => {}); };

  const img = (im, extra = "") => im && im.src
    ? `<span class="ph" ${extra}><img src="${med(im.src)}" alt="" loading="lazy" decoding="async" draggable="false"></span>`
    : `<span class="ph" ${extra}></span>`;

  // nothing on the page can be dragged around
  document.addEventListener("dragstart", (e) => e.preventDefault());
  // phones: no pinch / double-tap zoom on the page (백 초 세기 handles its own pinch)
  ["gesturestart", "gesturechange"].forEach((ev) => document.addEventListener(ev, (e) => e.preventDefault(), { passive: false }));
  document.addEventListener("touchmove", (e) => { if (e.touches.length > 1 && !e.target.closest(".grid-view")) e.preventDefault(); }, { passive: false });

  /* ---------- wiki links ---------- */
  const work = (slug) => S.works.find((w) => w.slug === slug);
  const hasInstall = (w) => !!(w.installation && w.installation.images && w.installation.images.length);
  const instOnly = (w) => !w.images.length && hasInstall(w);
  const cvRows = () => S.about.cv.flatMap((s) => s.rows).filter((r) => r.id);
  const exhibition = (id) => cvRows().find((r) => r.id === id);
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // turn mentions of works and exhibitions inside running text into links
  function linkify(html) {
    const targets = [];
    S.works.forEach((w) => targets.push([w.title, `#/works/${w.slug}`]));
    cvRows().forEach((r) => {
      targets.push([r.kor[1].replace(/[〈〉]/g, ""), `#/about/cv/${r.id}`]);
      targets.push([r.eng[1].replace(/<\/?i>/g, ""), `#/about/cv/${r.id}`]);
    });
    targets.sort((a, b) => b[0].length - a[0].length);
    for (const [t, href] of targets) {
      if (t.length < 2) continue;
      html = html
        .replace(new RegExp(`〈${esc(t)}-?〉`, "g"), (m) => `<a class="wl" href="${href}">${m}</a>`)
        .replace(new RegExp(`<i>${esc(t)}</i>`, "g"), (m) => `<a class="wl" href="${href}">${m}</a>`);
    }
    return html;
  }
  // texts that mention a work, or are about an exhibition it was in
  const textsAbout = (w) => S.about.texts.filter((t) =>
    (w.installation && t.exhibition && t.exhibition === w.installation.exhibition) ||
    [t.body.kor, t.body.eng].flat().some((p) => p.includes(`〈${w.title}〉`) || p.includes(`<i>${w.title}</i>`)));

  /* ---------- client preview password ---------- */
  // Soft gate only: keeps casual visitors out while the site is client-only.
  const unlocked = () => !S.passwordHash || store.get("yk-pass") === S.passwordHash;
  const sha256 = async (t) => {
    const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t));
    return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
  };
  function gate() {
    body.classList.add("is-locked");
    app.append(h(`<form class="lock" autocomplete="off">
      <label for="pw">password</label>
      <input id="pw" type="password" autocomplete="current-password" spellcheck="false">
      <button type="submit">Enter</button>
      <div class="lock-msg" aria-live="polite"></div>
    </form>`));
    const f = app.querySelector(".lock"), i = f.querySelector("input"), m = f.querySelector(".lock-msg");
    if (hover) i.focus();
    on(i, "input", () => { m.textContent = ""; });
    on(f, "submit", async (e) => {
      e.preventDefault();
      const hash = await sha256(i.value.trim());
      if (hash === S.passwordHash) { store.set("yk-pass", hash); route(); }
      else { m.textContent = "incorrect"; i.select(); }
    });
  }

  // name: English by default, Korean on hover (swap handled in CSS)
  document.querySelector("[data-name]").textContent = S.name;
  document.querySelector("[data-name-kor]").textContent = S.nameKor;

  /* ---------- router ---------- */
  let lastPath = "";
  function route() {
    cleanup.forEach((f) => f()); cleanup = [];
    const path = location.hash;
    const keepScroll = path === lastPath;   // e.g. KOR/ENG switch re-renders the same page
    const y = scrollY;
    body.className = ""; app.innerHTML = "";
    document.querySelector("[data-born]").textContent = S.born[lang];
    if (!unlocked()) return gate();

    const parts = path.replace(/^#\/?/, "").split("/").filter(Boolean);
    if (parts[0] === "works") works(parts[1], parts[2] === "installation");
    else if (parts[0] === "about") about(parts[1] || "cv", parts[2]);
    else document.title = S.name;
    window.scrollTo(0, keepScroll ? y : 0);
    lastPath = path;
  }

  /* ---------- works ---------- */
  function works(slug, installation) {
    body.classList.add("is-works");
    const w = work(slug);
    document.title = w ? `${w.title} — ${S.name}` : `Works — ${S.name}`;
    if (w && instOnly(w)) installation = true;           // only installation shots: open straight into them
    if (w && installation && !hasInstall(w)) installation = false;

    const list = S.works.map((x) => {
      const isOn = w && x.slug === w.slug;
      const instHref = isOn && installation ? `#/works/${x.slug}` : `#/works/${x.slug}/installation`;
      const inst = hasInstall(x) && !instOnly(x)
        ? `<a class="inst${isOn && installation ? " active" : ""}" href="${instHref}">installation view</a>`
        : `<span class="inst"></span>`;
      return `<div class="row${isOn ? " on" : ""}" data-slug="${x.slug}">
        <a href="#/works/${x.slug}">${x.title}</a>
        <a href="#/works/${x.slug}">${x.year}</a>
        ${inst}
      </div>`;
    }).join("");
    app.append(h(`<nav class="works-list">${list}</nav>`));
    if (!w) return preview();

    if (installation) return installView(w);
    if (w.view === "scatter") scatter(w);
    if (w.view === "strip") strip(w);
    if (w.view === "grid") grid(w);
  }

  // works index: hovering a title shows its representative image in the empty middle
  function preview() {
    if (!hover) return;
    const cover = (w) => w.cover ? { src: w.cover, ratio: w.coverRatio || 1.25 } : (w.images[0] || (w.installation && w.installation.images[0]));
    S.works.forEach((w) => { const c = cover(w); if (c) preload(med(c.src)); });
    app.append(h(`<div class="preview" aria-hidden="true"><span class="ph"><img alt="" draggable="false"></span></div>`));
    const box = app.querySelector(".preview"), ph = box.querySelector(".ph"), im = box.querySelector("img");
    app.querySelectorAll(".works-list .row").forEach((row) => {
      on(row, "mouseenter", () => {
        const c = cover(work(row.dataset.slug)); if (!c || !c.src) return;
        ph.style.setProperty("--r", c.ratio || 1.25);
        im.src = med(c.src);
        box.classList.add("on");
      });
      on(row, "mouseleave", () => box.classList.remove("on"));
    });
  }

  // installation: fixed image height, width follows the ratio, caption at a fixed spot
  function installView(w) {
    const I = w.installation, list = I.images;
    let k = 0;
    const ex = I.exhibition && exhibition(I.exhibition);
    const texts = textsAbout(w);
    app.append(h(`<section class="install">
      <div class="stage"><span class="ph"><img alt="" draggable="false"></span></div>
      <div class="cap-block">
        <div class="cap"></div>
        <div class="count"></div>
        ${texts.length ? `<div class="see">${texts.map((t) => `<a href="#/about/text/${t.id}">Text — ${L(t.author)}</a>`).join("<br>")}</div>` : ""}
      </div>
    </section><span class="cursor-label" aria-hidden="true"></span>`));
    const stage = app.querySelector(".stage"), ph = stage.querySelector(".ph"), pic = stage.querySelector("img");
    const cap = app.querySelector(".cap"), count = app.querySelector(".count"), label = app.querySelector(".cursor-label");

    let token = 0;
    const show = async () => {
      const im = list[k], t = ++token;
      const lines = [...(im.caption || I.caption || [])];
      if (ex && !im.caption && lines[1]) lines[1] = `<a href="#/about/cv/${ex.id}">${lines[1]}</a>`;
      cap.innerHTML = lines.filter(Boolean).join("<br>");
      count.textContent = list.length > 1 ? `${k + 1} / ${list.length}` : "";
      await preload(instSrc(im.src));        // swap only once decoded: no blank flash
      if (t !== token) return;
      ph.style.setProperty("--r", im.ratio || 0.75);
      ph.classList.toggle("tall", (im.ratio || 0.75) > 1);   // vertical shot
      pic.src = instSrc(im.src);
      [1, 2, -1].forEach((d) => preload(instSrc(list[(k + d + list.length) % list.length].src)));
    };
    const go = (d) => { if (list.length < 2) return; k = (k + d + list.length) % list.length; show(); };
    show();
    if (list.length < 2) return;
    stage.classList.add("nav");
    const side = (e) => { const r = stage.getBoundingClientRect(); return e.clientX - r.left < r.width / 2 ? -1 : 1; };
    on(stage, "click", (e) => go(side(e)));
    on(stage, "mousemove", (e) => {
      label.textContent = side(e) < 0 ? "Previous" : "Next";
      label.style.transform = `translate(${e.clientX + 14}px, ${e.clientY + 10}px)`;
      label.classList.add("on");
    });
    on(stage, "mouseleave", () => label.classList.remove("on"));
    on(window, "keydown", (e) => { if (e.key === "ArrowLeft") go(-1); if (e.key === "ArrowRight") go(1); });
  }

  // 시 — off-grid scrollable view
  function scatter(w) {
    const figs = w.images.map((im) =>
      `<figure style="left:${im.x}%;top:calc(${im.y}vw * .7);width:${im.w}%">
        ${img(im, `style="aspect-ratio:${1 / im.ratio}"`)}
        <figcaption>${im.caption || ""}</figcaption>
      </figure>`).join("");
    const lowest = Math.max(...w.images.map((im) => im.y * 0.7 + im.w * im.ratio));
    app.append(h(`<section class="scatter" style="height:calc(${lowest}vw + 160px)">${figs}</section>`));
  }

  // horizontal scroll + magnifying, centred in the window
  function strip(w) {
    const list = w.images;
    const tiles = list.map((im, i) =>
      `<span class="ph" data-i="${i}" style="--r:${im.ratio || 1.28}"><img src="${med(im.src)}" alt="" decoding="async" draggable="false"></span>`).join("");
    app.append(h(`<div class="loupe"></div><div class="strip-wrap"><div class="strip">${tiles}</div></div>`));

    const wrap = app.querySelector(".strip-wrap");
    const loupe = app.querySelector(".loupe");
    // a handful of images: shrink a little so the whole row sits in the middle, gaps unchanged
    const desk = matchMedia("(min-width: 761px)");
    const fitRow = () => {
      if (!desk.matches) return wrap.style.removeProperty("--sh");
      const gap = 14, gutter = 54;
      const units = list.reduce((a, im) => a + 1 / (im.ratio || 1.28), 0);
      const hh = (innerWidth - 2 * gutter - gap * (list.length - 1)) / units;
      wrap.style.setProperty("--sh", (hh >= 260 ? Math.min(368, hh) : 368) + "px");
    };
    fitRow();
    on(window, "resize", fitRow);
    const ZOOM = 5.2;

    // vertical wheel scrolls horizontally, eased so a mouse wheel glides instead of jumping
    let target = 0, raf = 0;
    const glide = () => {
      const d = target - wrap.scrollLeft;
      if (Math.abs(d) < 0.5) { wrap.scrollLeft = target; raf = 0; return; }
      wrap.scrollLeft += d * 0.22; raf = requestAnimationFrame(glide);
    };
    on(wrap, "wheel", (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      if (!raf) target = wrap.scrollLeft;
      target = Math.max(0, Math.min(wrap.scrollWidth - wrap.clientWidth, target + e.deltaY));
      if (!raf) raf = requestAnimationFrame(glide);
    }, { passive: false });
    cleanup.push(() => cancelAnimationFrame(raf));

    if (!hover) return;
    const tilesEls = [...wrap.querySelectorAll(".ph")];
    // give every tile a random place in the fade sequence
    const scatterDelays = (step) => {
      const order = tilesEls.map((_, i) => i).sort(() => Math.random() - 0.5);
      order.forEach((ti, n) => tilesEls[ti].style.setProperty("--d", `${n * step}ms`));
    };
    let hot = null;
    on(wrap, "mousemove", (e) => {
      const t = e.target.closest(".ph");
      if (!t) return off();
      if (!hot) scatterDelays(45);            // others vanish one by one, random order
      if (t !== hot) {
        if (hot) { hot.style.setProperty("--d", "0ms"); hot.classList.remove("hot"); }
        hot = t; hot.classList.add("hot");
        const src = list[+t.dataset.i].src;
        loupe.style.backgroundImage = `url("${med(src)}")`;
        preload(src).then(() => { if (hot === t) loupe.style.backgroundImage = `url("${src}"), url("${med(src)}")`; });
      }
      const r = t.getBoundingClientRect();
      const u = (e.clientX - r.left) / r.width, v = (e.clientY - r.top) / r.height;
      const bw = innerWidth * ZOOM * 0.4, bh = bw * (r.height / r.width);
      loupe.style.backgroundSize = `${bw}px ${bh}px`;
      loupe.style.backgroundPosition = `${innerWidth / 2 - u * bw}px ${innerHeight / 2 - v * bh}px`;
      loupe.classList.add("on"); body.classList.add("loupe-on");
    });
    const off = () => {
      if (!hot) return;
      scatterDelays(20);                       // and return, also in random order
      hot.classList.remove("hot");
      hot = null; loupe.classList.remove("on"); body.classList.remove("loupe-on");
    };
    on(wrap, "mouseleave", off);
    on(wrap, "scroll", () => { if (!raf) off(); });
  }

  // 백 초 세기 — scroll or pinch to zoom, drag to move
  function grid(w) {
    const n = w.images.length || w.count;
    // no lazy loading here: every tile is on screen at once
    // small thumbnails first (fast on phones); sharper copies only once someone zooms in
    const tiles = Array.from({ length: n }, (_, i) => img(w.images[i]).replace(' loading="lazy"', "").replace('src="images/m/', 'src="images/s/')).join("");
    app.append(h(`<div class="grid-view"><div class="grid" style="--cols:${w.columns}">${tiles}</div></div>
      <div class="grid-hint">${hover ? "scroll to zoom · drag to move" : "pinch to zoom · drag to move"}</div>`));

    const view = app.querySelector(".grid-view");
    const g = app.querySelector(".grid");
    let s = 1, tx = 0, ty = 0, raf = 0, idle = 0;
    const MIN = 0.5, MAX = 9;

    let sharp = false;
    const sharpen = () => {
      if (sharp || 40 * s * (devicePixelRatio || 1) < 360) return;
      sharp = true;
      g.querySelectorAll("img").forEach((im) => { const hi = im.getAttribute("src").replace("images/s/", "images/m/"); preload(hi).then(() => { im.src = hi; }); });
    };
    const apply = () => { raf = 0; g.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${s})`; };
    const paint = () => {
      if (!raf) raf = requestAnimationFrame(apply);
      // while moving keep it on the GPU; once still, re-raster so zoomed tiles are sharp
      g.classList.add("moving"); clearTimeout(idle); idle = setTimeout(() => { g.classList.remove("moving"); sharpen(); }, 180);
    };
    const fit = () => {
      const r = view.getBoundingClientRect();
      tx = (r.width - g.offsetWidth * s) / 2; ty = (r.height - g.offsetHeight * s) / 2; paint();
    };
    const zoomAt = (f, cx, cy) => {
      const r = view.getBoundingClientRect();
      const ns = Math.max(MIN, Math.min(MAX, s * f)); f = ns / s;
      const px = cx - r.left, py = cy - r.top;
      tx = px - (px - tx) * f; ty = py - (py - ty) * f; s = ns; paint();
    };
    fit();
    on(window, "resize", fit);

    // mouse wheel / trackpad scroll zooms; trackpad pinch arrives as ctrl+wheel
    on(view, "wheel", (e) => {
      e.preventDefault();
      const k = e.ctrlKey ? 0.012 : 0.0022;
      zoomAt(Math.exp(-e.deltaY * k), e.clientX, e.clientY);
    }, { passive: false });

    // drag to move, two fingers to pinch
    const pts = new Map();
    let pinch = null;
    const mid = () => { const [a, b] = [...pts.values()]; return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, d: Math.hypot(a.x - b.x, a.y - b.y) }; };
    on(view, "pointerdown", (e) => {
      view.setPointerCapture(e.pointerId);
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 2) pinch = mid();
      view.classList.add("grabbing");
    });
    on(view, "pointermove", (e) => {
      const p = pts.get(e.pointerId); if (!p) return;
      const nx = e.clientX, ny = e.clientY;
      if (pts.size === 1) { tx += nx - p.x; ty += ny - p.y; paint(); }
      p.x = nx; p.y = ny;
      if (pts.size === 2 && pinch) {
        const m = mid();
        tx += m.x - pinch.x; ty += m.y - pinch.y;
        zoomAt(m.d / pinch.d, m.x, m.y);
        pinch = m;
      }
    });
    const up = (e) => { pts.delete(e.pointerId); pinch = pts.size === 2 ? mid() : null; if (!pts.size) view.classList.remove("grabbing"); };
    on(view, "pointerup", up); on(view, "pointercancel", up);

    on(window, "keydown", (e) => {
      const r = view.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      if (e.key === "+" || e.key === "=") zoomAt(1.25, cx, cy);
      if (e.key === "-" || e.key === "_") zoomAt(0.8, cx, cy);
      if (e.key === "0") { s = 1; fit(); }
    });
    cleanup.push(() => { cancelAnimationFrame(raf); clearTimeout(idle); });
  }

  /* ---------- about ---------- */
  function about(tab, anchor) {
    body.classList.add("is-about", "tab-" + tab);
    document.title = `About — ${S.name}`;
    const A = S.about;
    const tabs = [["cv", "CV"], ["text", "Text"], ["contact", "Contact"]];
    app.append(h(`
      <nav class="sub-nav">${tabs.map(([k, l]) => `<a href="#/about/${k}" class="${k === tab ? "on" : ""}">${l}</a>`).join("")}</nav>
      <div class="lang"><button data-lang="kor" class="${lang === "kor" ? "on" : ""}">KOR</button><button data-lang="eng" class="${lang === "eng" ? "on" : ""}">ENG</button></div>
      <section class="about"></section>`));
    const sec = app.querySelector(".about");

    app.querySelectorAll("[data-lang]").forEach((b) => on(b, "click", () => {
      if (b.dataset.lang === lang) return;
      lang = b.dataset.lang; store.set("yk-lang", lang); route();
    }));

    if (tab === "cv") {
      sec.append(h(`<p class="statement">${A.statement[lang]}</p>
        <div class="cv">${A.cv.map((s) => `<section>
          <h2>${s.head[lang]}</h2>
          <div class="cv-table">${s.rows.map((r) => {
            const cells = [...r[lang]];
            // exhibition rows link to the works shown there (their installation views)
            if (r.works && r.works.length) {
              cells[1] = `<a href="#/works/${r.works[0]}/installation">${cells[1]}</a>` +
                (r.works.length > 1 ? r.works.map((s) => `<a class="wl sub" href="#/works/${s}/installation">${work(s).title}</a>`).join("") : "");
            }
            return `<div class="cols-${r[lang].length}${r.id ? " has-id" : ""}"${r.id ? ` id="x-${r.id}"` : ""}>${cells.map((c) => `<span>${c}</span>`).join("")}</div>`;
          }).join("")}</div>
        </section>`).join("")}</div>`));
    }

    if (tab === "text") {
      sec.append(h(`<div class="texts">${A.texts.map((t) => {
        let title = L(t.title);
        if (t.exhibition) title = linkify(title);
        return `<article id="x-${t.id}">
          <h2><span>${title}</span><br>${L(t.author)}</h2>
          <div class="body">${L(t.body).map((p) => `<p>${linkify(p)}</p>`).join("")}</div>
        </article>`;
      }).join("")}</div>`));
    }

    if (tab === "contact") {
      const c = A.contact;
      sec.append(h(`<div class="contact">
        <div>
          <div class="info">
            <a href="mailto:${c.email}">${c.email}</a><br>
            <a href="tel:${c.phone.replace(/\s/g, "")}">${c.phone}</a><br>
            <a href="https://instagram.com/${c.instagram}" target="_blank" rel="noopener">@${c.instagram}</a>
          </div>
          <button class="pdf">cv+portfolio.pdf</button>
        </div>
        <form class="gate" novalidate>
          <p>${lang === "eng" ? "please enter your e-mail to download:" : "다운로드하려면 이메일을 입력해 주세요:"}</p>
          <input type="email" required placeholder="${lang === "eng" ? "Your email" : "이메일"}" autocomplete="email">
          <label><input type="checkbox"><span class="box">[ ]</span> ${lang === "eng" ? "I’ve read and I accept the Terms and Privacy Policy" : "이용약관 및 개인정보 처리방침에 동의합니다"}</label>
          <button class="submit" type="submit" disabled>${lang === "eng" ? "Submit" : "제출"}</button>
          <div class="msg"></div>
        </form>
      </div>`));

      const pdf = sec.querySelector(".pdf"), gate = sec.querySelector(".gate");
      const email = gate.querySelector("input[type=email]"), chk = gate.querySelector("label input");
      const box = gate.querySelector(".box"), submit = gate.querySelector(".submit"), msg = gate.querySelector(".msg");
      const valid = () => { submit.disabled = !(email.validity.valid && email.value && chk.checked); };

      on(pdf, "click", () => { const o = gate.classList.toggle("on"); pdf.classList.toggle("on", o); if (o) email.focus(); });
      on(email, "input", valid);
      on(chk, "change", () => { box.textContent = chk.checked ? "[x]" : "[ ]"; valid(); });
      on(gate, "submit", (e) => {
        e.preventDefault(); if (submit.disabled) return;
        // TODO: send email.value to a form endpoint (e.g. Formspree) before download
        const a = document.createElement("a"); a.href = c.pdf; a.download = "yoonkikang_cv+portfolio.pdf"; a.click();
        msg.textContent = lang === "eng" ? "Thank you." : "감사합니다.";
      });
    }

    // #/about/<tab>/<id>: jump to that entry and mark it
    if (anchor) requestAnimationFrame(() => {
      const el = document.getElementById("x-" + anchor);
      if (!el) return;
      el.classList.add("hl");
      const target = el.querySelector("span") || el;
      window.scrollTo(0, target.getBoundingClientRect().top + scrollY - innerHeight * 0.35);
    });
  }

  window.addEventListener("hashchange", route);
  route();
})();
