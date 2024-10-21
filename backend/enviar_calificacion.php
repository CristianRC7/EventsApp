<?php
include 'conexion.php';
include 'cors.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['id_evento']) && isset($data['calificacion'])) {
    $id_evento = $data['id_evento'];
    $calificacion = $data['calificacion'];

    $query = "UPDATE calificaciones SET calificacion = $calificacion WHERE id_evento = $id_evento";

    if (mysqli_query($connection, $query)) {
        echo json_encode(array('success' => true));
    } else {
        echo json_encode(array('success' => false, 'message' => 'Error al enviar la calificación'));
    }
} else {
    echo json_encode(array('success' => false, 'message' => 'Parámetros faltantes'));
}

mysqli_close($connection);
?>
