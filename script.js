/* =========================================================
   FEAP · Landing page do Vestibular de Bolsas 2027
   1) Preencha CONFIG com os dados confirmados pela FEAP.
   2) Ajuste as mensagens em MENSAGENS, se quiser.
   ========================================================= */

/* ---------- 1. Dados da página ----------
   Campo vazio ("") = a página mostra o marcador amarelo [pendente]
   (ou esconde o bloco, no caso dos números e da duração/turno). */
const CONFIG = {
  whatsapp: "5514996824406",   // (14) 99682-4406, com DDI 55

  quando: "20 de novembro",                  // ex.: "12 de dezembro, às 9h"
  dataProva: "20 de novembro",               // ex.: "12 de dezembro"
  prazoResultado: "",          // ex.: "3 dias"
  horarioAulas: "à noite, das 19h30 às 22h30",            // ex.: "à noite, das 19h às 22h30"
  atendimento: "segunda a sábado, das 8h às 20h",             // ex.: "segunda a sexta, das 8h às 21h"
  transporte: "",              // ex.: "ônibus e vans das prefeituras, com desembarque na FEAP"

  duracao: "",                 // cartões de curso, ex.: "4 anos" (some se vazio)
  turno: "",                   // cartões de curso, ex.: "Noite"

  pctTrabalhando: "",          // faixa de números, ex.: "85" (só o número)
  empresasParceiras: "",       // faixa de números, ex.: "40"

  // Vídeos da seção "Nunca é tarde para começar". Deixe "arquivo" vazio para não mostrar.
  // arquivo: link do YouTube/Vimeo ou caminho do arquivo, ex.: "video/feap.mp4"
  videos: [
    { titulo: "Conheça a FEAP",       arquivo: "C:\\Users\\diego\\Downloads\\Sites\\Site FEAP\\videos\\Feap\ -\ Engenharia\ Civil.mp4", capa: "", vertical: true },
    { titulo: "Nunca é tarde demais", arquivo: "C:\\Users\\diego\\Downloads\\Sites\\Site FEAP\\videos\\Feap\ -\ Nunca\ é\ tarde.mp4", capa: "", vertical: true }
  ],

  faqBolsaFim: "",             // resposta do FAQ: a bolsa vale até o fim do curso?
  faqConvenio: ""              // resposta do FAQ: convênio com empresas
};

/* ---------- 2. Mensagem pronta de cada botão ----------
   Cada seção envia uma mensagem diferente, para saber de onde veio a conversa. */
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

/* ---------- Ícone do WhatsApp ---------- */
const ICONE_WA =
  '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>';

/* ---------- Preenche os dados pendentes ---------- */
document.querySelectorAll("[data-cfg]").forEach(function (el) {
  const valor = (CONFIG[el.dataset.cfg] || "").trim();
  if (valor) {
    el.textContent = valor;
    el.classList.remove("pendente");
  } else if (el.textContent.trim()) {
    el.classList.add("pendente"); // mostra o marcador para a equipe ver o que falta
  }
});

/* Blocos que só aparecem quando todos os dados existem */
document.querySelectorAll("[data-needs]").forEach(function (el) {
  const falta = el.dataset.needs.split(" ").some(function (chave) {
    return !(CONFIG[chave] || "").trim();
  });
  el.hidden = falta;
});

/* ---------- Links do WhatsApp ---------- */
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

/* ---------- Rastreamento: o toque no botão é a conversão ----------
   Envia o evento "whatsapp_click" com a seção de origem.
   Funciona com Google Tag Manager (dataLayer), GA4 (gtag) e Meta Pixel (fbq). */
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

/* ---------- Vídeos: um único player, com abas para trocar ----------
   Cada vídeo aceita link do YouTube, link do Vimeo ou arquivo (.mp4, .webm). */
