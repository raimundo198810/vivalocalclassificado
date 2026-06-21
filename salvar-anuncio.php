<?php
require "conexao.php";

$titulo = $_POST['titulo'];
$descricao = $_POST['descricao'];
$preco = $_POST['preco'];
$categoria = $_POST['categoria'];
$cidade = $_POST['cidade'];
$estado = $_POST['estado'];

$sql = $pdo->prepare("INSERT INTO anuncios (titulo, descricao, preco, categoria, cidade, estado)
VALUES (?, ?, ?, ?, ?, ?)");

$sql->execute([$titulo, $descricao, $preco, $categoria, $cidade, $estado]);

echo "Anúncio criado com sucesso!";
?>