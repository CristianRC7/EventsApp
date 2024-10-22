<?php
include 'conexion.php';
include 'cors.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if(isset($data['id_usuario']) && isset($data['id_evento'])){
    $idUsuario = $data['id_usuario'];
    $idEvento = $data['id_evento'];

    // Verificar si el usuario ya está registrado en el evento
    $checkQuery = "SELECT * FROM inscripciones WHERE id_datos = '$idUsuario' AND id_evento = '$idEvento'";
    $checkResult = mysqli_query($connection, $checkQuery);

    if(mysqli_num_rows($checkResult) > 0) {
        // Si ya está registrado, devolver mensaje de error
        echo json_encode(array('success' => false, 'message' => 'El usuario ya está registrado en este evento.'));
    } else {
        // Si no está registrado, insertar la asistencia
        $query = "INSERT INTO inscripciones (id_datos, id_evento) VALUES ('$idUsuario', '$idEvento')";
        $result = mysqli_query($connection, $query);

        if(!$result) {
            echo json_encode(array('success' => false, 'message' => 'Error al registrar asistencia', 'error' => mysqli_error($connection)));
        } else {
            echo json_encode(array('success' => true, 'message' => 'Asistencia registrada correctamente.'));
        }
    }
} else {
    echo json_encode(array('success' => false, 'message' => 'Faltan parámetros.'));
}

mysqli_close($connection);
?>
