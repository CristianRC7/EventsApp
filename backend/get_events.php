<?php
include 'conexion.php';
include 'cors.php';

header('Content-Type: application/json');

$date = $_GET['fecha'];

$query = "SELECT id, DATE_FORMAT(hora, '%H:%i') as hora, descripcion, aula, expositor FROM eventos WHERE fecha = '$date'";
$result = mysqli_query($connection, $query);

if (mysqli_num_rows($result) > 0) {
    $events = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $events[] = $row;
    }
    echo json_encode(array('success' => true, 'events' => $events));
} else {
    echo json_encode(array('success' => false, 'message' => 'No hay eventos para esta fecha'));
}

mysqli_close($connection);
?>
