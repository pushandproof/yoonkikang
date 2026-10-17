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

  // Placeholder: grey block, or a faint numbered test card when it needs to show zoom
  const testCard = (n) => "data:image/svg+xml;utf8," + encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 512'>
      <rect width='400' height='512' fill='#e2e2e2'/>
      <g stroke='#cfcfcf' stroke-width='1'>${Array.from({length: 13}, (_, i) => `<line x1='${i*33}' y1='0' x2='${i*33}' y2='512'/>`).join("")}${Array.from({length: 16}, (_, i) => `<line x1='0' y1='${i*33}' x2='400' y2='${i*33}'/>`).join("")}</g>
      <circle cx='200' cy='210' r='96' fill='none' stroke='#bdbdbd' stroke-width='2'/>
      <text x='200' y='226' font-family='Helvetica,Arial' font-size='44' text-anchor='middle' fill='#a8a8a8'>${String(n).padStart(2, "0")}</text>
    </svg>`);

  const img = (im, extra = "") => im && im.src
    ? `<span class="ph" ${extra}><img src="${im.src}" alt="${im.alt || ""}" loading="lazy"></span>`
    : `<span class="ph" ${extra}></span>`;

  /* ---------- router ---------- */
  function route() {
    cleanup.forEach((f) => f()); cleanup = [];
    body.className = ""; app.innerHTML = ""; window.scrollTo(0, 0);
    document.querySelector("[data-born]").textContent = S.born[lang];

    const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    if (parts[0] === "works") return works(parts[1], parts[2] === "installation");
    if (parts[0] === "about") return about(parts[1] || "cv");
    document.title = S.name;
  }

  /* ---------- works ---------- */
  function works(slug, installation) {
    body.classList.add("is-works");
    const w = S.works.find((x) => x.slug === slug);
    document.title = w ? `${w.title} — ${S.name}` : `Works — ${S.name}`;

    const list = S.works.map((x) => {
      const isOn = w && x.slug === w.slug;
      const instHref = isOn && installation ? `#/works/${x.slug}` : `#/works/${x.slug}/installation`;
      return `<div class="row${isOn ? " on" : ""}">
        <a href="#/works/${x.slug}">${x.title}</a>
        <a href="#/works/${x.slug}">${x.year}</a>
        <a class="inst${isOn && installation ? " active" : ""}" href="${instHref}">installation view</a>
      </div>`;
    }).join("");
    app.append(h(`<nav class="works-list">${list}</nav>`));
    if (!w) return;

    if (installation) return installView(w);
    if (w.view === "scatter") scatter(w);
    if (w.view === "strip") strip(w);
    if (w.view === "grid") grid(w);
  }

  function installView(w) {
    const i = w.installation;
    const cap = i.caption.filter(Boolean).join("<br>");
    app.append(h(`<section class="install">
      <span class="ph" style="aspect-ratio:${1 / i.image.ratio}">${i.image.src ? `<img src="${i.image.src}" alt="">` : ""}</span>
      <div class="cap">${cap}</div>
    </section>`));
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

  // Breathing Faces — horizontal scroll + magnifying
  function strip(w) {
    const n = w.images.length || w.count;
    const srcs = Array.from({ length: n }, (_, i) => (w.images[i] && w.images[i].src) || testCard(i + 1));
    const tiles = srcs.map((src, i) => `<span class="ph" data-i="${i}"><img src="${src}" alt="" loading="lazy"></span>`).join("");
    app.append(h(`<div class="loupe"></div><div class="strip-wrap"><div class="strip">${tiles}</div></div>`));

    const wrap = app.querySelector(".strip-wrap");
    const loupe = app.querySelector(".loupe");
    const ZOOM = 5.2;

    // vertical wheel scrolls horizontally
    on(wrap, "wheel", (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { wrap.scrollLeft += e.deltaY; e.preventDefault(); }
    }, { passive: false });

    if (!matchMedia("(hover: hover)").matches) return;
    let hot = null;
    on(wrap, "mousemove", (e) => {
      const t = e.target.closest(".ph");
      if (!t) return off();
      if (t !== hot) {
        if (hot) hot.classList.remove("hot");
        hot = t; hot.classList.add("hot");
        loupe.style.backgroundImage = `url("${srcs[+t.dataset.i]}")`;
      }
      const r = t.getBoundingClientRect();
      const u = (e.clientX - r.left) / r.width, v = (e.clientY - r.top) / r.height;
      const bw = innerWidth * ZOOM * 0.4, bh = bw * (r.height / r.width);
      loupe.style.backgroundSize = `${bw}px ${bh}px`;
      loupe.style.backgroundPosition = `${innerWidth / 2 - u * bw}px ${innerHeight / 2 - v * bh}px`;
      loupe.classList.add("on"); body.classList.add("loupe-on");
    });
    const off = () => {
      if (hot) hot.classList.remove("hot");
      hot = null; loupe.classList.remove("on"); body.classList.remove("loupe-on");
    };
    on(wrap, "mouseleave", off);
    on(wrap, "scroll", off);
  }

  // 백 초 세기 — pinch zoom + focusing
  function grid(w) {
    const n = w.images.length || w.count;
    const tiles = Array.from({ length: n }, (_, i) => img(w.images[i])).join("");
    app.append(h(`<div class="grid-wrap"><div class="grid" style="--cols:${w.columns}">${tiles}</div></div>
      <div class="grid-hint">pinch / ⌘ + scroll to zoom</div>`));

    const wrap = app.querySelector(".grid-wrap");
    const g = app.querySelector(".grid");
    const cells = [...g.children];
    // each tile has its own drift direction, fixed for this visit
    const drift = cells.map(() => {
      const a = Math.random() * Math.PI * 2, m = 0.35 + Math.random() * 0.65;
      return [Math.cos(a) * m, Math.sin(a) * m];
    });

    let cell = innerWidth < 760 ? 26 : 40;
    const MIN = 18, MAX = 220;
    const setCell = (c, ox, oy) => {
      const prev = cell;
      cell = Math.max(MIN, Math.min(MAX, c));
      g.style.setProperty("--cell", cell + "px");
      // keep the point under the fingers/cursor in place
      if (ox != null) {
        const k = cell / prev;
        const r = g.getBoundingClientRect();
        const px = ox - r.left, py = oy - r.top;
        wrap.scrollLeft += px * (k - 1);
        window.scrollBy(0, py * (k - 1));
      }
    };
    setCell(cell);

    // trackpad pinch arrives as ctrl+wheel; also allow ⌘/ctrl + scroll
    on(wrap, "wheel", (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      setCell(cell * Math.exp(-e.deltaY * 0.01), e.clientX, e.clientY);
      focus(e.clientX, e.clientY);
    }, { passive: false });

    // touch pinch
    let pinch = null;
    const dist = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
    on(wrap, "touchstart", (e) => { if (e.touches.length === 2) pinch = { d: dist(e.touches), c: cell }; }, { passive: true });
    on(wrap, "touchmove", (e) => {
      if (!pinch || e.touches.length !== 2) return;
      e.preventDefault();
      const mx = (e.touches[0].clientX + e.touches[1].clientX) / 2, my = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      setCell(pinch.c * dist(e.touches) / pinch.d, mx, my);
    }, { passive: false });
    on(wrap, "touchend", () => { pinch = null; });

    on(window, "keydown", (e) => {
      if (e.key === "+" || e.key === "=") setCell(cell * 1.25);
      if (e.key === "-" || e.key === "_") setCell(cell / 1.25);
    });

    // focusing: tiles near the cursor stay in register, distant ones drift loose
    let raf = 0, last = null;
    const focus = (x, y) => { last = [x, y]; if (!raf) raf = requestAnimationFrame(apply); };
    const apply = () => {
      raf = 0;
      const r0 = cell * 1.6, r1 = cell * 9, amp = cell * 0.85;
      cells.forEach((c, i) => {
        let f = 0;
        if (last) {
          const r = c.getBoundingClientRect();
          const d = Math.hypot(r.left + r.width / 2 - last[0], r.top + r.height / 2 - last[1]);
          const t = Math.max(0, Math.min(1, (d - r0) / (r1 - r0)));
          f = t * t * (3 - 2 * t);
        }
        c.style.transform = f ? `translate(${drift[i][0] * amp * f}px, ${drift[i][1] * amp * f}px)` : "";
      });
    };
    if (matchMedia("(hover: hover)").matches) {
      on(g, "mousemove", (e) => focus(e.clientX, e.clientY));
      on(g, "mouseleave", () => { last = null; if (!raf) raf = requestAnimationFrame(apply); });
    }
    cleanup.push(() => cancelAnimationFrame(raf));
  }

  /* ---------- about ---------- */
  function about(tab) {
    body.classList.add("is-about");
    document.title = `About — ${S.name}`;
    const A = S.about;
    const tabs = [["cv", "CV"], ["text", "Text"], ["contact", "Contact"]];
    app.append(h(`
      <nav class="sub-nav">${tabs.map(([k, l]) => `<a href="#/about/${k}" class="${k === tab ? "on" : ""}">${l}</a>`).join("")}</nav>
      <div class="lang"><button data-lang="kor" class="${lang === "kor" ? "on" : ""}">KOR</button><button data-lang="eng" class="${lang === "eng" ? "on" : ""}">ENG</button></div>
      <section class="about"></section>`));
    const sec = app.querySelector(".about");

    app.querySelectorAll("[data-lang]").forEach((b) => on(b, "click", () => {
      lang = b.dataset.lang; store.set("yk-lang", lang); route();
    }));

    if (tab === "cv") {
      sec.append(h(`<p class="statement">${A.statement[lang]}</p>
        <div class="cv">${A.cv.map((s) => `<section>
          <h2>${s.head[lang]}</h2>
          <div class="cv-table">${s.rows.map((r) => {
            const cells = r[lang];
            return `<div class="cols-${cells.length}">${cells.map((c) => `<span>${c}</span>`).join("")}</div>`;
          }).join("")}</div>
        </section>`).join("")}</div>`));
    }

    if (tab === "text") {
      sec.append(h(`<div class="texts">${A.texts.map((t) => `<article>
        <h2><span>${t.title}</span><br>${t.author}</h2>
        <div class="body">${t.body.map((p) => `<p>${p}</p>`).join("")}</div>
      </article>`).join("")}</div>`));
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
          <p>please enter your e-mail to download:</p>
          <input type="email" required placeholder="Your email" autocomplete="email">
          <label><input type="checkbox"><span class="box">[ ]</span> I’ve read and I accept the Terms and Privacy Policy</label>
          <button class="submit" type="submit" disabled>Submit</button>
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
        msg.textContent = "Thank you.";
      });
    }
  }

  window.addEventListener("hashchange", route);
  route();
})();
