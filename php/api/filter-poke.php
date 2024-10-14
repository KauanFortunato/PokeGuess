<?php
header('Access-Control-Allow-Origin: *');

include_once("../config/config.php");

$filter = $_GET['term'] ?? '';
$sql = "SELECT nome, img_poke FROM pokemon WHERE nome LIKE ?";
$stmt = $conn->prepare($sql);

$param = $filter . '%';
$stmt->bind_param('s', $param);

$stmt->execute();

$result = $stmt->get_result();

$pokemons = [];
while ($row = $result->fetch_assoc()) {
    $imgData = base64_encode($row['img_poke']);

    $pokemons[] = [
        'nome' => $row['nome'],
        'imagem' => $imgData
    ];
}

header('Content-Type: application/json');
echo json_encode($pokemons);

$stmt->close();
$conn->close();
