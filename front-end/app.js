function Cardapio()
{
  let section = document.getElementById("cardapio");
  let offset = 80; // altura da navbar fixa

  let top = section.offsetTop - offset;

  window.scrollTo({
    top: top,
    behavior: "smooth"
  });
}
//  animação
  const elementos = document.querySelectorAll(".reveal");
  if (elementos.length) {
    const obs = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );

    elementos.forEach((el) => obs.observe(el));
  }

document.addEventListener("DOMContentLoaded", () => {
  // 1) Formulário de Contato
  const formContato = document.querySelector(".formulario");
  if (formContato) {
    formContato.addEventListener("submit", (e) => {
      e.preventDefault();

      const btnSubmit = formContato.querySelector("button[type='submit']");
      if (!btnSubmit) return;

      const textoOriginal = btnSubmit.innerText;

      btnSubmit.innerText = "Enviando...";
      btnSubmit.style.backgroundColor = "#b5952f";

      setTimeout(() => {
        btnSubmit.innerText = "Mensagem Enviada!";
        btnSubmit.style.backgroundColor = "#28a745";
        btnSubmit.style.color = "#fff";
        formContato.reset();

        setTimeout(() => {
          btnSubmit.innerText = textoOriginal;
          btnSubmit.style.backgroundColor = "var(--dourado)";
          btnSubmit.style.color = "#121212";
        }, 4000);
      }, 1000);
    });
  }

  //  animação
  const elementos = document.querySelectorAll(".reveal");
  if (elementos.length) {
    const obs = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );

    elementos.forEach((el) => obs.observe(el));
  }

// Cardápio e Carrinho
iniciarCardapioECarrinho();
});

