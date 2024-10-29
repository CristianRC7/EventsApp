<?php
include 'Conexion.php';
include 'cors.php';

header('Content-Type: application/json');

// Retrieve and decode JSON payload
$input = file_get_contents('php://input');
$data = json_decode($input, true);

$hora = $data['hora'];
$descripcion = $data['descripcion'];
$aula = $data['aula'];
$expositor = $data['expositor'];
$fecha = $data['fecha'];

// Validate that all fields are provided
if (!$hora || !$descripcion || !$aula || !$expositor || !$fecha) {
    http_response_code(400);
    echo json_encode(["error" => "Todos los campos son obligatorios"]);
    exit;
}

// Insert the event into the database
$sql = "INSERT INTO eventos (hora, descripcion, aula, expositor, fecha) VALUES (?, ?, ?, ?, ?)";
$stmt = $connection->prepare($sql);
$stmt->bind_param("sssss", $hora, $descripcion, $aula, $expositor, $fecha);

if ($stmt->execute()) {
    echo json_encode(["success" => "Evento agregado correctamente"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "No se pudo agregar el evento"]);
}

$stmt->close();
$connection->close();
?>
