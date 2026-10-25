"use strict";

// ─── Configurações ────────────────────────────────────────────────────────────

const CONFIG_CASAL = {
  nomeGarota: "Talita",
  nomeAutor: "Diogo",
  duracaoLoadingSegundos: 10.00
};

/** Quantos slots de Polaroid existem na página principal */
const TOTAL_SLOTS_PRINCIPAIS = 6;

// ─── Tipagem ──────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} ItemFoto
 * @property {string} imagem   - caminho relativo da imagem
 * @property {string} legenda  - texto exibido abaixo da foto
 * @property {number} order    - posição de exibição (1‑based)
 */

// ─── Dados das fotos ──────────────────────────────────────────────────────────

/** @type {ItemFoto[]} */
const LISTA_FOTOS = [];

/**
 * Preenche LISTA_FOTOS com base nos 28 arquivos renomeados em /images.
 * Imagens 1–8 são .png, 9–28 são .jpeg.
 */
function gerarListaFotos() {
  const totalImagens = 34;
  for (let i = 1; i <= totalImagens; i++) {
    const extensao = i <= 8 ? "png" : "jpeg";
    LISTA_FOTOS.push({
      imagem: `images/${i}.${extensao}`,
      legenda: `Foto ${i}`,
      order: i
    });
  }
}

// ─── Utilitários ──────────────────────────────────────────────────────────────

/**
 * Formata número com 2 casas decimais no padrão pt-BR.
 * @param {number} valor
 * @returns {string}
 */
function formatarNumeroDecimal(valor) {
  const v = typeof valor === "number" && !Number.isNaN(valor) ? valor : 0;
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(v);
}

/**
 * @param {unknown} el
 * @returns {el is HTMLElement}
 */
function ehElementoHtml(el) {
  return el instanceof HTMLElement;
}

/**
 * @param {unknown} el
 * @returns {el is HTMLCanvasElement}
 */
function ehCanvasHtml(el) {
  return el instanceof HTMLCanvasElement;
}

/**
 * @param {unknown} el
 * @returns {el is HTMLImageElement}
 */
function ehImagem(el) {
  return el instanceof HTMLImageElement;
}

// ─── Renderização dos Polaroids principais ────────────────────────────────────

/** Preenche os 6 slots de polaroid com as primeiras 6 fotos da lista */
function renderizarPolaroidsPrincipais() {
  const primeirasFotos = LISTA_FOTOS.slice(0, TOTAL_SLOTS_PRINCIPAIS);

  for (let slot = 0; slot < TOTAL_SLOTS_PRINCIPAIS; slot++) {
    const imgEl = document.querySelector(`img.polaroid-img-elemento[data-slot="${slot}"]`);
    const legendaEl = document.querySelector(`span.titulo-foto-polaroid[data-slot="${slot}"]`);

    if (!ehElementoHtml(imgEl) || !ehElementoHtml(legendaEl)) { continue; }

    if (slot < primeirasFotos.length) {
      const foto = primeirasFotos[slot];
      imgEl.setAttribute("src", foto.imagem);
      imgEl.setAttribute("alt", foto.legenda);
      legendaEl.textContent = foto.legenda;
    }
  }
}


let indiceLightbox = 0;

/** @param {number} passo  -1 = anterior, 1 = próxima */
function navegarLightbox(passo) {
  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightboxImg");
  if (!ehElementoHtml(lightbox) || !ehImagem(img) || lightbox.hasAttribute("hidden")) { return; }

  const total = LISTA_FOTOS.length;
  indiceLightbox = (indiceLightbox + passo + total) % total;

  const foto = LISTA_FOTOS[indiceLightbox];
  img.setAttribute("src", foto.imagem);
  img.setAttribute("alt", foto.legenda);
}

// ─── Lightbox (tela cheia) ────────────────────────────────────────────────────

/**
 * Abre o lightbox com a imagem informada.
 * @param {string} src
 * @param {string} alt
 */