(function () {
  const secao = document.getElementById("video");
  const caixa = document.getElementById("video-caixa");
  const abas = document.getElementById("video-abas");
  if (!secao || !caixa || !abas) return;

  const lista = (CONFIG.videos || []).filter(function (v) {
    return v && (v.arquivo || "").trim();
  });
  if (!lista.length) { secao.hidden = true; return; }

  function montar(v, tocar) {
    caixa.textContent = "";                         // remove (e para) o vídeo anterior
    caixa.classList.toggle("vertical", !!v.vertical);
    const url = v.arquivo.trim();
    const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
    const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);

    if (yt || vimeo) {
      const iframe = document.createElement("iframe");
      iframe.src = yt
        ? "https://www.youtube-nocookie.com/embed/" + yt[1] + "?rel=0" + (tocar ? "&autoplay=1" : "")
        : "https://player.vimeo.com/video/" + vimeo[1] + (tocar ? "?autoplay=1" : "");
      iframe.title = v.titulo || "Vídeo da FEAP";
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
      if (tocar) video.play().catch(function () {});
    }
  }

  if (lista.length > 1) {
    lista.forEach(function (v, i) {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", i === 0 ? "true" : "false");
      b.textContent = v.titulo || "Vídeo " + (i + 1);
      b.addEventListener("click", function () {
        abas.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-selected", "false"); });
        b.setAttribute("aria-selected", "true");
        montar(v, true);
      });
      abas.appendChild(b);
    });
  } else {
    abas.hidden = true;
  }

  montar(lista[0], false);
})();

/* ---------- Aparecer conforme rola a página ----------
   Cada bloco entra com um leve fade quando chega na tela.
   Não roda se o aparelho pediu menos movimento. */
(function () {
  const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduzir || !("IntersectionObserver" in window)) return;

  const alvos = document.querySelectorAll([
    ".secao h2", ".secao .sub", ".curso", ".cartao-bolsa", ".pontos li",
    ".passos li", ".aviso", ".numeros > div", ".info-prova > div", ".apoio-claro",
    ".motivos li", ".foto-sala", ".faixa-numeros", ".resposta", ".faq details",
    ".secao .btn", ".secao .apoio", ".comecar-in > *", ".rodape-in > *"
  ].join(","));

  document.documentElement.classList.add("anima");

  const observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (!entrada.isIntersecting) return;
      const el = entrada.target;
      el.classList.add("visivel");
      observador.unobserve(el);
      // depois da animação, devolve o controle ao CSS normal (hover etc.)
      setTimeout(function () {
        el.classList.remove("revela", "visivel");
        el.style.removeProperty("--atraso");
      }, 1000);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

  alvos.forEach(function (el) {
    // pequeno escalonamento entre irmãos (cartões, passos, perguntas)
    const irmaos = Array.prototype.filter.call(el.parentElement.children, function (x) {
      return x.matches(".curso, li, details, .numeros > div, .info-prova > div");
    });
    const i = irmaos.indexOf(el);
    if (i > 0) el.style.setProperty("--atraso", Math.min(i, 4) * 0.08 + "s");
    el.classList.add("revela");
    observador.observe(el);
  });
})();

/* ---------- FAQ: abre e fecha com animação suave ---------- */
(function () {
  const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduzir || !("animate" in Element.prototype)) return; // sem animação: o navegador abre/fecha direto

  document.querySelectorAll(".faq details").forEach(function (d) {
    const resumo = d.querySelector("summary");

    resumo.addEventListener("click", function (e) {
      e.preventDefault();

      const abrir = !d.open || d._fechando;   // clicou enquanto fechava => reabre
      const inicio = d.offsetHeight;          // altura que está na tela agora
      if (d._anim) d._anim.cancel();

      const bordas = d.offsetHeight - d.clientHeight;
      d.style.overflow = "hidden";
      d._fechando = !abrir;

      let fim;
      if (abrir) {
        d.open = true;
        fim = d.offsetHeight;                 // altura com a resposta aberta
      } else {
        fim = resumo.offsetHeight + bordas;   // só a pergunta
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
