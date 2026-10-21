
const CONFIG = {
  whatsapp: "5514996824406",

  quando: "20 de novembro",  
  dataProva: "20 de novembro",
  prazoResultado: "",
  horarioAulas: "à noite, das 19h30 às 22h30", 
  atendimento: "segunda a sábado, das 8h às 20h", 
  transporte: "",

  duracao: "",
  turno: "",  

  pctTrabalhando: "", 
  empresasParceiras: "",  

  videos: [
    { titulo: "Nunca é tarde demais", legenda: "\"Aonde você quer estar daqui alguns anos?\"", arquivo: "https://youtube.com/shorts/8o37e2s7NwE", capa: "", vertical: true },
    { titulo: "Engenharia Civil",     legenda: "\"Construa o seu futuro com a gente, vem ser FEAP!\"", arquivo: "https://youtube.com/shorts/apGK4qkVGS0", capa: "", vertical: true }
  ],

  faqBolsaFim: "",
  faqConvenio: ""
};

const MENSAGENS = {
  "topo":      "Oi! Quero falar com a FEAP sobre o Vestibular de Bolsas.",
  "hero":      "Oi! Quero saber como funciona a bolsa da FEAP.",
  "cursos":    "Oi! Quero saber mais sobre os cursos da FEAP.",
  "bolsa":     "Oi! Quero saber quanto fica a mensalidade com a bolsa.",
  "caminho":   "Oi! Quero me inscrever no Vestibular de Bolsas.",
  "prova":     "Oi! Quero fazer a prova do Vestibular de Bolsas.",
  "video":     "Oi! Vi os vídeos da FEAP e quero saber como funciona a bolsa.",
  "porque":    "Oi! Quero conhecer a FEAP e descobrir minha bolsa.",
  "rotina":    "Oi! Quero saber sobre horários e transporte.",
  "duvidas":   "Oi! Tenho uma dúvida sobre a FEAP.",
  "comecar":   "Oi! Quero começar minha faculdade na FEAP.",
  "barra-fixa":"Oi! Quero descobrir minha bolsa na FEAP.",
  "rodape":    "Oi! Quero falar com a FEAP."
};

const ICONE_WA =
  '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>';

document.querySelectorAll("[data-cfg]").forEach(function (el) {
  const valor = (CONFIG[el.dataset.cfg] || "").trim();
  if (valor) {
    el.textContent = valor;
    el.classList.remove("pendente");
  } else if (el.textContent.trim()) {
    el.classList.add("pendente"); 
  }
});

document.querySelectorAll("[data-needs]").forEach(function (el) {
  const falta = el.dataset.needs.split(" ").some(function (chave) {
    return !(CONFIG[chave] || "").trim();
  });
  el.hidden = falta;
});

function linkWhatsApp(origem) {
  const texto = MENSAGENS[origem] || MENSAGENS["hero"];
  return "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(texto);
}

document.querySelectorAll("[data-origem]").forEach(function (el) {
  el.href = linkWhatsApp(el.dataset.origem);
  el.target = "_blank";
  el.rel = "noopener";
  if (el.classList.contains("btn-wa")) {
    el.insertAdjacentHTML("afterbegin", ICONE_WA);
  }
});

document.addEventListener("click", function (e) {
  const alvo = e.target.closest("[data-origem]");
  if (!alvo) return;
  const origem = alvo.dataset.origem;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: "whatsapp_click", origem_botao: origem });

  if (typeof window.gtag === "function") {
    window.gtag("event", "whatsapp_click", { origem_botao: origem });
  }
  if (typeof window.fbq === "function") {
    window.fbq("track", "Contact", { content_name: origem });
  }
});

