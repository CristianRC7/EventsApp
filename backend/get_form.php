<?php
date_default_timezone_set('America/La_Paz');

include 'conexion.php';
include 'cors.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['usuario'])) {
    $usuario = $data['usuario'];

    // Obtener el id del usuario
    $queryUsuario = "SELECT id FROM datos WHERE usuario='$usuario'";
    $resultUsuario = mysqli_query($connection, $queryUsuario);

    if (!$resultUsuario || mysqli_num_rows($resultUsuario) == 0) {
        echo json_encode(array('success' => false, 'message' => 'Usuario no encontrado'));
        exit;
    }

    $usuarioRow = mysqli_fetch_assoc($resultUsuario);
    $usuarioId = $usuarioRow['id'];

    // Obtener eventos donde el usuario está inscrito y verificar si ha respondido la encuesta
    $queryEventos = "
        SELECT e.id, e.descripcion, e.hora, c.calificacion, c.fecha_habilitada
        FROM eventos e
        INNER JOIN calificaciones c ON e.id = c.id_evento AND c.id_datos = $usuarioId
    ";
    $resultEventos = mysqli_query($connection, $queryEventos);

    if (!$resultEventos) {
        echo json_encode(array('success' => false, 'message' => 'Error en la consulta', 'error' => mysqli_error($connection)));
        exit;
    }

    $eventos = array();
    while ($row = mysqli_fetch_assoc($resultEventos)) {
        // Verificar si la fecha de habilitación es anterior o igual a la fecha actual
        $fechaHabilitada = strtotime($row['fecha_habilitada']);
        $fechaActual = strtotime(date('Y-m-d'));
        $row['fecha_habilitada'] = date('Y-m-d', $fechaHabilitada);

        if ($fechaHabilitada <= $fechaActual) {
            // Si la fecha de habilitación es igual o anterior a la fecha actual
            if ($row['calificacion'] === null) {
                // Si la calificación es null, mostrar "Responder Encuesta"
                $row['status'] = 'Responder Encuesta';
            } else {
                // Si la calificación no es null, mostrar "Encuesta Enviada" en verde
                $row['status'] = 'Encuesta Enviada';
            }
        } else {
            // Si la fecha de habilitación es posterior a la fecha actual, no mostrar nada
            $row['status'] = '';
        }

        $eventos[] = $row;
    }

    echo json_encode(array('success' => true, 'eventos' => $eventos));
} else {
    echo json_encode(array('success' => false, 'message' => 'Parámetros faltantes'));
}

mysqli_close($connection);
?>
