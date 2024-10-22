<?php
include 'conexion.php';
include 'cors.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['id_evento']) && isset($data['calificacion']) && isset($data['id_datos'])) {
    $id_evento = $data['id_evento'];
    $calificacion = $data['calificacion'];
    $id_datos = $data['id_datos']; 

    $queryCheck = "SELECT * FROM calificaciones WHERE id_evento = $id_evento AND id_datos = $id_datos";
    $resultCheck = mysqli_query($connection, $queryCheck);

    if (mysqli_num_rows($resultCheck) > 0) {
        $queryUpdate = "UPDATE calificaciones SET calificacion = $calificacion WHERE id_evento = $id_evento AND id_datos = $id_datos";
        if (mysqli_query($connection, $queryUpdate)) {
            echo json_encode(array('success' => true));
        } else {
            echo json_encode(array('success' => false, 'message' => 'Error al enviar la calificación'));
        }
    } else {
        $queryInsert = "INSERT INTO calificaciones (id_datos, id_evento, calificacion) VALUES ($id_datos, $id_evento, $calificacion)";
        if (mysqli_query($connection, $queryInsert)) {
            echo json_encode(array('success' => true));
        } else {
            echo json_encode(array('success' => false, 'message' => 'Error al enviar la calificación'));
        }
    }
} else {
    echo json_encode(array('success' => false, 'message' => 'Parámetros faltantes'));
}

mysqli_close($connection);
?>
