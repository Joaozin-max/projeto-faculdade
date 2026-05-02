const SUPABASE_URL = "https://xikyihhbiawjnqchpjtf.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhpa3lpaGhiaWF3am5xY2hwanRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MDI5OTUsImV4cCI6MjA5MzI3ODk5NX0.pv_DYa0GuZtTYwkZKinV3Jh-e3lnc0c_KZWLWch4eKE";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", function () {
  iniciarCadastro();
  iniciarLogin();
  iniciarMenuUsuario();
});

function iniciarCadastro() {
  const formCadastro = document.getElementById("formCadastro");

  if (!formCadastro) return;

  formCadastro.addEventListener("submit", async function (event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmar-senha").value;

    if (senha !== confirmarSenha) {
      alert("As senhas não conferem.");
      return;
    }

    const { error } = await supabaseClient.auth.signUp({
      email: email,
      password: senha,
      options: {
        data: {
          nome: nome,
          telefone: telefone
        }
      }
    });

    if (error) {
      alert("Erro ao cadastrar: " + error.message);
      return;
    }

    alert("Cadastro realizado com sucesso!");
    window.location.href = "indeex.html";
  });
}

function iniciarLogin() {
  const formLogin = document.getElementById("formLogin");

  if (!formLogin) return;

  formLogin.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    const { error } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: senha
    });

    if (error) {
      alert("Erro ao entrar: " + error.message);
      return;
    }

    window.location.href = "projeto.html";
  });
}

async function iniciarMenuUsuario() {
  const linkAuth = document.getElementById("linkAuth");
  const userMenu = document.getElementById("userMenu");
  const userName = document.getElementById("userName");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const userTrigger = document.getElementById("userTrigger");
  const btnSair = document.getElementById("btnSair");

  if (!linkAuth || !userMenu || !userName || !dropdownMenu || !userTrigger || !btnSair) {
    return;
  }

  const { data, error } = await supabaseClient.auth.getUser();

  if (error || !data.user) {
    linkAuth.style.display = "inline-block";
    userMenu.style.display = "none";
    return;
  }

  const nomeCompleto = data.user.user_metadata?.nome || data.user.email;
  const nomeCurto = pegarPrimeiroESegundoNome(nomeCompleto);

  userName.textContent = nomeCurto;
  linkAuth.style.display = "none";
  userMenu.style.display = "flex";

  userTrigger.addEventListener("click", function (event) {
    event.stopPropagation();

    if (dropdownMenu.style.display === "flex") {
      dropdownMenu.style.display = "none";
    } else {
      dropdownMenu.style.display = "flex";
    }
  });

  document.addEventListener("click", function (event) {
    if (!userMenu.contains(event.target)) {
      dropdownMenu.style.display = "none";
    }
  });

  btnSair.addEventListener("click", async function () {
    await supabaseClient.auth.signOut();
    window.location.href = "indeex.html";
  });
}

function pegarPrimeiroESegundoNome(nome) {
  if (!nome) return "Usuário";

  const partes = nome.trim().split(" ");

  if (partes.length >= 2) {
    return `${partes[0]} ${partes[1]}`;
  }

  return partes[0];
}