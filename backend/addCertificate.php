<?php
include 'conexion.php';
include 'cors.php';

$data = json_decode(file_get_contents("php://input"), true);
$userId = $data['userId'];
$nroCertificado = $data['nroCertificado'];
$gestiones = $data['gestiones'];

foreach ($gestiones as $idGestion) {
    $checkQuery = "SELECT id_participacion FROM participacion WHERE id_datos = ? AND id_gestion = ?";
    $stmt = $connection->prepare($checkQuery);
    $stmt->bind_param("ii", $userId, $idGestion);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'El usuario ya está registrado en una o más gestiones seleccionadas']);
        exit;
    }

    $insertQuery = "INSERT INTO participacion (id_datos, id_gestion, nro_certificado) VALUES (?, ?, ?)";
    $stmt = $connection->prepare($insertQuery);
    $stmt->bind_param("iis", $userId, $idGestion, $nroCertificado);
    $stmt->execute();
}

echo json_encode(['success' => true]);
?>
