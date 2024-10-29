<?php
include 'conexion.php';
include 'cors.php';

header("Content-Type: application/json");

$input = json_decode(file_get_contents("php://input"), true);
$id_evento = $input['id_evento'];
$fecha_habilitada = $input['fecha_habilitada'];

$query = "INSERT INTO habilitacion_calificacion (id_evento, fecha_habilitada) VALUES ('$id_evento', '$fecha_habilitada')";

if (mysqli_query($connection, $query)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => mysqli_error($connection)]);
}

mysqli_close($connection);
?>