function abrirLightbox(src, alt) {
  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightboxImg");

  if (!ehElementoHtml(lightbox) || !ehImagem(img)) { return; }

  const indice = LISTA_FOTOS.findIndex((f) => f.imagem === src);
  indiceLightbox = indice >= 0 ? indice : 0;

  img.setAttribute("src", src);
  img.setAttribute("alt", alt);
  lightbox.removeAttribute("hidden");
  document.body.style.overflow = "hidden";
}

function fecharLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (ehElementoHtml(lightbox)) {
    lightbox.setAttribute("hidden", "");
    document.body.style.overflow = "";
  }
}

function configurarLightbox() {
  // Clicar em qualquer polaroid principal abre em tela cheia
  const polaroids = document.querySelectorAll(".card-polaroid-autentica");
  polaroids.forEach((card) => {
    card.addEventListener("click", () => {
      const img = card.querySelector("img.polaroid-img-elemento");
      if (!ehImagem(img)) { return; }
      const src = img.getAttribute("src") ?? "";
      const alt = img.getAttribute("alt") ?? "";
      if (src) { abrirLightbox(src, alt); }
    });
  });

  // Fechar ao clicar no botão ou no overlay
  const btnFechar = document.getElementById("btnFecharLightbox");
  const overlay = document.getElementById("lightboxOverlay");
  if (ehElementoHtml(btnFechar)) { btnFechar.addEventListener("click", fecharLightbox); }
  if (ehElementoHtml(overlay)) { overlay.addEventListener("click", fecharLightbox); }

  // Fechar com Esc
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { fecharLightbox(); fecharModalGaleria(); }
  else if (e.key === "ArrowRight") { navegarLightbox(1); }
  else if (e.key === "ArrowLeft") { navegarLightbox(-1); }
});}

// ─── Modal de fotos extras ────────────────────────────────────────────────────

/** Cria e preenche o grid do modal com as fotos extras (da 7ª em diante) */
function preencherModalGaleria() {
  const grid = document.getElementById("modalGrid");
  if (!ehElementoHtml(grid)) { return; }

  const fotosExtras = LISTA_FOTOS.slice(TOTAL_SLOTS_PRINCIPAIS);
  grid.innerHTML = "";

  fotosExtras.forEach((foto) => {
    const item = document.createElement("div");
    item.className = "modal-grid-item";

    const img = document.createElement("img");
    img.src = foto.imagem;
    img.alt = foto.legenda;
    img.loading = "lazy";

    const legenda = document.createElement("span");
    legenda.className = "modal-grid-legenda";
    legenda.textContent = foto.legenda;

    // Clique na foto do modal também abre lightbox
    img.addEventListener("click", () => {
      abrirLightbox(foto.imagem, foto.legenda);
    });

    item.appendChild(img);
    item.appendChild(legenda);
    grid.appendChild(item);
  });
}

function abrirModalGaleria() {
  const modal = document.getElementById("modalGaleria");
  if (ehElementoHtml(modal)) {
    modal.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
  }
}

function fecharModalGaleria() {
  const modal = document.getElementById("modalGaleria");
  if (ehElementoHtml(modal)) {
    modal.setAttribute("hidden", "");
    document.body.style.overflow = "";
  }
}

function configurarModalGaleria() {
  const btnAbrir = document.getElementById("btnVerMaisFotos");
  const btnFechar = document.getElementById("btnFecharModal");
  const overlay = document.getElementById("modalOverlay");

  if (ehElementoHtml(btnAbrir)) { btnAbrir.addEventListener("click", abrirModalGaleria); }
  if (ehElementoHtml(btnFechar)) { btnFechar.addEventListener("click", fecharModalGaleria); }
  if (ehElementoHtml(overlay)) { overlay.addEventListener("click", fecharModalGaleria); }
}

// ─── Motivos para te amar ─────────────────────────────────────────────────────

