/* Idioma (PT/EN), título da aba, galerias dos projetos e imagem ampliada. */
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

  function lang() { return root.getAttribute("data-lang") === "en" ? "en" : "pt"; }

  /* mantém imagem principal, legenda e rótulos de acessibilidade no idioma atual */
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
    g.querySelector(".shot-main").src = thumb.getAttribute("data-full");
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
  });

  if (lightbox) {
    /* clique fora da imagem fecha */
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) lightbox.close(); });
  }

  setLang(lang());
})();

document.getElementById("year").textContent = new Date().getFullYear();

/* revelação suave ao rolar */
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll(".project, .col, .section-head, .career li").forEach(el => { el.classList.add("reveal"); io.observe(el); });
}
