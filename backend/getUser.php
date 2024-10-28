<?php
include 'conexion.php';
include 'cors.php';

$id = $_GET['id'];

$sql = "SELECT usuario, nombre_completo, contrasena FROM datos WHERE id = ?";
$stmt = $connection->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

$user = $result->fetch_assoc();

header('Content-Type: application/json');
echo json_encode($user);
?>
