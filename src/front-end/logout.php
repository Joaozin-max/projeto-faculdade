<?php
/**
 * ============================================
 * LOGOUT DO USUÁRIO
 * ============================================
 * Este arquivo:
 * 1. Inicia a sessão
 * 2. Remove todos os dados da sessão
 * 3. Destrói a sessão atual
 * 4. Redireciona para a tela de login
 */

// Inicia a sessão atual
session_start();

// Remove todas as variáveis da sessão
$_SESSION = [];

// Remove o cookie da sessão (mais seguro)
if (ini_get("session.use_cookies")) {

    $params = session_get_cookie_params();

    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );
}

// Destrói completamente a sessão
session_destroy();

// Redireciona para a tela de login
header("Location: login/login.php");
exit;
?>