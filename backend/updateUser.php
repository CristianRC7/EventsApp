<?php
include 'conexion.php';
include 'cors.php';

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'];
$usuario = $data['usuario'];
$nombreCompleto = $data['nombre_completo'];
$contrasena = $data['contrasena'];

$sql = "UPDATE datos SET usuario = ?, nombre_completo = ?, contrasena = ? WHERE id = ?";
$stmt = $connection->prepare($sql);
$stmt->bind_param("sssi", $usuario, $nombreCompleto, $contrasena, $id);
$stmt->execute();

echo json_encode(["status" => $stmt->affected_rows > 0 ? "success" : "error"]);
?>
