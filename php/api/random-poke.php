<?php

use LDAP\Result;

include_once("../config/config.php");

session_start();

$sql = "SELECT * FROM pokemon ORDER BY RAND() LIMIT 1"; // Pega apenas 1 Pokémon da base de dados
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();

    $img_blob = $row['img_poke'];
    $imagem_base64 = base64_encode($img_blob);  // Coloca a imagem BLOB para base64

    $row["imagem_base64"] = $imagem_base64;
    unset($row['img_poke']);                    // Remove o campo "img_poke" da array

    $_SESSION['pokemon_sorteado'] = $row;

    echo json_encode(['status' => 'sorteado', 'pokemon' => $row]);
} else {
    echo json_encode(['status' => 'erro', 'mensagem' => 'Nenhum Pokémon encontrado na base de dados.']);
}

$conn->close();
