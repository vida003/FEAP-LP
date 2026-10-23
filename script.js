const CONFIG = {
  whatsapp: "5514996824406",
  quando: "29 de novembro",
  dataProva: "29 de novembro",
  prazoResultado: "",
  horarioAulas: "à noite, das 19h às 22h",
  atendimento: "segunda a sexta, das 9h às 21h",

  duracao: "",
  turno: "",

  pctTrabalhando: "",
  empresasParceiras: "",

  videos: [
    {
      titulo: "Nunca é tarde demais",
      legenda: "\"Nunca é tarde demais para começar a construir o seu futuro!\"",
      arquivo: "https://drive.google.com/file/d/1qelf4CGB3bfK2Wac5abcYYGDwUq4oECs/view",
      capa: "",
      vertical: true
    },
    {
      titulo: "Engenharia Civil",
      legenda: "\"Você nunca caminha sozinho. Sempre tem alguém para ajudar, aprender e crescer junto com você.\"",
      arquivo: "https://drive.google.com/file/d/1mvHlQ0lS3OGzEAHSAtpWQMmvtyEmBWX9/view",
      capa: "",
      vertical: true
    }
  ]
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
  "rotina":    "Oi! Quero saber sobre horários e sobre estudar na FEAP morando em outra cidade.",
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

  if (!videos.length) {
    secao.hidden = true;
    return;
  }

  lista.innerHTML = "";
  secao.hidden = false;

  videos.forEach(function (v) {
    const url = v.arquivo.trim();

    const yt = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );

    const vimeo = url.match(
      /vimeo\.com\/(?:video\/)?([0-9]+)/
    );

    const drive = url.match(
      /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/
    );

    const item = document.createElement("figure");
    item.className =
      "video-item " + (v.vertical ? "vertical" : "horizontal");

    const caixa = document.createElement("div");
    caixa.className = "video-caixa";

    if (yt || vimeo || drive) {
      const iframe = document.createElement("iframe");

      if (yt) {
        iframe.src =
          "https://www.youtube-nocookie.com/embed/" + yt[1] + "?rel=0";
      } else if (vimeo) {
        iframe.src =
          "https://player.vimeo.com/video/" + vimeo[1];
      } else {
        iframe.src =
          "https://drive.google.com/file/d/" + drive[1] + "/preview";
      }

      iframe.title = v.titulo || "Vídeo da FEAP";
      iframe.loading = "lazy";
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      iframe.allow =
        "autoplay; encrypted-media; fullscreen; picture-in-picture";
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
    ".secao h2", ".secao .sub", ".cartao-bolsa", ".pontos li",
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


(function () {
  const grade = document.querySelector(".cursos-grade");
  if (!grade) return;
  const cards = Array.prototype.slice.call(grade.querySelectorAll(".curso"));
  if (!cards.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const PEEK = 14;
  const ATRASO = 0.1;
  const n = cards.length;
  let tops = [];
  let alvo = 0;
  let prog = 0;
  let fim = false;
  let rodando = false;
  let ultimo = 0;

  function medir() {
    tops = cards.map(function (el) { return el.offsetTop; });
  }

  function aplicar() {
    for (let i = 0; i < n; i++) {
      const q = Math.max(0, Math.min(1, (prog - i * ATRASO) / (1 - (n - 1) * ATRASO)));
      const e = q * q * (3 - 2 * q);
      const y = (i * PEEK - tops[i]) * (1 - e);
      cards[i].style.transform = "translate3d(0," + y.toFixed(2) + "px,0)";
    }
  }

  function concluir() {
    fim = true;
    window.removeEventListener("scroll", ler);
    window.removeEventListener("resize", remedir);
    cards.forEach(function (el) {
      el.style.transform = "";
      el.style.zIndex = "";
    });
    grade.classList.remove("junta");
  }

  function quadro(t) {
    const dt = Math.min((t - ultimo) / 1000, 0.05);
    ultimo = t;
    prog += (alvo - prog) * (1 - Math.exp(-dt * 7));
    if (alvo - prog < 0.0008) prog = alvo;
    if (prog >= 1) { concluir(); rodando = false; return; }
    aplicar();
    if (prog === alvo) { rodando = false; return; }
    requestAnimationFrame(quadro);
  }

  function ler() {
    if (fim) return;
    const r = grade.getBoundingClientRect();
    const vh = window.innerHeight;
    const ini = vh * 0.9;
    const fimY = vh * 0.12;
    const bruto = Math.max(0, Math.min(1, (ini - r.top) / (ini - fimY)));
    if (bruto > alvo) alvo = bruto;
    if (!rodando && alvo > prog) {
      rodando = true;
      ultimo = performance.now();
      requestAnimationFrame(quadro);
    }
  }

  function remedir() {
    if (fim) return;
    medir();
    aplicar();
  }

  cards.forEach(function (el, i) { el.style.zIndex = n - i; });
  grade.classList.add("junta");
  medir();
  aplicar();
  ler();
  window.addEventListener("scroll", ler, { passive: true });
  window.addEventListener("resize", remedir);
  window.addEventListener("load", remedir);
})();

function conectar(opc) {
  const grade = opc.container;
  if (!grade || !window.matchMedia("(hover: hover)").matches) return;

  const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cards = Array.prototype.slice.call(grade.querySelectorAll(opc.itens));
  if (cards.length < 2) return;

  const NS = "http://www.w3.org/2000/svg";
  function criar(tag, attrs, pai) {
    const n = document.createElementNS(NS, tag);
    Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    pai.appendChild(n);
    return n;
  }

  const svgLinha = criar("svg", { "class": "trilha-linha", "aria-hidden": "true" }, grade);
  const base = criar("path", { "class": "trilha-base" }, svgLinha);
  const prog = criar("path", { "class": "trilha-prog" }, svgLinha);
  const svgPontos = criar("svg", { "class": "trilha-pontos", "aria-hidden": "true" }, grade);

  const raios = [7, 5.5, 4];
  const bolinhas = ["#fdc300", "#0094d9", "#8dc63f"].map(function (cor, k) {
    return criar("circle", { r: raios[k], fill: cor, stroke: "#fff", "stroke-width": 1.5 }, svgPontos);
  });

  let pts = [], cum = [], dist = [], total = 0;
  let s = 0, alvo = -1, dir = 1, ativo = false, raf = 0, ultimo = 0;

  function medir() {
    const w = grade.offsetWidth, h = grade.offsetHeight;
    svgLinha.setAttribute("viewBox", "0 0 " + w + " " + h);
    svgPontos.setAttribute("viewBox", "0 0 " + w + " " + h);

    const c = cards.map(function (el) {
      const a = opc.ancora ? opc.ancora(el) : null;
      return {
        x: a ? a.x : el.offsetLeft + el.offsetWidth / 2,
        y: a ? a.y : el.offsetTop + el.offsetHeight / 2,
        topo: el.offsetTop, fundo: el.offsetTop + el.offsetHeight
      };
    });

    const idx = [0];
    pts = [{ x: c[0].x, y: c[0].y }];
    for (let i = 1; i < c.length; i++) {
      const a = c[i - 1], b = c[i];
      if (Math.abs(a.y - b.y) > 8 && Math.abs(a.fundo - b.fundo) > 8) {
        const meio = (a.fundo + b.topo) / 2;
        pts.push({ x: a.x, y: meio }, { x: b.x, y: meio });
      }
      pts.push({ x: b.x, y: b.y });
      idx.push(pts.length - 1);
    }

    cum = [0];
    for (let i = 1; i < pts.length; i++) {
      cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
    }
    total = cum[cum.length - 1];
    dist = idx.map(function (i) { return cum[i]; });

    const d = pts.map(function (p, i) { return (i ? "L" : "M") + p.x + " " + p.y; }).join(" ");
    base.setAttribute("d", d);
    prog.setAttribute("d", d);
    if (alvo >= 0) s = dist[alvo];
    desenhar();
  }

  function ponto(d) {
    d = Math.max(0, Math.min(total, d));
    let k = 1;
    while (k < cum.length - 1 && cum[k] < d) k++;
    const seg = cum[k] - cum[k - 1] || 1;
    const t = (d - cum[k - 1]) / seg;
    return { x: pts[k - 1].x + (pts[k].x - pts[k - 1].x) * t, y: pts[k - 1].y + (pts[k].y - pts[k - 1].y) * t };
  }

  function desenhar() {
    if (!pts.length) return;
    prog.style.strokeDasharray = Math.max(s, 0) + " " + (total + 20);
    bolinhas.forEach(function (b, k) {
      const p = ponto(s - dir * k * 17);
      b.setAttribute("cx", p.x);
      b.setAttribute("cy", p.y);
    });
  }

  function passo(t) {
    const dt = Math.min((t - ultimo) / 1000, 0.05);
    ultimo = t;
    const diff = dist[alvo] - s;
    if (Math.abs(diff) < 0.5) {
      s = dist[alvo];
      raf = 0;
      svgPontos.classList.remove("andando");
      desenhar();
      return;
    }
    dir = diff > 0 ? 1 : -1;
    const v = Math.max(Math.abs(diff) * 4, 420);
    s += dir * Math.min(Math.abs(diff), v * dt);
    desenhar();
    raf = requestAnimationFrame(passo);
  }

  function ir(i) {
    if (opc.bloqueado && opc.bloqueado()) return;
    if (!pts.length) medir();
    if (i === alvo && ativo) return;
    alvo = i;
    if (!ativo || reduzir) {
      s = dist[i];
      ativo = true;
      svgLinha.classList.add("ativo");
      desenhar();
      return;
    }
    svgPontos.classList.add("andando");
    if (!raf) { ultimo = performance.now(); raf = requestAnimationFrame(passo); }
  }

  function sair() {
    ativo = false;
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    svgPontos.classList.remove("andando");
    svgLinha.classList.remove("ativo");
  }

  function achar(e) {
    const c = e.target.closest(opc.itens);
    return c ? cards.indexOf(c) : -1;
  }
  grade.addEventListener("mouseover", function (e) { const i = achar(e); if (i >= 0) ir(i); });
  grade.addEventListener("focusin", function (e) { const i = achar(e); if (i >= 0) ir(i); });
  grade.addEventListener("mouseleave", sair);
  grade.addEventListener("focusout", sair);

  medir();
  window.addEventListener("load", medir);
  if ("ResizeObserver" in window) new ResizeObserver(medir).observe(grade);
  else window.addEventListener("resize", medir);
}

conectar({
  container: document.querySelector(".cursos-grade"),
  itens: ".curso",
  bloqueado: function () { return document.querySelector(".cursos-grade").classList.contains("junta"); }
});

conectar({
  container: document.querySelector(".passos"),
  itens: "li",
  ancora: function (el) {
    if (window.matchMedia("(min-width: 900px)").matches) return null;
    return { x: el.offsetLeft + 26, y: el.offsetTop + 26 };
  }
});
(function () {
  const car = document.querySelector("[data-carrossel]");
  if (!car) return;
  const trilha = car.querySelector(".carrossel-trilha");
  const slides = Array.prototype.slice.call(trilha.children);
  const n = slides.length;
  if (n < 2) return;

  const clone = slides[0].cloneNode(true);
  clone.setAttribute("aria-hidden", "true");
  const ci = clone.querySelector("img");
  ci.removeAttribute("fetchpriority");
  ci.alt = "";
  trilha.appendChild(clone);

  const pontos = document.createElement("div");
  pontos.className = "carrossel-pontos";
  const botoes = slides.map(function (_, k) {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", "Ver foto " + (k + 1));
    b.addEventListener("click", function () { ir(k); reiniciar(); });
    pontos.appendChild(b);
    return b;
  });
  car.appendChild(pontos);

  let i = 0, timer = null;

  function marcar() {
    botoes.forEach(function (b, k) { b.classList.toggle("ativo", k === i % n); });
  }
  function ir(k) {
    i = k;
    trilha.style.transform = "translateX(" + (-i * 100) + "%)";
    marcar();
  }
  trilha.addEventListener("transitionend", function (e) {
    if (e.target !== trilha || i !== n) return;
    trilha.classList.add("sem-transicao");
    i = 0;
    trilha.style.transform = "translateX(0)";
    void trilha.offsetWidth;
    trilha.classList.remove("sem-transicao");
    marcar();
  });
  function proxima() { if (i < n) ir(i + 1); }
  function iniciar() { if (!timer) timer = setInterval(proxima, 4500); }
  function parar() { clearInterval(timer); timer = null; }
  function reiniciar() { parar(); iniciar(); }

  marcar();
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  iniciar();
  car.addEventListener("mouseenter", parar);
  car.addEventListener("mouseleave", iniciar);
  document.addEventListener("visibilitychange", function () { document.hidden ? parar() : iniciar(); });
})();