(function () {
  const secao = document.getElementById("video");
  const lista = document.getElementById("videos");
  if (!secao || !lista) return;

  const videos = (CONFIG.videos || []).filter(function (v) {
    return v && (v.arquivo || "").trim();
  });
  if (!videos.length) { secao.hidden = true; return; }

  videos.forEach(function (v) {
    const url = v.arquivo.trim();
    const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
    const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);

    const item = document.createElement("figure");
    item.className = "video-item " + (v.vertical ? "vertical" : "horizontal");
    const caixa = document.createElement("div");
    caixa.className = "video-caixa";

    if (yt || vimeo) {
      const iframe = document.createElement("iframe");
      iframe.src = yt
        ? "https://www.youtube-nocookie.com/embed/" + yt[1] + "?rel=0"
        : "https://player.vimeo.com/video/" + vimeo[1];
      iframe.title = v.titulo || "Vídeo da FEAP";
      iframe.loading = "lazy";
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      iframe.allow = "accelerometer; autoplay; encrypted-media; fullscreen; picture-in-picture";
      iframe.allowFullscreen = true;
      caixa.appendChild(iframe);
    } else {
      const video = document.createElement("video");
      video.src = url;
      video.controls = true;
      video.playsInline = true;
      video.preload = "metadata";
      if (v.capa) video.poster = v.capa;
      caixa.appendChild(video);
    }
    item.appendChild(caixa);

    if (v.legenda || v.titulo) {
      const legenda = document.createElement("figcaption");
      legenda.textContent = v.legenda || v.titulo;
      item.appendChild(legenda);
    }
    lista.appendChild(item);
  });
})();


(function () {
  const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduzir || !("IntersectionObserver" in window)) return;

  const alvos = document.querySelectorAll([
    ".secao h2", ".secao .sub", ".curso", ".cartao-bolsa", ".pontos li",
    ".passos li", ".aviso", ".numeros > div", ".info-prova > div", ".apoio-claro",
    ".motivos li", ".foto-sala", ".faixa-numeros", ".resposta", ".faq details",
    ".secao .btn", ".secao .apoio", ".comecar-in > *"
  ].join(","));

  document.documentElement.classList.add("anima");

  const observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (!entrada.isIntersecting) return;
      const el = entrada.target;
      el.classList.add("visivel");
      observador.unobserve(el);
      setTimeout(function () {
        el.classList.remove("revela", "visivel");
        el.style.removeProperty("--atraso");
      }, 1000);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

  alvos.forEach(function (el) {
    const irmaos = Array.prototype.filter.call(el.parentElement.children, function (x) {
      return x.matches(".curso, li, details, .numeros > div, .info-prova > div");
    });
    const i = irmaos.indexOf(el);
    if (i > 0) el.style.setProperty("--atraso", Math.min(i, 4) * 0.08 + "s");
    el.classList.add("revela");
    observador.observe(el);
  });
})();

(function () {
  const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduzir || !("animate" in Element.prototype)) return; 

  document.querySelectorAll(".faq details").forEach(function (d) {
    const resumo = d.querySelector("summary");

    resumo.addEventListener("click", function (e) {
      e.preventDefault();

      const abrir = !d.open || d._fechando;
      const inicio = d.offsetHeight;
      if (d._anim) d._anim.cancel();

      const bordas = d.offsetHeight - d.clientHeight;
      d.style.overflow = "hidden";
      d._fechando = !abrir;

      let fim;
      if (abrir) {
        d.open = true;
        fim = d.offsetHeight;                
      } else {
        fim = resumo.offsetHeight + bordas;
      }

      d._anim = d.animate(
        { height: [inicio + "px", fim + "px"] },
        { duration: 320, easing: "cubic-bezier(.2, .8, .2, 1)" }
      );
      d._anim.onfinish = function () {
        d.open = abrir;
        d._anim = null;
        d._fechando = false;
        d.style.overflow = "";
      };
    });
  });
})();

(function () {
  const barra = document.querySelector(".barra-fixa");
  const botaoTopo = document.querySelector(".hero .btn");
  if (!barra || !botaoTopo || !("IntersectionObserver" in window)) {
    if (barra) barra.classList.add("visivel");
    return;
  }
  new IntersectionObserver(function (entradas) {
    barra.classList.toggle("visivel", !entradas[0].isIntersecting);
  }).observe(botaoTopo);
})();