/** @type {readonly string[]} */
const MOTIVOS_PARA_AMAR = [
  "O seu sorriso ilumina e transforma o meu dia inteiro.",
  "O som da sua risada é a minha melodia favorita no mundo.",
  "O seu abraço é o lugar onde eu me sinto mais seguro e em paz.",
  "O seu olhar transmite uma ternura que me apaixona todos os dias.",
  "A sua determinação e força me inspiram a ser uma pessoa melhor.",
  "Cada momento simples ao seu lado se torna uma memória inesquecível.",
  "A maneira como você cuida de quem ama revela a grandeza do seu coração.",
  "Com você eu aprendi que amar pode ser calmo, sem pressa e sem ansiedade.",
  "Você me faz querer comemorar até as coisas mais pequenas.",
  "Do seu lado, eu me sinto à vontade para ser exatamente quem eu sou.",
  "Você me recebe com paciência, mesmo nos dias em que eu sou intenso demais.",
  "Você me faz acreditar que eu mereço ser amado do jeito que sou.",
  "Você deixa até os dias comuns mais coloridos e leves.",
  "Você me incentiva a construir as coisas com calma e a fazer dar certo.",
  "Ver você feliz se tornou uma das minhas maiores alegrias.",
  "Você me mostrou que carinho e equilíbrio podem andar juntos."
];
function sortearNovoMotivo() {
  const el = document.getElementById("textoMensagemAmor");
  if (!ehElementoHtml(el)) { return; }
  const motivo = MOTIVOS_PARA_AMAR[Math.floor(Math.random() * MOTIVOS_PARA_AMAR.length)];
  el.style.opacity = "0";
  setTimeout(() => {
    el.textContent = `"${motivo}"`;
    el.style.opacity = "1";
  }, 200);
}

// ─── Efeito de clique com coração ────────────────────────────────────────────

/**
 * @param {number} x
 * @param {number} y
 */
function criarEfeitoCliqueCoracao(x, y) {
  const p = document.createElement("span");
  p.className = "particula-clique";
  p.textContent = "❤️";
  p.style.left = `${x}px`;
  p.style.top = `${y}px`;
  document.body.appendChild(p);
  setTimeout(() => { if (p.parentNode) { p.parentNode.removeChild(p); } }, 1200);
}

// ─── Canvas de corações flutuantes ────────────────────────────────────────────

/**
 * @typedef {{
 *   x: number; y: number; tamanho: number; velocidade: number;
 *   opacidade: number; oscilacao: number; passoOscilacao: number; cor: string;
 * }} ParticulaCoracao
 */

/** @type {readonly string[]} */
const CORES_CORACOES = ["#ffffff", "#ffe4e6", "#fbcfe8", "#fda4af", "#ffb3c1", "#ffccd5"];

function inicializarCanvasCoracoes() {
  const canvas = document.getElementById("canvasCoracoes");
  if (!ehCanvasHtml(canvas)) { return; }
  const ctx = canvas.getContext("2d");
  if (!ctx) { return; }

  let largura = (canvas.width = window.innerWidth);
  let altura  = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    largura = canvas.width = window.innerWidth;
    altura  = canvas.height = window.innerHeight;
  });

  /** @type {ParticulaCoracao[]} */
  const lista = [];
  for (let i = 0; i < 60; i++) {
    lista.push({
      x: Math.random() * largura,
      y: Math.random() * altura,
      tamanho: Math.random() * 16 + 8,
      velocidade: Math.random() * 0.9 + 0.35,
      opacidade: Math.random() * 0.55 + 0.25,
      oscilacao: Math.random() * Math.PI * 2,
      passoOscilacao: Math.random() * 0.025 + 0.01,
      cor: CORES_CORACOES[Math.floor(Math.random() * CORES_CORACOES.length)]
    });
  }

  /**
   * @param {CanvasRenderingContext2D} c
   * @param {number} x @param {number} y @param {number} d @param {number} op @param {string} cor
   */
  function desenharCoracao(c, x, y, d, op, cor) {
    c.save();
    c.globalAlpha = op;
    c.fillStyle = cor;
    c.beginPath();
    c.moveTo(x, y + d / 4);
    c.quadraticCurveTo(x, y, x + d / 4, y);
    c.quadraticCurveTo(x + d / 2, y, x + d / 2, y + d / 4);
    c.quadraticCurveTo(x + d / 2, y, x + (d * 3) / 4, y);
    c.quadraticCurveTo(x + d, y, x + d, y + d / 4);
    c.quadraticCurveTo(x + d, y + d / 2, x + (d * 3) / 4, y + (d * 3) / 4);
    c.lineTo(x + d / 2, y + d);
    c.lineTo(x + d / 4, y + (d * 3) / 4);
    c.quadraticCurveTo(x, y + d / 2, x, y + d / 4);
    c.fill();
    c.restore();
  }

  function animar() {
    ctx.clearRect(0, 0, largura, altura);
    for (const c of lista) {
      c.y -= c.velocidade;
      c.oscilacao += c.passoOscilacao;
      const xOsc = c.x + Math.sin(c.oscilacao) * 20;
      if (c.y < -c.tamanho) { c.y = altura + c.tamanho; c.x = Math.random() * largura; }
      desenharCoracao(ctx, xOsc, c.y, c.tamanho, c.opacidade, c.cor);
    }
    requestAnimationFrame(animar);
  }
  animar();
}

