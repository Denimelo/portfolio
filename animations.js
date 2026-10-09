// ==========================================================
// Portfolio · Narcisse Apelete
// Animations :
//  1. Accueil : la courbe est tracée par un « stylo », puis la
//     souris lit la courbe comme un graphique (point + repère).
//  2. Projet de stage : les barres de performance se remplissent
//     quand l'arbre des actions apparaît à l'écran.
// Rien ne bouge si l'utilisateur a demandé moins d'animations.
// ==========================================================
(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;
  document.documentElement.classList.add("js-anim");

  const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  // ---------- 1. Courbe de l'accueil ----------
  const hero = document.querySelector(".hero");
  const svg = document.querySelector(".hero__curve");
  const path = svg && svg.querySelector("path");
  const pen = svg && svg.querySelector(".hero__pen");
  const guide = svg && svg.querySelector(".hero__guide");

  if (hero && svg && path && pen && guide) {
    const A = 3.2;                 // raideur de la croissance exponentielle
    let W = 0, H = 0, yStart = 0, yEnd = 0;
    let drawn = false;
    let penX = null, targetX = null, raf = 0;

    const f = t => (Math.exp(A * t) - 1) / (Math.exp(A) - 1);
    const xAt = t => -10 + t * (W + 20);
    const yAt = x => {
      const t = Math.min(1, Math.max(0, (x + 10) / (W + 20)));
      return yStart + (yEnd - yStart) * f(t);
    };

    function layout() {
      const r = svg.getBoundingClientRect();
      W = r.width; H = r.height;
      if (!W || !H) return false;   // courbe masquée (mobile)
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      yStart = H - 14;
      yEnd = H * 0.04;
      let d = "";
      for (let i = 0; i <= 120; i++) {
        const x = xAt(i / 120);
        d += (i ? " L " : "M ") + x.toFixed(1) + " " + yAt(x).toFixed(1);
      }
      path.setAttribute("d", d);
      return true;
    }

    function placePen(x, y) {
      pen.setAttribute("cx", x); pen.setAttribute("cy", y);
      guide.setAttribute("x1", x); guide.setAttribute("y1", y);
      guide.setAttribute("x2", x); guide.setAttribute("y2", H);
    }

    // Tracé initial : le stylo parcourt la courbe
    function drawIn() {
      const len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
      pen.classList.add("is-on");
      const start = performance.now() + 300, dur = 2200;
      function step(now) {
        const p = Math.min(1, Math.max(0, (now - start) / dur));
        const e = ease(p);
        path.style.strokeDashoffset = len * (1 - e);
        const pt = path.getPointAtLength(len * e);
        pen.setAttribute("cx", pt.x); pen.setAttribute("cy", pt.y);
        if (p < 1) requestAnimationFrame(step);
        else {
          path.style.strokeDasharray = "";
          path.style.strokeDashoffset = "";
          pen.classList.remove("is-on");
          drawn = true;
        }
      }
      requestAnimationFrame(step);
    }

    // Lecture graphique : le point suit la souris le long de la courbe
    function follow() {
      if (targetX === null) { raf = 0; return; }
      penX = penX === null ? targetX : penX + (targetX - penX) * 0.18;
      placePen(penX, yAt(penX));
      raf = Math.abs(targetX - penX) > 0.5 ? requestAnimationFrame(follow) : 0;
    }

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (finePointer) {
      hero.addEventListener("pointermove", e => {
        if (!drawn || !W) return;
        const r = svg.getBoundingClientRect();
        targetX = e.clientX - r.left;
        pen.classList.add("is-on"); guide.classList.add("is-on");
        if (!raf) raf = requestAnimationFrame(follow);
      });
      hero.addEventListener("pointerleave", () => {
        pen.classList.remove("is-on"); guide.classList.remove("is-on");
        targetX = null; penX = null;
      });
    }

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { if (layout() && !drawn) { drawn = true; } }, 120);
    });

    if (layout()) drawIn();
  }

  // ---------- 2. Barres de performance de l'arbre ----------
  const tree = document.querySelector(".tree");
  if (tree && "IntersectionObserver" in window) {
    const bars = [...tree.querySelectorAll(".pct")].map(el => {
      const target = parseFloat(el.style.getPropertyValue("--p")) || 0;
      el.style.setProperty("--p", "0%");
      el.textContent = "0 %";
      return { el, target };
    });
    const badges = tree.querySelectorAll(".node em");

    const io = new IntersectionObserver(entries => {
      if (!entries.some(e => e.isIntersecting)) return;
      io.disconnect();
      const t0 = performance.now(), dur = 1100, gap = 140;
      function step(now) {
        let done = true;
        bars.forEach((b, i) => {
          const p = Math.min(1, Math.max(0, (now - t0 - i * gap) / dur));
          if (p < 1) done = false;
          const v = b.target * ease(p);
          b.el.style.setProperty("--p", v + "%");
          b.el.textContent = Math.round(v) + " %";
        });
        if (!done) requestAnimationFrame(step);
        else badges.forEach(b => b.classList.add("is-on"));
      }
      requestAnimationFrame(step);
    }, { threshold: 0.45 });
    io.observe(tree);
  }

  // ---------- 3. Apparition des sections au défilement ----------
  // Chaque groupe apparaît quand il arrive à l'écran ; dans une liste
  // (parcours, compétences, liens), les éléments arrivent l'un après l'autre.
  if ("IntersectionObserver" in window) {
    const single = [
      ".section__title", ".project__body", ".project__visual",
      ".subhead", ".about", ".contact__title", ".contact__lede", ".contact__mail",
    ];
    const groups = [".timeline > li", ".skills > div", ".contact__links > li"];

    single.forEach(sel => document.querySelectorAll(sel).forEach(el => el.setAttribute("data-reveal", "")));
    groups.forEach(sel => document.querySelectorAll(sel).forEach(el => {
      // rang de l'élément dans sa propre liste (chaque liste repart de zéro)
      const i = [...el.parentElement.children].indexOf(el);
      el.setAttribute("data-reveal", "");
      el.style.setProperty("--reveal-delay", Math.min(i, 4) * 0.08 + "s");
    }));
    // Dans un projet, le visuel arrive juste après le texte
    document.querySelectorAll(".project__visual").forEach(el => el.style.setProperty("--reveal-delay", ".15s"));

    const revealIO = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-visible");
        revealIO.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

    document.querySelectorAll("[data-reveal]").forEach(el => revealIO.observe(el));
  }
})();
