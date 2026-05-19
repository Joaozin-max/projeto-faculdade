<?php
session_start();

require_once __DIR__ . '/../cadastro/conexao.php';

$erro = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $senha = trim($_POST['senha'] ?? '');

    if (empty($email) || empty($senha)) {
        $erro = "Preencha todos os campos.";
    } else {
        $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE email = ?");
        $stmt->execute([$email]);

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($senha, $user['senha'])) {
            session_regenerate_id(true);

            $_SESSION['usuario_id'] = $user['id'];
            $_SESSION['usuario_nome'] = $user['nome'];
            $_SESSION['usuario_email'] = $user['email'];

            header("Location: ../projeto.php");
            exit;
        }

        $erro = "E-mail ou senha inválidos.";
    }
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login | Cafeteria</title>
  <link rel="stylesheet" href="login.css">
</head>
<body>

<section class="login-page">
  <div class="login-container">

    <div class="login-left">
      <div class="login-box">
        <span class="tag">Cafeteria Especial</span>

        <h1>Bem-vindo</h1>

        <?php if (!empty($erro)): ?>
          <p class="erro">
            <?= htmlspecialchars($erro) ?>
          </p>
        <?php endif; ?>

        <form action="login.php" method="POST">
          <div class="input-group">
            <label for="email">E-mail</label>
            <input type="email" id="email" name="email" required>
          </div>

          <div class="input-group">
            <label for="senha">Senha</label>
            <input type="password" id="senha" name="senha" required>
          </div>

          <button class="btn" type="submit">Entrar</button>
        </form>

        <p class="account">
          Não tem conta?
          <a href="../cadastro/pag_cadastro.php">Criar conta</a>
        </p>
      </div>
    </div>

    <div class="login-right">
      <div class="overlay">
        <h2>O melhor café ☕</h2>
      </div>
    </div>

  </div>
</section>

</body>
</html>
