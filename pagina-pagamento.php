<!DOCTYPE html>
<html>
<head>
    <title>Pagamento</title>
</head>
<body>

<h2>Destacar Anúncio</h2>

<p>Valor: R$ 19,90</p>

<form action="confirmar-pagamento.php" method="POST">
    <input type="hidden" name="anuncio_id" value="1">

    <label>Nome:</label><br>
    <input type="text" name="nome" required><br><br>

    <label>CPF:</label><br>
    <input type="text" name="cpf" required><br><br>

    <button type="submit">
        Confirmar Pagamento
    </button>
</form>

</body>
</html>