function iniciarCardapioECarrinho() {
  const produtos = {
    cafes: [
      {
        nome: "Espresso",
        preco: "R$ 7,90",
        desc: "Café puro e intenso, extraído na pressão perfeita."
      },
      {
        nome: "Cappuccino",
        preco: "R$ 12,90",
        desc: "Espresso com leite vaporizado e espuma cremosa."
      },
      {
        nome: "Latte",
        preco: "R$ 14,90",
        desc: "Espresso suave com leite sedoso e latte art."
      },
      {
        nome: "Americano",
        preco: "R$ 9,90",
        desc: "Espresso diluído em água quente, sabor equilibrado."
      },
      {
        nome: "Macchiato",
        preco: "R$ 10,90",
        desc: "Espresso marcado com toque de espuma de leite."
      }
    ],

    especiais: [
      {
        nome: "Mocha",
        preco: "R$ 15,90",
        desc: "Mistura perfeita de café, leite e chocolate."
      },
      {
        nome: "Caramel Latte",
        preco: "R$ 16,90",
        desc: "Latte cremoso com calda de caramelo."
      },
      {
        nome: "Vanilla Coffee",
        preco: "R$ 15,50",
        desc: "Café especial com toque suave de baunilha."
      },
      {
        nome: "Affogato",
        preco: "R$ 18,90",
        desc: "Espresso servido com sorvete cremoso."
      }
    ],

    doces: [
      {
        nome: "Donut",
        preco: "R$ 8,90",
        desc: "Donut macio com cobertura especial."
      },
      {
        nome: "Brownie",
        preco: "R$ 10,90",
        desc: "Brownie de chocolate intenso."
      },
      {
        nome: "Cheesecake",
        preco: "R$ 13,90",
        desc: "Cheesecake cremoso com calda de frutas."
      },
      {
        nome: "Cookie",
        preco: "R$ 7,90",
        desc: "Cookie artesanal com gotas de chocolate."
      }
    ],

    salgados: [
      {
        nome: "Pão de Queijo",
        preco: "R$ 6,90",
        desc: "Quentinho, macio e crocante por fora."
      },
      {
        nome: "Croissant",
        preco: "R$ 11,90",
        desc: "Croissant amanteigado com massa leve."
      },
      {
        nome: "Sanduíche Natural",
        preco: "R$ 14,90",
        desc: "Opção leve com recheio fresco."
      },
      {
        nome: "Empada",
        preco: "R$ 9,90",
        desc: "Empada dourada com recheio cremoso."
      }
    ]
  };

  const grid = document.getElementById("gridCardapio");
  const botoesCategoria = document.querySelectorAll(".categoria");
  const btnAbrirCarrinho = document.getElementById("abrirCarrinho");
  const btnFecharCarrinho = document.getElementById("fecharCarrinho");
  const overlayCarrinho = document.getElementById("overlayCarrinho");
  const carrinhoEl = document.getElementById("carrinho");
  const itensCarrinhoEl = document.getElementById("itensCarrinho");
  const totalEl = document.getElementById("total");
  const contadorEl = document.getElementById("contador");
  const btnFinalizar = document.getElementById("finalizar");

  let carrinho = [];

  function renderProdutos(categoria) {
    if (!grid || !produtos[categoria]) return;

    grid.innerHTML = "";

    produtos[categoria].forEach((produto) => {
      const card = document.createElement("div");
      card.className = "card-item";

      card.innerHTML = `
        <div class="topo">
          <h3>${produto.nome}</h3>
          <span>${produto.preco}</span>
        </div>
        <p>${produto.desc}</p>
        <button type="button" class="btn-adicionar">+ Adicionar</button>
      `;

      const botaoAdicionar = card.querySelector(".btn-adicionar");
      botaoAdicionar?.addEventListener("click", () => adicionarAoCarrinho(produto.nome));

      grid.appendChild(card);
    });
  }

  function encontrarProduto(nome) {
    for (const categoria in produtos) {
      const item = produtos[categoria].find((produto) => produto.nome === nome);
      if (item) return item;
    }
    return null;
  }

  function adicionarAoCarrinho(nome) {
    const produto = encontrarProduto(nome);
    if (!produto) return;

    carrinho.push(produto);
    atualizarCarrinho();
    abrirCarrinho();
  }

  function atualizarCarrinho() {
    if (!itensCarrinhoEl || !totalEl || !contadorEl) return;

    itensCarrinhoEl.innerHTML = "";
    contadorEl.innerText = carrinho.length;

    if (carrinho.length === 0) {
      itensCarrinhoEl.innerHTML = `<p class="carrinho-vazio">Seu carrinho está vazio.</p>`;
      totalEl.innerText = "R$ 0,00";
      return;
    }

    let total = 0;

    carrinho.forEach((item, index) => {
      const preco = parseFloat(item.preco.replace("R$ ", "").replace(",", "."));
      total += preco;

      const itemCarrinho = document.createElement("div");
      itemCarrinho.className = "item-carrinho";

      itemCarrinho.innerHTML = `
        <div class="item-info">
          <span class="item-nome">${item.nome}</span>
          <span class="item-preco">${item.preco}</span>
        </div>
        <button type="button" class="btn-remover" aria-label="Remover item">✕</button>
      `;

      const btnRemover = itemCarrinho.querySelector(".btn-remover");
      btnRemover?.addEventListener("click", () => removerDoCarrinho(index));

      itensCarrinhoEl.appendChild(itemCarrinho);
    });

    totalEl.innerText = "R$ " + total.toFixed(2).replace(".", ",");
  }

  function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
  }

  function abrirCarrinho() {
    carrinhoEl?.classList.add("ativo");
    overlayCarrinho?.classList.add("ativo");
  }

  function fecharCarrinho() {
    carrinhoEl?.classList.remove("ativo");
    overlayCarrinho?.classList.remove("ativo");
  }

  botoesCategoria.forEach((botao) => {
    botao.addEventListener("click", () => {
      document.querySelector(".categoria.ativa")?.classList.remove("ativa");
      botao.classList.add("ativa");

      const categoria = botao.dataset.cat;
      renderProdutos(categoria);
    });
  });

  btnAbrirCarrinho?.addEventListener("click", abrirCarrinho);
  btnFecharCarrinho?.addEventListener("click", fecharCarrinho);
  overlayCarrinho?.addEventListener("click", fecharCarrinho);

  btnFinalizar?.addEventListener("click", () => {
    if (carrinho.length === 0) {
      alert("Carrinho vazio!");
      return;
    }

    alert("Pedido realizado com sucesso! ☕");
    carrinho = [];
    atualizarCarrinho();
    fecharCarrinho();
  });

  renderProdutos("cafes");
  atualizarCarrinho();
}