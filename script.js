/* Idioma (PT/EN), galerias, imagem ampliada e animações. */
(function () {
  var root = document.documentElement;
  var TITLES = {
    pt: "Luan Fonseca Barros · Banco de dados e aplicações web",
    en: "Luan Fonseca Barros · Databases and web applications"
  };
  var OPEN_LABEL = { pt: "Ampliar imagem", en: "Enlarge image" };
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lightbox-img");
  var lbCap = document.getElementById("lightbox-cap");
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  function lang() { return root.getAttribute("data-lang") === "en" ? "en" : "pt"; }

  function syncGallery(g) {
    var l = lang();
    var on = g.querySelector(".thumb.is-on") || g.querySelector(".thumb");
    if (!on) return;
    var cap = on.getAttribute("data-" + l) || "";
    g.querySelector(".shot-main").alt = cap;
    g.querySelector(".shot-cap").textContent = cap;
    g.querySelector(".shot-open").setAttribute("aria-label", OPEN_LABEL[l]);
    g.querySelectorAll(".thumb").forEach(function (t) {
      t.setAttribute("aria-label", t.getAttribute("data-" + l) || "");
    });
  }

  function selectThumb(g, thumb) {
    g.querySelectorAll(".thumb").forEach(function (t) {
      var isOn = t === thumb;
      t.classList.toggle("is-on", isOn);
      t.setAttribute("aria-pressed", String(isOn));
    });
    var main = g.querySelector(".shot-main");
    main.classList.remove("flash");
    void main.offsetWidth; /* reinicia a animação de troca */
    main.src = thumb.getAttribute("data-full");
    main.classList.add("flash");
    g.querySelector(".shot-label").textContent = thumb.getAttribute("data-label");
    syncGallery(g);
  }

  function setLang(l) {
    root.setAttribute("data-lang", l);
    root.setAttribute("lang", l === "pt" ? "pt-BR" : "en");
    document.title = TITLES[l];
    document.getElementById("b-pt").setAttribute("aria-pressed", String(l === "pt"));
    document.getElementById("b-en").setAttribute("aria-pressed", String(l === "en"));
    try { localStorage.setItem("lfb-lang", l); } catch (e) {}
    document.querySelectorAll("[data-gallery]").forEach(syncGallery);
  }

  document.querySelectorAll(".lang button").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.getAttribute("data-set")); });
  });

  document.querySelectorAll("[data-gallery]").forEach(function (g) {
    g.querySelectorAll(".thumb").forEach(function (t) {
      t.addEventListener("click", function () { selectThumb(g, t); });
    });
    g.querySelector(".shot-open").addEventListener("click", function () {
      var main = g.querySelector(".shot-main");
      if (!lightbox || typeof lightbox.showModal !== "function") return;
      lbImg.src = main.src;
      lbImg.alt = main.alt;
      lbCap.textContent = main.alt;
      lightbox.showModal();
    });

    /* inclinação 3D leve da janela com o mouse */
    if (finePointer && !reduce) {
      var win = g.querySelector(".win");
      g.addEventListener("pointermove", function (e) {
        var r = g.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        win.style.setProperty("--ry", (x * 7).toFixed(2) + "deg");
        win.style.setProperty("--rx", (-y * 7).toFixed(2) + "deg");
      });
      g.addEventListener("pointerleave", function () {
        win.style.setProperty("--ry", "0deg");
        win.style.setProperty("--rx", "0deg");
      });
    }
  });

  if (lightbox) {
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) lightbox.close(); });
  }

  setLang(lang());
})();

document.getElementById("year").textContent = new Date().getFullYear();

/* barra de progresso de rolagem */
(function () {
  var bar = document.getElementById("progress");
  if (!bar) return;
  var ticking = false;
  function update() {
    var h = document.documentElement.scrollHeight - innerHeight;
    bar.style.setProperty("--p", h > 0 ? Math.min(1, scrollY / h).toFixed(4) : 0);
    ticking = false;
  }
  addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
})();

/* brilho que segue o cursor */
(function () {
  var glow = document.getElementById("glow");
  if (!glow || !matchMedia("(hover: hover) and (pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var x = 0, y = 0, raf = 0;
  addEventListener("pointermove", function (e) {
    x = e.clientX; y = e.clientY;
    glow.classList.add("on");
    if (!raf) raf = requestAnimationFrame(function () {
      glow.style.transform = "translate3d(" + x + "px," + y + "px,0)";
      raf = 0;
    });
  }, { passive: true });
  document.addEventListener("pointerleave", function () { glow.classList.remove("on"); });
})();

/* revelação ao rolar, com escalonamento, e contadores */
(function () {
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var counters = document.querySelectorAll("[data-count]");

  function count(el) {
    var to = parseInt(el.getAttribute("data-count"), 10);
    if (reduce || isNaN(to)) { el.textContent = to; return; }
    var t0 = performance.now(), dur = 1400;
    (function tick(t) {
      var k = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(tick);
    })(t0);
  }
  /* números do topo começam quando o título termina de entrar */
  setTimeout(function () { counters.forEach(count); }, 650);

  if (!("IntersectionObserver" in window) || reduce) return;
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".project, .col, .section-head, .career li").forEach(function (el, i) {
    el.classList.add("reveal");
    if (el.classList.contains("col") || el.matches(".career li")) {
      var idx = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.setProperty("--d", (idx * 0.08).toFixed(2) + "s");
    }
    io.observe(el);
  });
})();
