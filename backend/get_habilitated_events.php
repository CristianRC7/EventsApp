<?php
include 'conexion.php';
include 'cors.php';

header('Content-Type: application/json');

$query = "SELECT eventos.id, eventos.descripcion 
          FROM habilitacion_calificacion 
          JOIN eventos ON habilitacion_calificacion.id_evento = eventos.id";

$result = mysqli_query($connection, $query);

if(!$result) {
    echo json_encode(array('success' => false, 'message' => 'Error al obtener eventos', 'error' => mysqli_error($connection)));
} else {
    $eventos = array();
    while($row = mysqli_fetch_assoc($result)) {
        $eventos[] = $row;
    }
    echo json_encode($eventos);
}

mysqli_close($connection);
?>
