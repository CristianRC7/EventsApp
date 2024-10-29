<?php
include 'Conexion.php';
include 'cors.php';

header('Content-Type: application/json');

$input = file_get_contents('php://input');
$data = json_decode($input, true);

$id = $data['id'];

if (!$id) {
    http_response_code(400);
    echo json_encode(["error" => "ID de evento es obligatorio"]);
    exit;
}

$sql = "DELETE FROM eventos WHERE id = ?";
$stmt = $connection->prepare($sql);
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["success" => "Evento eliminado correctamente"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "No se pudo eliminar el evento"]);
}

$stmt->close();
$connection->close();
?>
