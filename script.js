/* ============================================================
   CONFIGURAÇÕES: edite só este bloco para personalizar a página
   ============================================================ */
const CONFIG = {
  name: "Seu Nome",
  nameShort: "SN",
  about: null, // coloque um texto seu para trocar a seção "Sobre"
  links: {
    email: "mailto:luaan12@gmail.com",
    github: "https://github.com/SEU-USUARIO",
    linkedin: "https://www.linkedin.com/in/SEU-PERFIL",
    "pokedata-live": "",
    "pokedata-repo": "https://github.com/SEU-USUARIO/pokedata",
    "blitzpicks-live": "",
    "blitzpicks-repo": "https://github.com/SEU-USUARIO/blitzpicks",
    "arenapicks-live": "",
    "arenapicks-repo": "https://github.com/SEU-USUARIO/newpicks"
  }
};

/* ---------------- aplicação das configurações ---------------- */
document.querySelectorAll("[data-bind]").forEach(el => {
  const k = el.dataset.bind;
  if (k === "name") el.textContent = CONFIG.name;
  if (k === "name-short") el.textContent = CONFIG.nameShort;
  if (k === "about" && CONFIG.about) el.textContent = CONFIG.about;
});
document.querySelectorAll("[data-link]").forEach(a => {
  const url = CONFIG.links[a.dataset.link];
  if (url) a.href = url;
  else a.remove(); // sem URL = botão some (ex.: "Ver online" ainda sem link)
});
document.title = `${CONFIG.name} · Desenvolvedor Full Stack`;
document.getElementById("year").textContent = new Date().getFullYear();

/* revelação suave ao rolar */
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll(".project, .col, .section-head").forEach(el => { el.classList.add("reveal"); io.observe(el); });
}
