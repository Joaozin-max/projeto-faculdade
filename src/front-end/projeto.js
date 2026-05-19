// Aguarda todo o HTML carregar antes de iniciar os scripts.
document.addEventListener("DOMContentLoaded", function () {
  iniciarAnimacao();
  iniciarCardapioECarrinho();
  iniciarMenuUsuario();
});

// Faz a rolagem suave até a seção do cardápio.
function Cardapio() {
  const section = document.getElementById("cardapio");
  const offset = 80;

  if (!section) return;

  window.scrollTo({
    top: section.offsetTop - offset,
    behavior: "smooth",
  });
}

// Anima elementos com a classe .reveal quando aparecem na tela.
function iniciarAnimacao() {
  const elementos = document.querySelectorAll(".reveal");

  if (!elementos.length) return;

  const observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  elementos.forEach(function (elemento) {
    observer.observe(elemento);
  });
}

// Controla cardápio, carrinho e finalização do pedido.
function iniciarCardapioECarrinho() {
  const produtos = {
    cafes: [
      { nome: "Espresso", preco: 7.9, desc: "Café puro e intenso, extraído na pressão perfeita." },
      { nome: "Cappuccino", preco: 12.9, desc: "Espresso com leite vaporizado e espuma cremosa." },
      { nome: "Latte", preco: 14.9, desc: "Espresso suave com leite sedoso e latte art." },
      { nome: "Americano", preco: 9.9, desc: "Espresso diluído em água quente, sabor equilibrado." },
      { nome: "Macchiato", preco: 10.9, desc: "Espresso marcado com toque de espuma de leite." },
    ],
    especiais: [
      { nome: "Mocha", preco: 15.9, desc: "Mistura perfeita de café, leite e chocolate." },
      { nome: "Caramel Latte", preco: 16.9, desc: "Latte cremoso com calda de caramelo." },
      { nome: "Vanilla Coffee", preco: 15.5, desc: "Café especial com toque suave de baunilha." },
      { nome: "Affogato", preco: 18.9, desc: "Espresso servido com sorvete cremoso." },
    ],
    doces: [
      { nome: "Donut", preco: 8.9, desc: "Donut macio com cobertura especial." },
      { nome: "Brownie", preco: 10.9, desc: "Brownie de chocolate intenso." },
      { nome: "Cheesecake", preco: 13.9, desc: "Cheesecake cremoso com calda de frutas." },
      { nome: "Cookie", preco: 7.9, desc: "Cookie artesanal com gotas de chocolate." },
    ],
    salgados: [
      { nome: "Pão de Queijo", preco: 6.9, desc: "Quentinho, macio e crocante por fora." },
      { nome: "Croissant", preco: 11.9, desc: "Croissant amanteigado com massa leve." },
      { nome: "Sanduíche Natural", preco: 14.9, desc: "Opção leve com recheio fresco." },
      { nome: "Empada", preco: 9.9, desc: "Empada dourada com recheio cremoso." },
    ],
  };

  const grid = document.getElementById("gridCardapio");
  const botoesCategoria = document.querySelectorAll(".categoria");

  const btnAbrirCarrinho = document.getElementById("abrirCarrinho");
  const btnFecharCarrinho = document.getElementById("fecharCarrinho");
  const overlayCarrinho = document.getElementById("overlayCarrinho");
  const carrinhoEl = document.getElementById("carrinho");

  const itensCarrinhoEl = document.getElementById("itensCarrinho");
  const totalEl = document.getElementById("total");
  const totalFinalizacaoEl = document.getElementById("totalFinalizacao");
  const contadorEl = document.getElementById("contadorCarrinho");
  const btnFinalizar = document.getElementById("finalizar");

  const telaCarrinho = document.getElementById("telaCarrinho");
  const formPedido = document.getElementById("formPedido");
  const pedidoConfirmado = document.getElementById("pedidoConfirmado");

  const nomeCliente = document.getElementById("nomeCliente");
  const observacao = document.getElementById("observacao");
  const mensagemConfirmacao = document.getElementById("mensagemConfirmacao");
  const observacaoConfirmada = document.getElementById("observacaoConfirmada");

  const btnVoltarCarrinho = document.getElementById("voltarCarrinho");
  const btnNovoPedido = document.getElementById("novoPedido");
  const etapas = document.querySelectorAll(".etapa");

  let carrinho = [];

  // Converte número para moeda brasileira.
  function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  // Renderiza os produtos da categoria escolhida.
  function renderProdutos(categoria) {
    if (!grid || !produtos[categoria]) return;

    grid.innerHTML = "";

    produtos[categoria].forEach(function (produto) {
      const card = document.createElement("div");
      card.className = "card-item reveal is-visible";

      card.innerHTML = `
        <div class="topo">
          <h3>${produto.nome}</h3>
          <span class="preco">${formatarMoeda(produto.preco)}</span>
        </div>

        <p>${produto.desc}</p>

        <button type="button" class="btn-adicionar">
          + Adicionar
        </button>
      `;

      card.querySelector(".btn-adicionar").addEventListener("click", function () {
        adicionarAoCarrinho(produto.nome);
      });

      grid.appendChild(card);
    });
  }

  // Busca um produto pelo nome dentro de todas as categorias.
  function encontrarProduto(nome) {
    const categorias = Object.keys(produtos);

    for (const categoria of categorias) {
      const produto = produtos[categoria].find(function (item) {
        return item.nome === nome;
      });

      if (produto) return produto;
    }

    return null;
  }

  // Agrupa itens iguais para mostrar quantidade no carrinho.
  function itensAgrupados() {
    const agrupados = [];

    carrinho.forEach(function (item) {
      const existente = agrupados.find(function (produto) {
        return produto.nome === item.nome;
      });

      if (existente) {
        existente.quantidade += 1;
      } else {
        agrupados.push({
          nome: item.nome,
          preco: item.preco,
          desc: item.desc,
          quantidade: 1,
        });
      }
    });

    return agrupados;
  }

  // Calcula o total do pedido.
  function calcularTotal() {
    return carrinho.reduce(function (total, item) {
      return total + item.preco;
    }, 0);
  }

  // Alterna entre as telas do carrinho.
  function mostrarTela(tela) {
    [telaCarrinho, formPedido, pedidoConfirmado].forEach(function (elemento) {
      if (elemento) elemento.classList.remove("ativa");
    });

    etapas.forEach(function (etapa) {
      etapa.classList.toggle("ativa", etapa.dataset.etapa === tela);
    });

    if (tela === "carrinho" && telaCarrinho) telaCarrinho.classList.add("ativa");
    if (tela === "dados" && formPedido) formPedido.classList.add("ativa");
    if (tela === "confirmado" && pedidoConfirmado) pedidoConfirmado.classList.add("ativa");
  }

  // Adiciona produto ao carrinho.
  function adicionarAoCarrinho(nome) {
    const produto = encontrarProduto(nome);

    if (!produto) return;

    carrinho.push(produto);
    atualizarCarrinho();
    mostrarTela("carrinho");
    abrirCarrinho();
  }

  // Remove um item ou todos os itens iguais.
  function removerDoCarrinho(nome, removerTodos) {
    if (removerTodos) {
      carrinho = carrinho.filter(function (item) {
        return item.nome !== nome;
      });
    } else {
      const index = carrinho.findIndex(function (item) {
        return item.nome === nome;
      });

      if (index >= 0) carrinho.splice(index, 1);
    }

    atualizarCarrinho();
  }

  // Atualiza visualmente itens, total e contador do carrinho.
  function atualizarCarrinho() {
    if (!itensCarrinhoEl || !totalEl || !contadorEl || !btnFinalizar) return;

    const total = calcularTotal();
    const agrupados = itensAgrupados();

    itensCarrinhoEl.innerHTML = "";
    contadorEl.innerText = carrinho.length;
    totalEl.innerText = formatarMoeda(total);

    if (totalFinalizacaoEl) {
      totalFinalizacaoEl.innerText = formatarMoeda(total);
    }

    btnFinalizar.disabled = carrinho.length === 0;

    if (carrinho.length === 0) {
      itensCarrinhoEl.innerHTML = `<p class="carrinho-vazio">Seu carrinho está vazio.</p>`;
      return;
    }

    agrupados.forEach(function (item) {
      const itemCarrinho = document.createElement("div");
      itemCarrinho.className = "item-carrinho";

      itemCarrinho.innerHTML = `
        <div class="item-topo">
          <div>
            <span class="item-nome">${item.nome}</span>
            <span class="item-preco">${formatarMoeda(item.preco)}</span>
          </div>

          <button type="button" class="btn-remover" aria-label="Remover item">
            ✕
          </button>
        </div>

        <div class="item-acoes">
          <div class="controle-quantidade">
            <button type="button" class="btn-quantidade diminuir" aria-label="Diminuir quantidade">
              −
            </button>

            <span class="quantidade">${item.quantidade}</span>

            <button type="button" class="btn-quantidade aumentar" aria-label="Aumentar quantidade">
              +
            </button>
          </div>

          <span class="subtotal">${formatarMoeda(item.preco * item.quantidade)}</span>
        </div>
      `;

      itemCarrinho.querySelector(".btn-remover").addEventListener("click", function () {
        removerDoCarrinho(item.nome, true);
      });

      itemCarrinho.querySelector(".diminuir").addEventListener("click", function () {
        removerDoCarrinho(item.nome, false);
      });

      itemCarrinho.querySelector(".aumentar").addEventListener("click", function () {
        adicionarAoCarrinho(item.nome);
      });

      itensCarrinhoEl.appendChild(itemCarrinho);
    });
  }

  // Abre o carrinho lateral.
  function abrirCarrinho() {
    if (!carrinhoEl || !overlayCarrinho) return;

    carrinhoEl.classList.add("ativo");
    overlayCarrinho.classList.add("ativo");
    document.body.classList.add("carrinho-aberto");
  }

  // Fecha o carrinho lateral.
  function fecharCarrinho() {
    if (!carrinhoEl || !overlayCarrinho) return;

    carrinhoEl.classList.remove("ativo");
    overlayCarrinho.classList.remove("ativo");
    document.body.classList.remove("carrinho-aberto");
  }

  // Eventos das categorias.
  botoesCategoria.forEach(function (botao) {
    botao.addEventListener("click", function () {
      botoesCategoria.forEach(function (item) {
        item.classList.remove("ativa");
      });

      botao.classList.add("ativa");
      renderProdutos(botao.dataset.cat);
    });
  });

  // Eventos do carrinho.
  if (btnAbrirCarrinho) {
    btnAbrirCarrinho.addEventListener("click", function () {
      mostrarTela("carrinho");
      abrirCarrinho();
    });
  }

  if (btnFecharCarrinho) {
    btnFecharCarrinho.addEventListener("click", fecharCarrinho);
  }

  if (overlayCarrinho) {
    overlayCarrinho.addEventListener("click", fecharCarrinho);
  }

  if (btnFinalizar) {
    btnFinalizar.addEventListener("click", function () {
      if (carrinho.length === 0) return;

      mostrarTela("dados");

      if (nomeCliente) {
        nomeCliente.focus();
      }
    });
  }

  if (btnVoltarCarrinho) {
    btnVoltarCarrinho.addEventListener("click", function () {
      mostrarTela("carrinho");
    });
  }

  if (formPedido) {
    formPedido.addEventListener("submit", function (event) {
      event.preventDefault();

      const nome = nomeCliente.value.trim();
      const obs = observacao.value.trim();

      if (!nome) {
        nomeCliente.focus();
        return;
      }

      mensagemConfirmacao.innerText =
        `Obrigado, ${nome}. Seu pedido de ${formatarMoeda(calcularTotal())} foi enviado para preparo.`;

      if (obs) {
        observacaoConfirmada.innerText = obs;
        observacaoConfirmada.classList.add("ativa");
      } else {
        observacaoConfirmada.innerText = "";
        observacaoConfirmada.classList.remove("ativa");
      }

      mostrarTela("confirmado");
    });
  }

  if (btnNovoPedido) {
    btnNovoPedido.addEventListener("click", function () {
      carrinho = [];

      if (nomeCliente) nomeCliente.value = "";
      if (observacao) observacao.value = "";

      atualizarCarrinho();
      mostrarTela("carrinho");
      fecharCarrinho();
    });
  }

  // Estado inicial.
  renderProdutos("cafes");
  atualizarCarrinho();
  mostrarTela("carrinho");
}

// Controla o dropdown do usuário.
function iniciarMenuUsuario() {
  const userTrigger = document.getElementById("userTrigger");
  const dropdownMenu = document.getElementById("dropdownMenu");

  if (!userTrigger || !dropdownMenu) return;

  userTrigger.addEventListener("click", function () {
    const menuAberto = dropdownMenu.classList.toggle("ativo");
    userTrigger.setAttribute("aria-expanded", menuAberto ? "true" : "false");
  });

  document.addEventListener("click", function (event) {
    const clicouFora =
      !userTrigger.contains(event.target) &&
      !dropdownMenu.contains(event.target);

    if (clicouFora) {
      dropdownMenu.classList.remove("ativo");
      userTrigger.setAttribute("aria-expanded", "false");
    }
  });
}