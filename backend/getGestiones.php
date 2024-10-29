<?php
include 'conexion.php';
include 'cors.php';

$sql = "SELECT id_gestion, gestion FROM gestion";
$result = $connection->query($sql);

$gestiones = [];
while ($row = $result->fetch_assoc()) {
    $gestiones[] = $row;
}

header('Content-Type: application/json');
echo json_encode($gestiones);
?>
