/* ==========================================================================
   MAIN
   ========================================================================== */
(function () {
  "use strict";

  const D = window.SITE;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const html = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hasGSAP = !!(window.gsap && window.ScrollTrigger);
  if (reduce) html.classList.add("no-motion");
  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);

  const pad = (n) => String(n).padStart(2, "0");
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const sfx = (...a) => window.Sound && Sound.play(...a);
  const photoSrc = (slug, sm) => `assets/img/photo/${slug}${sm ? "-sm" : ""}.jpg`;
  const designSrc = (slug, sm) => `assets/img/design/${slug}${sm ? "-sm" : ""}.jpg`;
  const kidSrc = (file) => `assets/img/kidureka/${file}`;

  /* ---------------- grain ---------------- */
  (function () {
    const c = document.createElement("canvas");
    c.width = c.height = 220;
    const x = c.getContext("2d");
    const d = x.createImageData(220, 220);
    for (let i = 0; i < d.data.length; i += 4) {
      const v = Math.random() * 255;
      d.data[i] = d.data[i + 1] = d.data[i + 2] = v;
      d.data[i + 3] = 255;
    }
    x.putImageData(d, 0, 0);
    $(".grain").style.backgroundImage = `url(${c.toDataURL()})`;
  })();

  /* ==================================================================
     BUILD CONTENT
     ================================================================== */

  // split headings into letters
  function splitChars(el) {
    const t = el.textContent;
    el.textContent = "";
    return Array.from(t).map((c) => {
      const sp = document.createElement("span");
      sp.className = "char";
      sp.textContent = c === " " ? "\u00a0" : c;
      el.appendChild(sp);
      return sp;
    });
  }
  const nameChars = $$("#name [data-split]").map(splitChars);
  const rollChars = $$("#rollTitle [data-split]").map(splitChars);

  // texts
  $("#introText").textContent = D.intro;
  $("#photoStatement").textContent = D.photography.statement;
  $("#designStatement").textContent = D.design.statement;
  $("#filmStatement").textContent = D.film.statement;

  // ---- photography gallery: justified rows at true proportions ----
  const P = D.photography;
  const photoOrder = [];
  $("#gallery").innerHTML = P.rows
    .map((row) => {
      const items = row
        .map((slug) => {
          const p = P.photos[slug];
          const idx = photoOrder.push(slug) - 1;
          const ratio = p.w / p.h;
          return `<figure class="plate" style="flex:${ratio.toFixed(4)} 1 0" data-index="${idx}" data-cursor="View" tabindex="0" role="button" aria-label="${p.title}. Open full screen">
            <div class="plate__frame"><img src="${photoSrc(slug, true)}" srcset="${photoSrc(slug, true)} 1000w, ${photoSrc(slug)} 2200w" sizes="(max-width: 820px) 100vw, 60vw" width="${p.w}" height="${p.h}" alt="${p.title}" loading="lazy" decoding="async"></div>
            <figcaption><span class="plate__no">Plate ${pad(idx + 1)}</span><span class="plate__t">${p.title}</span><span class="plate__k">${p.kind}</span></figcaption>
          </figure>`;
        })
        .join("");
      return `<div class="g-row">${items}</div>`;
    })
    .join("");
  // trust the file: if a photo is replaced, its true proportions are used automatically
  $$(".plate img").forEach((im) => {
    const fix = () => {
      if (!im.naturalWidth) return;
      const r = im.naturalWidth / im.naturalHeight;
      im.closest(".plate").style.flex = `${r.toFixed(4)} 1 0`;
      im.setAttribute("width", im.naturalWidth);
      im.setAttribute("height", im.naturalHeight);
    };
    im.complete ? fix() : im.addEventListener("load", fix);
  });
  $("#photoRules").innerHTML = P.rules.map(([t, d]) => `<div><h4>${t}</h4><p>${d}</p></div>`).join("");

  // ---- design ----
  const G = D.design;
  $("#job").innerHTML = `
    <div>
      <p class="job__k">Currently</p>
      <h3 class="job__co">${G.job.company}</h3>
      <p class="job__line">${G.job.line}</p>
    </div>
    <div class="job__meta"><b>${G.job.role}</b><span>Since ${G.job.since}</span></div>`;

  const K = G.kidureka;
  $("#kidureka").innerHTML = `
    <div><h3 class="brand__n">${K.name}</h3><p class="brand__about">${K.about}</p></div>
    <div class="chips">${K.did.map((d) => `<span>${d}</span>`).join("")}</div>`;

  const kidLightbox = [];
  const imgTag = (pair, alt, cls) => {
    const i = kidLightbox.push({ local: kidSrc(pair[0]), remote: pair[1], title: alt, kind: "Kidureka" }) - 1;
    return `<div class="sheet ${cls}" data-kid="${i}" data-cursor="View"><img src="${kidSrc(pair[0])}" data-fallback="${pair[1]}" alt="${alt}" loading="lazy" decoding="async"></div>`;
  };
  $("#cases").innerHTML = K.products
    .map(
      (p, i) => `
    <article class="case">
      <div class="case__media">
        <i class="ghost ghost--c"></i><i class="ghost ghost--m"></i><i class="ghost ghost--y"></i>
        ${imgTag(p.images[0], p.name + ", product mockup", "sheet--main")}
        ${p.images[1] ? imgTag(p.images[1], p.name + ", product detail", "sheet--alt") : ""}
        <i class="crop crop--tl"></i><i class="crop crop--tr"></i><i class="crop crop--bl"></i><i class="crop crop--br"></i><i class="reg"></i>
      </div>
      <div class="case__text">
        <span class="case__no">Kidureka ${pad(i + 1)} / ${pad(K.products.length)}</span>
        <h4 class="case__name">${p.name}</h4>
        <p class="case__tag">${p.tag}</p>
        <p class="case__why-k">Why it looks like this</p>
        <p class="case__why">${p.why}</p>
        <a class="case__link" href="${p.url}" target="_blank" rel="noopener">See it live on kidureka.com</a>
      </div>
    </article>`
    )
    .join("");
  $("#process").innerHTML = `
    <h4 class="process__h">How I build a product mockup</h4>
    <div class="process__row">${K.process.map(([t, d], i) => `<div class="step"><span class="step__n">${i + 1}</span><h4>${t}</h4><p>${d}</p></div>`).join("")}</div>`;

  const T = G.toppersnotes;
  $("#toppersnotes").innerHTML = `
    <div><h3 class="brand__n">${T.name}</h3><p class="brand__about">${T.about}</p></div>
    <div class="chips">${T.did.map((d) => `<span>${d}</span>`).join("")}</div>
    <p class="brand__line">${T.line}</p>
    ${T.covers.length ? `<div class="tn-covers">${T.covers.map((c) => `<img src="${c.src}" alt="${c.title || "Toppersnotes cover"}" loading="lazy">`).join("")}</div>` : ""}`;

  // image fallback: local file first, then the live image, then a clear note
  $$("img[data-fallback]").forEach((img) => {
    img.addEventListener("error", function onErr() {
      if (img.dataset.fallback && img.src.indexOf(img.dataset.fallback) === -1) {
        img.src = img.dataset.fallback;
      } else {
        img.removeEventListener("error", onErr);
        const ph = document.createElement("div");
        ph.className = "img-missing";
        ph.textContent = "Image not found. Run get-images.sh once to download it.";
        img.replaceWith(ph);
      }
    });
  });

  // independent work: everything on one wall
  $("#wallGrid").innerHTML = G.independent
    .map((d, i) => `
    <figure class="pin" data-index="${i}" style="--r:${[-2.2, 1.6, -1.2, 2.4, -1.8, 1.2, 2, -2.6, 1.4][i % 9]}deg">
      <span class="pin__tape" aria-hidden="true"></span>
      <button class="pin__img" type="button" data-cursor="View" aria-label="${d.title}. Open full screen">
        <img src="${designSrc(d.slug, true)}" width="${d.w}" height="${d.h}" alt="${d.title}" loading="lazy" decoding="async">
      </button>
      <figcaption><span class="pin__k">${pad(i + 1)} &nbsp; ${d.kind}</span><b class="pin__t">${d.title}</b><span class="pin__m">${d.motive}</span></figcaption>
    </figure>`)
    .join("");

  // ---- film ----
  const F = D.film.feature;
  $("#featureStatus").textContent = F.status;
  $("#featureDeva").textContent = F.devanagari;
  $("#featureTagline").remove();
  $("#featureLogline").textContent = F.logline;
  $("#featureTitle").setAttribute("aria-label", F.title);
  $("#featureTitle").textContent = "";
  $("#featureTitle").innerHTML = Array.from(F.title).map((c) => `<span class="char" aria-hidden="true">${c}</span>`).join("");
  $("#featureStats").innerHTML = F.stats.map((s) => `<div class="stat"><b data-count="${s.n}">0</b><span>${s.label}</span></div>`).join("");
  $("#featureChapters").innerHTML = F.chapters.map((c, i) => `<li><em>Chapter ${i + 1}</em>${c}</li>`).join("");
  $("#featureNotes").innerHTML = F.notes.map((n) => `<li>${n}</li>`).join("");
  const POSTER_ART = {
    wave: `<svg viewBox="0 0 200 120" class="pa pa--wave">${Array.from({ length: 41 }, (_, i) => { const x = 10 + i * 4.5, h = 6 + Math.abs(Math.sin(i * 0.55) * Math.cos(i * 0.21)) * 46; return `<rect x="${x}" y="${60 - h / 2}" width="2.2" height="${h}" rx="1.1" style="--d:${(i % 9) * 0.11}s"/>`; }).join("")}</svg>`,
    rings: `<svg viewBox="0 0 200 200" class="pa pa--rings">${Array.from({ length: 9 }, (_, i) => `<ellipse cx="${100 + i * 1.6}" cy="${100 - i}" rx="${12 + i * 10}" ry="${10 + i * 9.4}" style="--d:${i * 0.2}s"/>`).join("")}<circle cx="100" cy="100" r="3"/></svg>`,
    thread: `<svg viewBox="0 0 200 240" class="pa pa--thread"><path d="M-10 40 C 60 10, 140 80, 100 120 S 30 200, 210 210"/><circle cx="100" cy="120" r="5"/></svg>`
  };
  $("#posters").innerHTML = D.film.slate
    .map((f, i) => `
    <article class="poster poster--${f.poster}" tabindex="0">
      <div class="poster__sheet">
        <span class="poster__top">${f.genre}</span>
        <div class="poster__art" aria-hidden="true">${POSTER_ART[f.poster] || ""}</div>
        <p class="poster__hook">${f.hook || ""}</p>
        <h4 class="poster__title">${f.title}</h4>
        <span class="poster__billing">Written and directed by Mayank Sharma</span>
        <span class="poster__status">${f.status}</span>
      </div>
      <p class="poster__line">${f.line}</p>
    </article>`)
    .join("");

  // ---- film: crafts, writing sample, cinematography, reels ----
  const FW = D.film;
  $("#crafts").innerHTML = FW.crafts
    .map((c, i) => `
    <article class="craft">
      <span class="craft__n">${pad(i + 1)}</span>
      <h4 class="craft__verb">${c.verb}</h4>
      <p class="craft__line">${c.line}</p>
      <ul class="craft__list">${c.offers.map((o) => `<li>${o}</li>`).join("")}</ul>
      <a class="craft__cta" href="#contact">Hire me to ${c.verb.replace(/^I /, "").toLowerCase()}</a>
    </article>`)
    .join("");

  const SM = FW.sample;
  $("#psSheet").innerHTML =
    SM.lines.map(([k, t, note]) => `<p class="sl sl--${k}">${note ? `<sup class="sl__mark">${note}</sup>` : ""}${t}</p>`).join("") +
    `<span class="ps-page">1.</span><span class="ps-src">${SM.source}</span>`;
  $("#psNotes").innerHTML = SM.notes.map((n, i) => `<li><b>${i + 1}</b><span>${n}</span></li>`).join("");

  const EY = FW.eye;
  $("#eyeIntro").textContent = EY.intro;
  $("#frames").innerHTML = EY.frames
    .map((f) => {
      const p = P.photos[f.slug];
      const g = f.guides || {};
      const lines = (g.lines || []).map(([x1, y1, x2, y2]) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" pathLength="1"/>`).join("");
      const rect = g.rect ? `<rect x="${g.rect[0]}" y="${g.rect[1]}" width="${g.rect[2]}" height="${g.rect[3]}" pathLength="1"/>` : "";
      const marks = [...(g.lamps || []).map(([x, y]) => `<i class="mk mk--lamp" style="left:${x}%;top:${y}%"></i>`), g.dot ? `<i class="mk mk--dot" style="left:${g.dot[0]}%;top:${g.dot[1]}%"></i>` : ""].join("");
      return `
      <figure class="fr">
        <div class="fr__img">
          <img src="${photoSrc(f.slug, true)}" width="${p.w}" height="${p.h}" alt="${p.title}" loading="lazy" decoding="async">
          <svg class="fr__guides" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${lines}${rect}</svg>
          ${marks}
          <span class="fr__corner fr__corner--tl"></span><span class="fr__corner fr__corner--br"></span>
        </div>
        <figcaption><b>${f.title}</b><span>${f.note}</span></figcaption>
      </figure>`;
    })
    .join("");
  $("#kit").innerHTML = EY.kit.map((k) => `<li>${k}</li>`).join("");

  // reels
  $("#reelsIntro").textContent = FW.reelsIntro;
  const reelKind = (src) => /\.(mp4|webm|mov)(\?|$)/i.test(src) ? "video" : /instagram\.com\/(reel|p)\//i.test(src) ? "instagram" : /youtu(\.be|be\.com)/i.test(src) ? "youtube" : "link";
  const ytId = (src) => (src.match(/(?:shorts\/|v=|youtu\.be\/|embed\/)([\w-]{6,})/) || [])[1];
  const igId = (src) => (src.match(/instagram\.com\/(?:reel|p)\/([\w-]+)/) || [])[1];
  if (FW.reels.length) {
    $("#reelsRow").innerHTML = FW.reels
      .map((r, i) => {
        const k = reelKind(r.src);
        const media = k === "video"
          ? `<video src="${r.src}" ${r.poster ? `poster="${r.poster}"` : ""} muted loop playsinline preload="metadata"></video>`
          : r.poster ? `<img src="${r.poster}" alt="" loading="lazy">` : `<span class="reel__ph"><b>${k === "instagram" ? "Instagram" : k === "youtube" ? "YouTube" : "Reel"}</b></span>`;
        return `
        <button class="reel" type="button" data-reel="${i}" data-cursor="Play" aria-label="Play ${r.title}">
          <span class="reel__phone"><span class="reel__screen">${media}<span class="reel__play" aria-hidden="true"></span></span></span>
          <span class="reel__t">${r.title}</span>
          <span class="reel__r">${r.role || "Shot and edited"}</span>
        </button>`;
      })
      .join("");
  } else {
    // nothing added yet: three test-pattern screens and a link to the live feed
    $("#reelsRow").innerHTML = [0, 1, 2]
      .map((i) => `
      <a class="reel reel--empty" href="${FW.reelsLink}" target="_blank" rel="noopener" data-cursor="Watch">
        <span class="reel__phone"><span class="reel__screen"><span class="bars-tv" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span><span class="reel__soon">Reel ${pad(i + 1)}</span></span></span>
      </a>`)
      .join("");
  }
  $("#reelsCta").innerHTML = `<a class="studio__btn" href="${FW.reelsLink}" target="_blank" rel="noopener">Watch the latest reels on Instagram</a>`;

  const S = D.film.studio;
  const nodes = S.verticals.map((v, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 2;
    const x = 250 + Math.cos(a) * 190, y = 250 + Math.sin(a) * 190;
    const lx = 250 + Math.cos(a) * 236, ly = 250 + Math.sin(a) * 236;
    const anchor = Math.abs(Math.cos(a)) < 0.1 ? "middle" : Math.cos(a) > 0 ? "start" : "end";
    const cls = v.when === "Now" ? "is-now" : v.when === "Next" ? "is-next" : "";
    return `<g class="o-node ${cls}"><circle cx="${x}" cy="${y}" r="11"/><text x="${lx}" y="${ly}" text-anchor="${anchor}" dominant-baseline="middle">${v.name}</text><text class="o-when" x="${lx}" y="${ly + 18}" text-anchor="${anchor}" dominant-baseline="middle">${v.when}</text></g>`;
  });
  $("#studio").innerHTML = `
    <div class="studio__orbit" aria-hidden="true">
      <svg viewBox="-90 -30 680 560">
        <circle class="o-ring" cx="250" cy="250" r="190"/>
        <circle class="o-ring" cx="250" cy="250" r="130" stroke-dasharray="2 6"/>
        <circle class="o-draw" cx="250" cy="250" r="190" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" transform="rotate(-90 250 250)"/>
        ${nodes.join("")}
      </svg>
      <div class="studio__core"><div><b>शून्याकार</b><span>${S.name}</span></div></div>
    </div>
    <div>
      <p class="studio__k">The production house</p>
      <h3 class="studio__h">I'm building ${S.name}</h3>
      <p class="studio__m">${S.meaning}</p>
      <p class="studio__p">${S.line}</p>
      <ul class="studio__list">${S.verticals.map((v) => `<li class="${v.when === "Now" ? "is-now" : ""}"><b>${v.name}</b><span>${v.line}</span><em>${v.when}</em></li>`).join("")}</ul>
      ${S.url ? `<a class="studio__btn" href="${S.url}" target="_blank" rel="noopener">Visit the studio</a>` : ""}
    </div>`;

  // ---- tools: original emblems, one idea per tool ----
  const EM = {
    ps: `<svg viewBox="0 0 200 200"><g class="em-layer em-layer--1"><rect class="d" x="38" y="38" width="96" height="96" rx="14"/></g><g class="em-layer em-layer--2"><rect class="s" x="52" y="52" width="96" height="96" rx="14"/></g><g class="em-layer em-layer--3"><rect class="f" x="66" y="66" width="96" height="96" rx="14" opacity=".28"/></g><ellipse class="s em-ants" cx="100" cy="100" rx="82" ry="62"/></svg>`,
    ai: `<svg viewBox="0 0 200 200"><path class="s em-curve" d="M24 150 C 44 40, 156 40, 176 150"/><line class="d" x1="24" y1="150" x2="44" y2="40"/><line class="d" x1="176" y1="150" x2="156" y2="40"/><g class="em-handle"><line class="s" x1="58" y1="68" x2="142" y2="68" stroke-width="1.5"/><circle class="f" cx="58" cy="68" r="5"/><circle class="f" cx="142" cy="68" r="5"/><rect class="f" x="94" y="62" width="12" height="12"/></g><rect class="f" x="18" y="144" width="12" height="12"/><rect class="f" x="170" y="144" width="12" height="12"/><circle class="s" cx="44" cy="40" r="5"/><circle class="s" cx="156" cy="40" r="5"/></svg>`,
    pr: `<svg viewBox="0 0 200 200"><line class="d" x1="20" y1="70" x2="180" y2="70"/><line class="d" x1="20" y1="100" x2="180" y2="100"/><line class="d" x1="20" y1="130" x2="180" y2="130"/><rect class="f em-clip em-clip--a" x="30" y="61" width="62" height="18" rx="4"/><rect class="s em-clip em-clip--b" x="96" y="91" width="74" height="18" rx="4"/><rect class="f em-clip" x="44" y="121" width="96" height="18" rx="4" opacity=".45"/><g class="em-playhead"><line class="s" x1="25" y1="44" x2="25" y2="156"/><path class="f" d="M17 38 h16 l-8 10z"/></g></svg>`,
    fcp: `<svg viewBox="0 0 200 200"><g class="em-split em-split--l"><rect class="s" x="20" y="66" width="76" height="68" rx="6"/><rect class="f" x="28" y="72" width="8" height="8" rx="2"/><rect class="f" x="46" y="72" width="8" height="8" rx="2"/><rect class="f" x="64" y="72" width="8" height="8" rx="2"/><rect class="f" x="28" y="120" width="8" height="8" rx="2"/><rect class="f" x="46" y="120" width="8" height="8" rx="2"/><rect class="f" x="64" y="120" width="8" height="8" rx="2"/></g><g class="em-split em-split--r"><rect class="s" x="104" y="66" width="76" height="68" rx="6"/><rect class="f" x="126" y="72" width="8" height="8" rx="2"/><rect class="f" x="144" y="72" width="8" height="8" rx="2"/><rect class="f" x="162" y="72" width="8" height="8" rx="2"/><rect class="f" x="126" y="120" width="8" height="8" rx="2"/><rect class="f" x="144" y="120" width="8" height="8" rx="2"/><rect class="f" x="162" y="120" width="8" height="8" rx="2"/></g><g class="em-blade"><path class="f" d="M100 150 L92 40 L108 40 Z" opacity=".9"/></g></svg>`,
    fd: `<svg viewBox="0 0 200 200"><rect class="s" x="46" y="22" width="108" height="156" rx="6"/><path class="s em-type" d="M60 46 H120" stroke-width="5"/><path class="d em-type em-type--2" d="M60 66 H140 M60 76 H132"/><path class="s em-type em-type--3" d="M86 98 H114" stroke-width="3.5"/><path class="d em-type em-type--4" d="M74 112 H128 M74 122 H120"/><path class="d" d="M60 144 H140 M60 154 H118"/><rect class="f em-caret" x="120" y="150" width="3" height="10"/></svg>`
  };
  $("#toolsRow").innerHTML = D.tools
    .map(
      (t) => `
    <button class="tool" type="button" style="--tc:${t.color}" aria-label="${t.name} by ${t.maker}. ${t.use}">
      <span class="tool__em" aria-hidden="true">${EM[t.key] || ""}</span>
      <span><span class="tool__maker">${t.maker}</span><span class="tool__name">${t.name}</span><span class="tool__use">${t.use}</span></span>
    </button>`
    )
    .join("");

  // contact
  $("#ctaMail").href = `mailto:${D.email}?subject=${encodeURIComponent("Let's make something")}`;
  $("#ctaWa").href = `https://wa.me/${D.whatsapp}`;
  $("#ctaIg").href = `https://instagram.com/${D.instagram}`;
  $$(".js-year").forEach((e) => (e.textContent = new Date().getFullYear()));
  const fmtClock = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });
  const tickClock = () => $$(".js-clock").forEach((e) => (e.textContent = fmtClock.format(new Date())));
  tickClock();
  setInterval(tickClock, 20000);

  // word splitting for scroll-lit paragraphs
  $$("[data-words]").forEach((p) => {
    p.innerHTML = p.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(" ");
  });

  // gate words split into letters
  $$("[data-zoom-word]").forEach((w) => {
    const t = w.textContent;
    w.setAttribute("aria-label", t);
    w.innerHTML = Array.from(t).map((c) => `<span class="zc" aria-hidden="true">${c}</span>`).join("");
  });

  /* ==================================================================
     POINTER
     ================================================================== */
  const ptr = { x: innerWidth / 2, y: innerHeight * 0.45, vx: 0, vy: 0, has: false, lx: 0, ly: 0 };
  addEventListener("pointermove", (e) => {
    ptr.x = e.clientX;
    ptr.y = e.clientY;
    if (e.pointerType === "mouse") ptr.has = true;
  }, { passive: true });

  /* ==================================================================
     LANDING: light-leak shader
     ================================================================== */
  const leak = { tint: [1, 0.7, 0.1], amt: 0, target: 0, tTarget: [1, 0.7, 0.1], visible: true };
  (function shader() {
    const canvas = $("#leak");
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, preserveDrawingBuffer: false });
    if (!gl) { canvas.remove(); return; }
    const vs = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;
    const fs = `precision highp float;
uniform vec2 r;uniform float t;uniform vec2 m;uniform vec3 tint;uniform float ta;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fb(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
void main(){
 vec2 uv=gl_FragCoord.xy/r; vec2 p=(gl_FragCoord.xy-.5*r)/r.y; float s=t*.07;
 vec2 q=vec2(fb(p*1.3+s),fb(p*1.3-s+3.1));
 vec2 w=vec2(fb(p*1.7+q*1.7+vec2(1.7,9.2)+s*1.3),fb(p*1.7+q*1.7+vec2(8.3,2.8)-s));
 float f=fb(p*1.1+w*1.9);
 vec3 night=vec3(.03,.02,.06), violet=vec3(.42,.12,.98), rani=vec3(1.,.16,.47), saff=vec3(1.,.5,.06), teal=vec3(.0,.62,.68);
 vec3 c=mix(night,violet,smoothstep(.25,.75,f));
 c=mix(c,rani,smoothstep(.5,.9,w.x)*.9);
 c=mix(c,saff,smoothstep(.55,.95,q.y*f*1.7)*.95);
 c=mix(c,teal,smoothstep(.62,.95,w.y)*.35);
 c=mix(c,tint,ta*smoothstep(.25,.85,f));
 vec2 mm=(m-.5*r)/r.y; c+=mix(saff,tint,ta)*.32*exp(-6.*length(p-mm));
 float cd=length(p*vec2(.9,1.4)); c*=mix(.42,1.,smoothstep(.05,.75,cd));
 c*=1.-.55*pow(length(uv-.5)*1.25,2.2);
 c+=(h(gl_FragCoord.xy+fract(t)*91.)-.5)*.07;
 gl_FragColor=vec4(c,1.);
}`;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.remove(); return; }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (n) => gl.getUniformLocation(prog, n);
    const uR = U("r"), uT = U("t"), uM = U("m"), uTint = U("tint"), uTa = U("ta");
    const scale = 0.5;
    function size() {
      canvas.width = Math.round(canvas.clientWidth * scale);
      canvas.height = Math.round(canvas.clientHeight * scale);
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    size();
    addEventListener("resize", size);
    const t0 = performance.now();
    let mx = canvas.width / 2, my = canvas.height / 2;
    (function frame() {
      if (leak.visible && !document.hidden) {
        const t = reduce ? 20 : (performance.now() - t0) / 1000;
        mx = lerp(mx, ptr.x * scale, 0.05);
        my = lerp(my, (canvas.clientHeight - ptr.y) * scale, 0.05);
        leak.amt = lerp(leak.amt, leak.target, 0.04);
        for (let i = 0; i < 3; i++) leak.tint[i] = lerp(leak.tint[i], leak.tTarget[i], 0.06);
        gl.uniform2f(uR, canvas.width, canvas.height);
        gl.uniform1f(uT, t);
        gl.uniform2f(uM, mx, my);
        gl.uniform3f(uTint, leak.tint[0], leak.tint[1], leak.tint[2]);
        gl.uniform1f(uTa, leak.amt);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      requestAnimationFrame(frame);
    })();
  })();

  /* ==================================================================
     NAME: letters gain weight where the light (your cursor) falls
     ================================================================== */
  const kin = [
    { lines: nameChars, w: nameChars.map((l) => l.map(() => 420)), el: $("#name") },
    { lines: rollChars, w: rollChars.map((l) => l.map(() => 420)), el: $("#rollTitle") }
  ];
  const nameEl = $("#name");
  function loop(t) {
    kin.forEach((k, ki) => {
      const r = k.el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      k.lines.forEach((line, li) =>
        line.forEach((c, i) => {
          let infl;
          if (ptr.has && !reduce) {
            const cr = c.getBoundingClientRect();
            const dx = ptr.x - (cr.left + cr.width / 2);
            const dy = (ptr.y - (cr.top + cr.height / 2)) * 0.7;
            const sig = innerWidth * 0.12;
            infl = Math.exp(-(dx * dx + dy * dy) / (2 * sig * sig));
          } else {
            infl = reduce ? 0.2 : Math.pow((Math.sin(t / 900 - i * 0.6 - li * 1.3 - ki) + 1) / 2, 4);
          }
          const target = 420 + 480 * infl;
          k.w[li][i] = lerp(k.w[li][i], target, 0.1);
          c.style.fontVariationSettings = `"wght" ${k.w[li][i].toFixed(0)}`;
        })
      );
    });
    // the name leans gently toward the light
    if (ptr.has && !reduce) {
      const nx = (ptr.x / innerWidth - 0.5), ny = (ptr.y / innerHeight - 0.5);
      nameEl.style.setProperty("--tx", (nx * -14).toFixed(2) + "px");
      nameEl.style.setProperty("--ty", (ny * -10).toFixed(2) + "px");
      nameEl.style.setProperty("--lx", (ptr.x / innerWidth * 100).toFixed(1) + "%");
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  /* portals steer the light and pull one colour channel forward */
  const tints = { photo: [1, 0.15, 0.2], design: [0.17, 0.3, 1], film: [1, 0.7, 0.1] };
  const pentatonic = { photo: 659.25, design: 783.99, film: 987.77 };
  $$(".portal").forEach((p) => {
    const w = p.dataset.portal;
    const on = () => {
      leak.tTarget = tints[w];
      leak.target = 0.75;
      sfx("tick", pentatonic[w], 0.08);
    };
    const off = () => {
      leak.target = 0;
    };
    p.addEventListener("pointerenter", on);
    p.addEventListener("focus", on);
    p.addEventListener("pointerleave", off);
    p.addEventListener("blur", off);
  });

  /* ==================================================================
     SOUND
     ================================================================== */
  const soundBtn = $("#soundToggle"), pill = $("#soundPill");
  function soundUI() {
    soundBtn.setAttribute("aria-pressed", String(Sound.on));
    $(".sound-toggle__label").textContent = Sound.on ? "Sound on" : "Sound off";
    pill.classList.toggle("is-on", !Sound.on);
  }
  soundBtn.addEventListener("click", () => { Sound.toggle(); soundUI(); sfx("chord", [261.63, 329.63, 392, 523.25]); });
  pill.addEventListener("click", () => { Sound.enable(); soundUI(); sfx("chord", [261.63, 329.63, 392, 523.25]); });
  soundUI();

  /* ==================================================================
     LANDING INTRO: visible from the first frame
     ================================================================== */
  if (hasGSAP && !reduce) {
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    // a focus pull: each letter racks from blur to sharp
    tl.from(".hero__leak", { opacity: 0, duration: 2, ease: "power2.out" }, 0)
      .from(nameChars[0], { opacity: 0, filter: "blur(22px)", yPercent: 18, scale: 1.25, duration: 1.8, stagger: { each: 0.06, from: "center" } }, 0.1)
      .from(nameChars[1], { opacity: 0, filter: "blur(22px)", yPercent: -18, scale: 1.25, duration: 1.8, stagger: { each: 0.06, from: "center" } }, 0.25)
      .from(".name__line--2", { letterSpacing: "0.6em", duration: 2.2 }, 0.25)
      .from(".name__rule i", { scaleX: 0, duration: 1.6 }, 0.9)
      .from(".name__rule b", { opacity: 0, y: 8, duration: 1.2 }, 1.1)
      .from(".hero__line", { y: -16, opacity: 0, duration: 1.2 }, 0.5)
      .from(".nav", { opacity: 0, duration: 1.2 }, 0.5)
      .from(".portal", { y: 50, opacity: 0, duration: 1.2, stagger: 0.1 }, 0.8)
      .from(".badge", { scale: 0, rotate: -120, duration: 1.6 }, 0.9)
      .from(".sound-pill", { opacity: 0, y: -8, duration: 1 }, 1.4);
  }

  /* ==================================================================
     SCROLL
     ================================================================== */
  let lenis = null;
  if (hasGSAP && !reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // measure where the stem of a letter sits, so the zoom flies straight into the ink
  function stemRatio(ch) {
    try {
      const S = 200, c = document.createElement("canvas");
      c.width = S * 2; c.height = S;
      const x = c.getContext("2d");
      x.font = `900 ${S}px Anybody`;
      const w = x.measureText(ch).width;
      x.fillText(ch, 0, S * 0.9);
      const y = Math.round(S * 0.9 - S * 0.12);
      const row = x.getImageData(0, y, c.width, 1).data;
      let a = -1, b = -1;
      for (let i = 0; i < c.width; i++) {
        const on = row[i * 4 + 3] > 140;
        if (on && a < 0) a = i;
        if (!on && a >= 0) { b = i; break; }
      }
      if (a < 0 || b < 0) return { r: 0.2, sw: 0.2 };
      return { r: (a + b) / 2 / w, sw: (b - a) / S };
    } catch (e) {
      return { r: 0.2, sw: 0.2 };
    }
  }

  function initScroll() {
    const ST = ScrollTrigger;

    // nav hide/show + section state
    const nav = $("#nav");
    ST.create({
      start: 140, end: "max",
      onUpdate: (s) => nav.classList.toggle("is-hidden", s.direction === 1 && s.scroll() > 400)
    });
    ST.create({ trigger: ".hero", start: "top top", end: "bottom top", onToggle: (s) => (leak.visible = s.isActive) });

    // landing exits: the name drifts up and out of focus
    gsap.to(".name", { yPercent: -35, opacity: 0, filter: "blur(10px)", ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".name__line--2", { letterSpacing: "0.4em", ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".portals", { y: 120, opacity: 0, ease: "none", scrollTrigger: { trigger: ".hero", start: "40% top", end: "bottom top", scrub: true } });

    // scroll-lit words
    $$("[data-words]").forEach((p) => {
      gsap.to($$(".w", p), { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: p, start: "top 78%", end: "bottom 55%", scrub: true } });
    });

    // ---- world gates ----
    const PRIO = { photo: 30, design: 20, film: 10 };
    $$(".gate-zoom").forEach((gz) => {
      const prio = PRIO[gz.closest(".world").dataset.world];
      const word = $("[data-zoom-word]", gz);
      const first = $(".zc", word);
      const flood = gz.dataset.flood, prev = gz.dataset.prev;
      gz.style.backgroundColor = prev;
      word.style.position = "relative";
      const m = stemRatio(first.textContent);
      let played = false;
      const origin = () => {
        const ox = first.offsetLeft + first.offsetWidth * m.r;
        const oy = first.offsetTop + first.offsetHeight * 0.52;
        return `${ox}px ${oy}px`;
      };
      const scaleTo = () => {
        const fs = parseFloat(getComputedStyle(word).fontSize);
        const stem = Math.max(6, m.sw * fs);
        return (Math.max(innerWidth, innerHeight) * 2.6) / stem;
      };
      // fit the word to the screen width
      const fit = () => {
        word.style.fontSize = "";
        const max = innerWidth * 0.9;
        const w = word.scrollWidth;
        if (w > max) word.style.fontSize = parseFloat(getComputedStyle(word).fontSize) * (max / w) + "px";
      };
      fit();
      gsap.from($$(".zc", word), {
        yPercent: 110, opacity: 0, rotateX: -70, duration: 1.2, stagger: 0.035, ease: "expo.out",
        scrollTrigger: { trigger: gz, start: "top 65%", toggleActions: "play none none reverse", refreshPriority: prio + 1 }
      });
      gsap.from([$(".gate-zoom__k", gz), $(".gate-zoom__s", gz)], { opacity: 0, y: 20, duration: 1, ease: "expo.out", scrollTrigger: { trigger: gz, start: "top 55%", toggleActions: "play none none reverse", refreshPriority: prio + 1 } });
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: gz, pin: true, start: "top top", end: "+=150%", scrub: 0.6, invalidateOnRefresh: true, refreshPriority: prio,
          onRefreshInit: fit,
          onRefresh: () => gsap.set(word, { transformOrigin: origin() }),
          onUpdate: (s) => {
            if (s.progress > 0.92 && !played && s.direction === 1) {
              played = true;
              sfx("braam");
            }
            if (s.progress < 0.5) played = false;
          }
        }
      });
      tl.to([$(".gate-zoom__k", gz), $(".gate-zoom__s", gz)], { opacity: 0, duration: 0.15 }, 0.1)
        .fromTo(word, { scale: 1 }, { scale: scaleTo, duration: 0.85, ease: "power4.in" }, 0.15)
        .set(gz, { backgroundColor: flood }, 0.99);
      gsap.set(word, { transformOrigin: origin() });
    });

    // world bodies: background drifts from the flood colour to the world's own
    $$(".world__body").forEach((b) => {
      gsap.fromTo(b, { backgroundColor: b.dataset.from }, {
        backgroundColor: b.dataset.to, ease: "none",
        scrollTrigger: { trigger: b, start: "top top", end: b.closest(".world--film") ? "+=25%" : "+=80%", scrub: true }
      });
    });

    // ---- photography: photos develop as they come up ----
    $$(".plate").forEach((pl) => {
      const img = $("img", pl), frame = $(".plate__frame", pl);
      gsap.fromTo(img,
        { filter: "invert(1) hue-rotate(180deg) sepia(0.35) contrast(1.25) brightness(0.95)", scale: 1.08 },
        { filter: "invert(0) hue-rotate(0deg) sepia(0) contrast(1) brightness(1)", scale: 1, ease: "power1.inOut",
          scrollTrigger: { trigger: pl, start: "top 100%", end: "top 45%", scrub: true } });
      gsap.fromTo(frame, { "--wash": 0.35 }, { "--wash": 0, ease: "none", scrollTrigger: { trigger: pl, start: "top 100%", end: "top 50%", scrub: true } });
      gsap.from($("figcaption", pl), { y: 20, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: pl, start: "bottom 95%" } });
    });
    gsap.from(".wall-text > div", { y: 40, opacity: 0, duration: 1.1, stagger: 0.12, ease: "expo.out", scrollTrigger: { trigger: ".wall-text", start: "top 85%" } });

    // ---- design ----
    gsap.from(".job > *", { y: 60, opacity: 0, duration: 1.2, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: ".job", start: "top 80%" } });
    $$(".brand").forEach((b) => {
      gsap.from($(".brand__n", b), { xPercent: -15, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: b, start: "top 80%" } });
      gsap.from($$(".chips span", b), { scale: 0, opacity: 0, duration: 0.8, stagger: 0.08, ease: "back.out(2)", scrollTrigger: { trigger: b, start: "top 75%" } });
    });
    $$(".case").forEach((c) => {
      const media = $(".case__media", c);
      const tl = gsap.timeline({ scrollTrigger: { trigger: c, start: "top 85%", end: "top 30%", scrub: 0.8 } });
      tl.fromTo($$(".ghost", media), { x: (i) => [-50, 50, 0][i], y: (i) => [0, 0, 50][i], opacity: 0.9 }, { x: 0, y: 0, opacity: 0, ease: "power2.out" }, 0)
        .from($(".sheet--main", media), { y: 120, rotate: -4, ease: "power3.out" }, 0)
        .from($(".sheet--alt", media), { y: 200, rotate: 18, ease: "power3.out" }, 0.1)
        .from($$(".crop, .reg", media), { scale: 3, opacity: 0, ease: "power3.out" }, 0.2);
      gsap.from($$(".case__text > *", c), { y: 40, opacity: 0, duration: 1.1, stagger: 0.08, ease: "expo.out", scrollTrigger: { trigger: c, start: "top 70%" } });
      ST.create({ trigger: c, start: "top 60%", once: true, onEnter: () => sfx("shutter") });
    });
    gsap.from(".step", { y: 60, opacity: 0, duration: 1.1, stagger: 0.12, ease: "expo.out", scrollTrigger: { trigger: ".process", start: "top 80%" } });
    // independent work: pieces get pinned to the wall one by one
    $$(".pin").forEach((p, i) => {
      gsap.from(p, { y: 180, rotate: i % 2 ? 16 : -16, opacity: 0, duration: 1.5, ease: "expo.out", scrollTrigger: { trigger: p, start: "top 95%" } });
      gsap.from($(".pin__tape", p), { scaleX: 0, duration: 0.8, delay: 0.5, ease: "expo.out", scrollTrigger: { trigger: p, start: "top 95%" } });
    });
    gsap.from(".wall__head > *", { y: 40, opacity: 0, duration: 1.1, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: ".wall", start: "top 75%" } });

    // ---- film ----
    // cinema bars close in while you're inside the film world
    const bars = $$(".cinebars i");
    ST.create({
      trigger: ".world--film .world__body", start: "top 30%", end: "bottom 70%",
      onToggle: (s) => gsap.to(bars, { scaleY: s.isActive ? 1 : 0, duration: 1.2, ease: "expo.inOut" })
    });

    // opening credits, played by the scroll
    const titleChars = $$("#featureTitle .char");
    const cards = $$("[data-oc]");
    const ocTc = $("#ocTc");
    let slammed = false;
    const otl = gsap.timeline({
      defaults: { ease: "power2.out" },
      scrollTrigger: {
        trigger: "#opening", pin: ".opening__pin", start: "top top", end: "+=430%", scrub: 0.8, refreshPriority: 5,
        onUpdate: (s) => {
          const f = Math.floor(s.progress * 60 * 24);
          ocTc.textContent = `00:00:${pad(Math.floor(f / 24))}:${pad(f % 24)}`;
          if (s.progress > 0.64 && !slammed && s.direction === 1) { slammed = true; sfx("damru"); sfx("braam"); }
          if (s.progress < 0.55) slammed = false;
        }
      }
    });
    otl.fromTo(".opening__beam", { opacity: 0, scaleX: 0.1 }, { opacity: 1, scaleX: 1, duration: 1 });
    cards.forEach((c, i) => {
      otl.fromTo(c, { opacity: 0, filter: "blur(14px)", y: 30, letterSpacing: i < 2 ? "0.6em" : "0.02em" },
        { opacity: 1, filter: "blur(0px)", y: 0, letterSpacing: i < 2 ? "0.24em" : "0em", duration: 1 })
        .to(c, { opacity: 0, filter: "blur(10px)", y: -24, duration: 0.8 }, "+=0.9");
    });
    otl.fromTo(".opening__flash", { opacity: 0 }, { opacity: 0.9, duration: 0.12 })
      .to(".opening__flash", { opacity: 0, duration: 0.7 })
      .fromTo(titleChars, { opacity: 0, scale: 2.8, filter: "blur(22px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.1, stagger: 0.12, ease: "expo.out" }, "<")
      .fromTo("#featureDeva", { opacity: 0, scale: 0.55 }, { opacity: 1, scale: 1, duration: 1.8, ease: "expo.out" }, "<")
      .to(".opening__screen", { keyframes: { x: [0, -14, 12, -8, 5, 0], y: [0, 6, -5, 3, -2, 0] }, duration: 0.5 }, "<0.3")
      .fromTo(".oc-title__status", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 })
      .to({}, { duration: 1.2 });

    $$("[data-count]").forEach((b) => {
      const o = { v: 0 };
      gsap.to(o, { v: +b.dataset.count, duration: 2, ease: "expo.out", onUpdate: () => (b.textContent = Math.round(o.v)), scrollTrigger: { trigger: b, start: "top 88%" } });
    });
    gsap.from(".feature__body > *", { y: 50, opacity: 0, duration: 1.2, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: ".feature__body", start: "top 82%" } });

    // coming-soon sign lights up, posters come out of the dark
    ST.create({ trigger: ".marquee-sign", start: "top 75%", onEnter: () => { $(".marquee-sign").classList.add("is-lit"); sfx("chord", [220, 277.18, 329.63]); } });
    gsap.from(".poster", { y: 140, rotateY: (i) => [-25, 0, 25][i % 3], opacity: 0, duration: 1.6, ease: "expo.out", stagger: 0.15, scrollTrigger: { trigger: ".posters", start: "top 85%" } });
    if (finePointer) {
      $$(".poster").forEach((p, i) => {
        const sh = $(".poster__sheet", p);
        const rx = gsap.quickTo(sh, "rotationX", { duration: 0.6, ease: "power3" });
        const ry = gsap.quickTo(sh, "rotationY", { duration: 0.6, ease: "power3" });
        p.addEventListener("pointerenter", () => sfx("tick", [523.25, 659.25, 783.99][i % 3], 0.07));
        p.addEventListener("pointermove", (e) => {
          const r = sh.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
          sh.style.setProperty("--mx", px * 100 + "%");
          sh.style.setProperty("--my", py * 100 + "%");
          rx((0.5 - py) * 14);
          ry((px - 0.5) * 16);
        });
        p.addEventListener("pointerleave", () => { rx(0); ry(0); });
      });
    }

    // crafts: three cards, like slates on a table
    gsap.from(".craft", { y: 120, rotate: (i) => [-6, 2, 7][i % 3], opacity: 0, duration: 1.5, ease: "expo.out", stagger: 0.14, scrollTrigger: { trigger: ".crafts__row", start: "top 85%" } });
    gsap.from(".crafts__head > *", { y: 40, opacity: 0, duration: 1.1, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: ".crafts", start: "top 80%" } });

    // writing sample: the page types itself as you read
    const sl = $$("#psSheet .sl");
    gsap.set(sl, { opacity: 0.08 });
    gsap.to(sl, { opacity: 1, stagger: 0.5, ease: "none", scrollTrigger: { trigger: "#psSheet", start: "top 75%", end: "bottom 60%", scrub: true } });
    gsap.from("#psSheet", { y: 100, rotate: -3, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: ".ps-stage", start: "top 85%" } });
    $$("#psNotes li").forEach((li, i) => {
      gsap.from(li, { x: 60, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: $$("#psSheet .sl__mark")[i] || li, start: "top 70%" } });
    });
    gsap.from(".ps-head > *", { y: 40, opacity: 0, duration: 1.1, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: ".page-sample", start: "top 80%" } });

    // cinematography: guides draw over each frame
    $$(".fr").forEach((fr) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: fr, start: "top 75%", end: "center 45%", scrub: 0.6 } });
      tl.fromTo($$(".fr__guides line, .fr__guides rect", fr), { strokeDashoffset: 1 }, { strokeDashoffset: 0, stagger: 0.1, ease: "power2.out" })
        .from($$(".mk", fr), { scale: 0, opacity: 0, stagger: 0.1, ease: "back.out(3)" }, 0.4);
      gsap.from(fr, { y: 80, opacity: 0, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: fr, start: "top 92%" } });
    });
    gsap.from(".eye__head > *", { y: 40, opacity: 0, duration: 1.1, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: ".eye", start: "top 80%" } });

    // one frame, two selves: the divider sweeps once on arrival, then it's yours
    const splitState = { v: 50 };
    const setSplit = (v) => {
      $("#splitCold").style.clipPath = `inset(0 0 0 ${v}%)`;
      $("#splitBar").style.left = v + "%";
    };
    setSplit(50);
    ST.create({
      trigger: "#split", start: "top 65%", once: true,
      onEnter: () => gsap.fromTo(splitState, { v: 92 }, { v: 50, duration: 2.2, ease: "expo.inOut", onUpdate: () => setSplit(splitState.v) })
    });
    const stage = $("#splitStage");
    let dragging = false;
    const moveSplit = (e) => {
      const r = stage.getBoundingClientRect();
      setSplit(clamp(((e.clientX - r.left) / r.width) * 100, 2, 98));
    };
    stage.addEventListener("pointerdown", (e) => { dragging = true; moveSplit(e); sfx("tick", 880, 0.05); });
    addEventListener("pointermove", (e) => dragging && moveSplit(e));
    addEventListener("pointerup", () => (dragging = false));
    if (finePointer) stage.addEventListener("pointermove", (e) => !dragging && moveSplit(e));
    gsap.from(".kit li", { y: 20, opacity: 0, duration: 0.9, stagger: 0.08, ease: "expo.out", scrollTrigger: { trigger: ".kit", start: "top 90%" } });

    // reels rise like phones out of a pocket
    gsap.from(".reel", { y: 160, rotate: (i) => [-8, 0, 8, -4, 4][i % 5], opacity: 0, duration: 1.5, ease: "expo.out", stagger: 0.12, scrollTrigger: { trigger: ".reels__row", start: "top 88%" } });
    gsap.from(".reels__head > *", { y: 40, opacity: 0, duration: 1.1, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: ".reels", start: "top 80%" } });
    // studio orbit draws itself, then the nodes arrive
    gsap.to(".o-draw", { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: ".studio", start: "top 75%", end: "center 45%", scrub: true } });
    gsap.from(".o-node", { scale: 0, opacity: 0, transformOrigin: "center", duration: 0.9, stagger: 0.15, ease: "back.out(2)", scrollTrigger: { trigger: ".studio", start: "top 55%" } });
    gsap.to(".studio__orbit svg", { rotate: 25, ease: "none", scrollTrigger: { trigger: ".studio", start: "top bottom", end: "bottom top", scrub: true } });
    gsap.from(".studio > div:last-child > *", { y: 40, opacity: 0, duration: 1.1, stagger: 0.08, ease: "expo.out", scrollTrigger: { trigger: ".studio", start: "top 65%" } });
    dust();

    // ---- tools ----
    gsap.from(".tool", {
      y: 160, rotateX: -60, opacity: 0, duration: 1.6, ease: "expo.out", stagger: 0.09,
      scrollTrigger: { trigger: ".tools__row", start: "top 85%" }
    });
    gsap.from(".tools__head > *", { y: 40, opacity: 0, duration: 1.1, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: ".tools", start: "top 70%" } });

    // ---- contact ----
    gsap.from("#rollTitle .char", { yPercent: 110, opacity: 0, duration: 1.4, ease: "expo.out", stagger: 0.03, scrollTrigger: { trigger: ".contact", start: "top 60%" } });
    gsap.from(".contact__q, .contact__p, .cta", { y: 30, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: ".contact__ctas", start: "top 92%" } });
    ST.create({ trigger: ".contact", start: "top 55%", once: true, onEnter: () => sfx("chord", [196, 246.94, 293.66, 392]) });

    // ---- world state: nav, dial ----
    const dial = $(".dial");
    ST.create({ trigger: "#photography", start: "top center", endTrigger: "#film", end: "bottom center", onToggle: (s) => dial.classList.toggle("is-on", s.isActive) });
    $$(".world").forEach((w) => {
      const key = w.dataset.world;
      ST.create({
        trigger: w, start: "top center", end: "bottom center",
        onToggle: (s) => {
          $$(`[data-dial="${key}"], [data-world-link="${key}"]`).forEach((a) => a.classList.toggle("is-active", s.isActive));
        }
      });
    });

    addEventListener("load", () => ST.refresh());
    // images without fixed sizes change the page height when they arrive: re-measure
    let rT;
    const later = () => { clearTimeout(rT); rT = setTimeout(() => ST.refresh(), 250); };
    $$("img").forEach((im) => { if (!im.complete) im.addEventListener("load", later); });
    new MutationObserver(later).observe($("#cases"), { childList: true, subtree: true });
    document.fonts && document.fonts.ready.then(() => ST.refresh());
  }

  /* ---------------- projector dust ---------------- */
  function dust() {
    const c = $("#dust");
    if (!c) return;
    const x = c.getContext("2d");
    let W, H, parts;
    function size() {
      W = c.width = c.clientWidth;
      H = c.height = c.clientHeight;
      parts = Array.from({ length: 90 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.6 + 0.3, vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.3) * 0.2, a: Math.random() }));
    }
    size();
    addEventListener("resize", size);
    let on = false;
    ScrollTrigger.create({ trigger: ".world--film .world__body", start: "top bottom", end: "top -100%", onToggle: (s) => (on = s.isActive) });
    (function frame() {
      if (on) {
        x.clearRect(0, 0, W, H);
        parts.forEach((p) => {
          p.x += p.vx; p.y += p.vy;
          if (p.y < 0) p.y = H; if (p.y > H) p.y = 0; if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
          // only inside the cone of light
          const half = (p.y / H) * W * 0.16 + 20;
          const inBeam = Math.abs(p.x - W / 2) < half;
          const a = inBeam ? 0.55 * (0.5 + 0.5 * Math.sin(performance.now() / 600 + p.a * 9)) : 0.06;
          x.fillStyle = `rgba(255,230,184,${a})`;
          x.beginPath(); x.arc(p.x, p.y, p.r, 0, 6.283); x.fill();
        });
      }
      requestAnimationFrame(frame);
    })();
  }

  /* ---------------- tools: tilt, light, tap ---------------- */
  $$(".tool").forEach((t, i) => {
    const notes = [523.25, 587.33, 659.25, 783.99, 880];
    t.addEventListener("pointerenter", () => sfx("tick", notes[i % 5], 0.08));
    t.addEventListener("click", () => {
      const was = t.classList.contains("is-active");
      $$(".tool").forEach((x) => x.classList.remove("is-active"));
      t.classList.toggle("is-active", !was);
      sfx("flip", notes[i % 5] / 2);
    });
    if (!finePointer || !hasGSAP || reduce) return;
    const rx = gsap.quickTo(t, "rotationX", { duration: 0.6, ease: "power3" });
    const ry = gsap.quickTo(t, "rotationY", { duration: 0.6, ease: "power3" });
    t.addEventListener("pointermove", (e) => {
      const r = t.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      t.style.setProperty("--mx", px * 100 + "%");
      t.style.setProperty("--my", py * 100 + "%");
      rx((0.5 - py) * 18);
      ry((px - 0.5) * 22);
    });
    t.addEventListener("pointerleave", () => { rx(0); ry(0); });
  });

  /* ==================================================================
     LIGHTBOX
     ================================================================== */
  const lb = $("#lightbox"), lbImg = $("#lbImg");
  let lbList = [], lbIdx = 0, lbReturn = null;
  const photoList = () => photoOrder.map((s) => ({ src: photoSrc(s), title: P.photos[s].title, kind: P.photos[s].kind }));
  const designList = () => G.independent.map((d) => ({ src: designSrc(d.slug), title: d.title, kind: d.kind }));
  const kidList = () => kidLightbox.map((k) => ({ src: k.local, fallback: k.remote, title: k.title, kind: k.kind }));
  function showLb(i) {
    lbIdx = (i + lbList.length) % lbList.length;
    const it = lbList[lbIdx];
    lbImg.onerror = it.fallback ? () => { lbImg.onerror = null; lbImg.src = it.fallback; } : null;
    lbImg.src = it.src;
    lbImg.alt = it.title;
    $("#lbTitle").textContent = it.title;
    $("#lbKind").textContent = it.kind;
    $("#lbIdx").textContent = `${pad(lbIdx + 1)} / ${pad(lbList.length)}`;
    if (hasGSAP && !reduce) {
      gsap.fromTo(".lightbox__flash", { opacity: 0.85 }, { opacity: 0, duration: 0.6, ease: "power2.out" });
      gsap.fromTo(lbImg, { scale: 1.05, filter: "brightness(2) blur(6px)" }, { scale: 1, filter: "brightness(1) blur(0px)", duration: 0.9, ease: "expo.out" });
    }
  }
  function openLightbox(list, i) {
    lbReturn = document.activeElement;
    lbList = list;
    lb.hidden = false;
    showLb(i);
    lenis && lenis.stop();
    sfx("shutter");
    $("#lbClose").focus();
  }
  function closeLightbox() {
    lb.hidden = true;
    lenis && lenis.start();
    lbReturn && lbReturn.focus({ preventScroll: true });
  }
  const stepLb = (d) => { sfx("shutter"); showLb(lbIdx + d); };
  $("#lbClose").addEventListener("click", closeLightbox);
  $("#lbPrev").addEventListener("click", () => stepLb(-1));
  $("#lbNext").addEventListener("click", () => stepLb(1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") stepLb(1);
    if (e.key === "ArrowLeft") stepLb(-1);
    if (e.key === "Tab") {
      const f = $$(".lb-btn", lb), idx = f.indexOf(document.activeElement);
      e.preventDefault();
      f[(idx + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
  });
  let tx = null;
  lb.addEventListener("touchstart", (e) => (tx = e.touches[0].clientX), { passive: true });
  lb.addEventListener("touchend", (e) => { if (tx == null) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) stepLb(dx < 0 ? 1 : -1); tx = null; });
  $$(".plate").forEach((p) => {
    const open = () => openLightbox(photoList(), +p.dataset.index);
    p.addEventListener("click", open);
    p.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  });
  $$(".pin__img").forEach((b) => b.addEventListener("click", () => openLightbox(designList(), +b.closest(".pin").dataset.index)));
  $$(".sheet[data-kid]").forEach((s) => s.addEventListener("click", () => openLightbox(kidList(), +s.dataset.kid)));

  /* ---------------- reels: preview on hover, play in a player ---------------- */
  $$(".reel[data-reel] video").forEach((v) => {
    const card = v.closest(".reel");
    card.addEventListener("pointerenter", () => { v.play().catch(() => {}); });
    card.addEventListener("pointerleave", () => { v.pause(); });
  });
  const rb = $("#reelbox"), rbFrame = $("#reelboxFrame");
  function openReel(i) {
    const r = FW.reels[i];
    const k = reelKind(r.src);
    let inner = "";
    if (k === "video") inner = `<video src="${r.src}" ${r.poster ? `poster="${r.poster}"` : ""} controls autoplay playsinline></video>`;
    else if (k === "instagram" && igId(r.src)) inner = `<iframe src="https://www.instagram.com/reel/${igId(r.src)}/embed" allow="autoplay; encrypted-media" allowfullscreen title="${r.title}"></iframe>`;
    else if (k === "youtube" && ytId(r.src)) inner = `<iframe src="https://www.youtube-nocookie.com/embed/${ytId(r.src)}?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen title="${r.title}"></iframe>`;
    else { window.open(r.src, "_blank", "noopener"); return; }
    rbFrame.innerHTML = inner;
    $("#reelboxCap").textContent = `${r.title}  ${r.role || "Shot and edited"}`;
    rb.hidden = false;
    lenis && lenis.stop();
    sfx("whoosh", 0.5, true);
    if (hasGSAP && !reduce) gsap.fromTo(rbFrame, { scale: 0.85, opacity: 0, rotate: -4 }, { scale: 1, opacity: 1, rotate: 0, duration: 0.9, ease: "expo.out" });
    $("#reelboxClose").focus();
  }
  function closeReel() {
    rb.hidden = true;
    rbFrame.innerHTML = "";
    lenis && lenis.start();
  }
  $$(".reel[data-reel]").forEach((b) => b.addEventListener("click", () => openReel(+b.dataset.reel)));
  $("#reelboxClose").addEventListener("click", closeReel);
  rb.addEventListener("click", (e) => { if (e.target === rb) closeReel(); });
  document.addEventListener("keydown", (e) => { if (!rb.hidden && e.key === "Escape") closeReel(); });

  /* ==================================================================
     IN-PAGE LINKS, CURSOR, MAGNETIC
     ================================================================== */
  $$('a[href^="#"]').forEach((a) =>
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const target = id.length > 1 && $(id);
      if (!target) return;
      e.preventDefault();
      sfx("whoosh", 0.9, true);
      if (lenis) lenis.scrollTo(target, { duration: 2.2, easing: (t) => 1 - Math.pow(1 - t, 4) });
      else target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    })
  );
  $$(".nav__links a, .dial a").forEach((a) => a.addEventListener("pointerenter", () => sfx("tick", 2200, 0.04)));

  if (finePointer && hasGSAP && !reduce) {
    $$(".cta, .case__link, .sound-pill").forEach((m) => {
      const xT = gsap.quickTo(m, "x", { duration: 0.6, ease: "elastic.out(1,0.4)" });
      const yT = gsap.quickTo(m, "y", { duration: 0.6, ease: "elastic.out(1,0.4)" });
      m.addEventListener("pointermove", (e) => {
        const r = m.getBoundingClientRect();
        xT((e.clientX - r.left - r.width / 2) * 0.3);
        yT((e.clientY - r.top - r.height / 2) * 0.4);
      });
      m.addEventListener("pointerleave", () => { xT(0); yT(0); });
    });

    html.classList.add("has-cursor");
    const cur = $(".cursor"), ringEl = $(".cursor__ring"), dot = $(".cursor__dot"), label = $(".cursor__label");
    let rx = innerWidth / 2, ry = innerHeight / 2;
    (function c() {
      rx = lerp(rx, ptr.x, 0.18);
      ry = lerp(ry, ptr.y, 0.18);
      dot.style.transform = `translate(${ptr.x}px,${ptr.y}px)`;
      ringEl.style.transform = `translate(${rx}px,${ry}px)`;
      label.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(c);
    })();
    document.addEventListener("pointerover", (e) => {
      const t = e.target.closest("[data-cursor], a, button, .plate");
      cur.classList.toggle("is-hover", !!t);
      const l = t && t.dataset.cursor;
      cur.classList.toggle("is-label", !!l);
      label.textContent = l || "";
    });
  }

  /* ==================================================================
     GO
     ================================================================== */
  if (hasGSAP && !reduce) {
    const start = () => initScroll();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(start);
    else start();
  } else {
    // still usable without motion
    $$(".w").forEach((w) => (w.style.opacity = 1));
    $$("[data-count]").forEach((b) => (b.textContent = b.dataset.count));
    $$(".gate-zoom").forEach((gz) => (gz.style.backgroundColor = gz.dataset.prev));
    $$(".world__body").forEach((b) => (b.style.backgroundColor = b.dataset.to));
    $(".marquee-sign").classList.add("is-lit");
    $(".o-draw").setAttribute("stroke-dashoffset", "0");
  }
})();
