<?php
header('Content-Type: application/json');
include 'conexion.php';
include 'Cors.php';

$query = "
    SELECT e.id, e.descripcion, e.aula, e.expositor, e.fecha 
    FROM eventos e
    LEFT JOIN habilitacion_calificacion h ON e.id = h.id_evento
    WHERE h.id_evento IS NULL
";

$result = mysqli_query($connection, $query);

$events = [];
while ($row = mysqli_fetch_assoc($result)) {
    $events[] = $row;
}

echo json_encode($events);

mysqli_close($connection);
?>