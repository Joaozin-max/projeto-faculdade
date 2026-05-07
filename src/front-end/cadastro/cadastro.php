<?php
require_once __DIR__ . '/conexao.php';

$nome = trim($_POST['nome'] ?? '');
$email = trim($_POST['email'] ?? '');
$telefone = trim($_POST['telefone'] ?? '');
$senha = trim($_POST['senha'] ?? '');
$confirmarSenha = trim($_POST['confirmar-senha'] ?? '');

if (empty($nome) || empty($email) || empty($telefone) || empty($senha) || empty($confirmarSenha)) {
    die("Preencha todos os campos.");
}

if ($senha !== $confirmarSenha) {
    die("As senhas não conferem.");
}

$verifica = $pdo->prepare("SELECT id FROM usuarios WHERE email = ?");
$verifica->execute([$email]);

if ($verifica->rowCount() > 0) {
    die("Este e-mail já está cadastrado.");
}

$sql = "INSERT INTO usuarios (nome, email, telefone, senha) VALUES (?, ?, ?, ?)";
$stmt = $pdo->prepare($sql);

$stmt->execute([
    $nome,
    $email,
    $telefone,
    password_hash($senha, PASSWORD_DEFAULT)
]);

header("Location: ../login/login.php");
exit;