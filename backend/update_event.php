<?php
include 'conexion.php';
include 'cors.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'];
$descripcion = $data['descripcion'];
$hora = $data['hora'];
$aula = $data['aula'];
$expositor = $data['expositor'];

$query = "UPDATE eventos SET descripcion = '$descripcion', hora = '$hora', aula = '$aula', expositor = '$expositor' WHERE id = $id";
$result = mysqli_query($connection, $query);

if ($result) {
    echo json_encode(array('success' => true));
} else {
    echo json_encode(array('success' => false, 'message' => 'Error al actualizar el evento'));
}

mysqli_close($connection);
?>
