<?php

$host = "db";
$banco = "app_db";
$usuario = "app_user";
$senha = "app_pass";

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$banco;charset=utf8",
        $usuario,
        $senha
    );

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch(PDOException $e) {
    die("Erro banco: " . $e->getMessage());
}