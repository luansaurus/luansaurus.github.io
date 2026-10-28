/* Idioma (PT/EN): o botão no topo troca o idioma e lembra a escolha neste navegador. */
(function () {
  var root = document.documentElement;
  function setLang(l) {
    root.setAttribute("data-lang", l);
    root.setAttribute("lang", l === "pt" ? "pt-BR" : "en");
    document.getElementById("b-pt").setAttribute("aria-pressed", String(l === "pt"));
    document.getElementById("b-en").setAttribute("aria-pressed", String(l === "en"));
    try { localStorage.setItem("lfb-lang", l); } catch (e) {}
  }
  setLang(root.getAttribute("data-lang") === "en" ? "en" : "pt");
  document.querySelectorAll(".lang button").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.getAttribute("data-set")); });
  });
})();

document.getElementById("year").textContent = new Date().getFullYear();

/* revelação suave ao rolar */
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll(".project, .col, .section-head, .career li").forEach(el => { el.classList.add("reveal"); io.observe(el); });
}