// ─── Loading romântico ────────────────────────────────────────────────────────

function iniciarLoadingCartinha() {
  const barra             = document.getElementById("barraProgressoLoading");
  const rotuloTexto       = document.getElementById("textoStatusLoading");
  const rotuloPorcentagem = document.getElementById("porcentagemLoading");
  const containerCartinha = document.getElementById("containerCartinhaLoading");
  const muralPolaroids    = document.getElementById("muralPolaroids");

  if (!ehElementoHtml(barra) || !ehElementoHtml(rotuloTexto) || !ehElementoHtml(rotuloPorcentagem)) { return; }

  const duracaoTotalMs = CONFIG_CASAL.duracaoLoadingSegundos * 1000;
  const tempoInicio    = performance.now();

  /** @param {number} tempoAtual */
  function atualizarProgresso(tempoAtual) {
    const decorrido   = Math.min(duracaoTotalMs, Math.max(0, tempoAtual - tempoInicio));
    const porcentagem = (decorrido / duracaoTotalMs) * 100;

    barra.style.width             = `${porcentagem.toFixed(2)}%`;
    rotuloPorcentagem.textContent = `${formatarNumeroDecimal(porcentagem)}%`;

    if (decorrido < duracaoTotalMs) {
      if (porcentagem > 70) { rotuloTexto.textContent = "Quase pronta para você... ✨"; }
      else if (porcentagem > 35) { rotuloTexto.textContent = "Separando nossas fotos com amor... 💌"; }
      requestAnimationFrame(atualizarProgresso);
    } else {
      barra.style.width             = "100%";
      rotuloPorcentagem.textContent = "100,00%";
      rotuloTexto.textContent       = "Prontinho! ✨";

      setTimeout(() => {
        if (ehElementoHtml(containerCartinha)) {
          containerCartinha.classList.add("sumir");
          setTimeout(() => {
            containerCartinha.style.display = "none";
            if (ehElementoHtml(muralPolaroids)) {
              muralPolaroids.classList.remove("oculto");
              muralPolaroids.classList.add("visivel");
              for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                  criarEfeitoCliqueCoracao(Math.random() * window.innerWidth, Math.random() * 250 + 80);
                }, i * 120);
              }
            }
          }, 750);
        }
      }, 500);
    }
  }

  requestAnimationFrame(atualizarProgresso);
}

// ─── Inicialização ────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  inicializarCanvasCoracoes();
  iniciarLoadingCartinha();

  gerarListaFotos();
  renderizarPolaroidsPrincipais();
  preencherModalGaleria();
  configurarModalGaleria();
  configurarLightbox();

  const botaoSortear = document.getElementById("botaoSortearMotivo");
  if (ehElementoHtml(botaoSortear)) {
    botaoSortear.addEventListener("click", sortearNovoMotivo);
  }

  window.addEventListener("click", (e) => {
    // Evita criar coração ao clicar em modais/botões
    const alvo = e.target;
    if (alvo instanceof Element) {
      if (alvo.closest(".modal-galeria") || alvo.closest(".lightbox") || alvo.closest("button")) { return; }
    }
    criarEfeitoCliqueCoracao(e.clientX, e.clientY);
  });
});
