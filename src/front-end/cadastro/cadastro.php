<?php
require_once __DIR__ . '/conexao.php';

$nome = trim($_POST['nome'] ?? '');
$email = trim($_POST['email'] ?? '');
$telefone = trim($_POST['telefone'] ?? '');
$senha = trim($_POST['senha'] ?? '');
$confirmarSenha = trim($_POST['confirmar-senha'] ?? '');

if (empty($nome) || empty($email) || empty($telefone) || empty($senha) || empty($confirmarSenha)) {
    die('Preencha todos os campos.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    die('Digite um e-mail válido.');
}

if ($senha !== $confirmarSenha) {
    die('As senhas não conferem.');
}

$verificaEmail = $pdo->prepare('SELECT id FROM usuarios WHERE email = ? LIMIT 1');
$verificaEmail->execute([$email]);

if ($verificaEmail->fetch()) {
    die('Este e-mail já está cadastrado.');
}

$senhaCriptografada = password_hash($senha, PASSWORD_DEFAULT);

$cadastrarUsuario = $pdo->prepare(
    'INSERT INTO usuarios (nome, email, telefone, senha) VALUES (?, ?, ?, ?)'
);

$cadastrarUsuario->execute([
    $nome,
    $email,
    $telefone,
    $senhaCriptografada
]);

header('Location: ../login/login.php');
exit;