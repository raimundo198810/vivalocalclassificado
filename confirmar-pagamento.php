<?php

$anuncio_id = $_POST['anuncio_id'];
$nome = $_POST['nome'];

?>

<!DOCTYPE html>
<html>
<head>
    <title>Pagamento Confirmado</title>
</head>
<body>

<h1>Pagamento Recebido!</h1>

<p>Obrigado, <?php echo $nome; ?>.</p>

<p>Seu anúncio #<?php echo $anuncio_id; ?> foi enviado para análise.</p>

<a href="index.php">Voltar ao site</a>

</body>
</html>