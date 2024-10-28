<?php
include 'conexion.php';
include 'cors.php';

$data = json_decode(file_get_contents("php://input"), true);
$usuario = $data['usuario'];
$nombreCompleto = $data['nombreCompleto'];
$contrasena = $data['contrasena'];

$sql = "SELECT id FROM datos WHERE usuario = ?";
$stmt = $connection->prepare($sql);
$stmt->bind_param("s", $usuario);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'El usuario ya está registrado.']);
} else {
    $insert_sql = "INSERT INTO datos (usuario, nombre_completo, contrasena) VALUES (?, ?, ?)";
    $insert_stmt = $connection->prepare($insert_sql);
    $insert_stmt->bind_param("sss", $usuario, $nombreCompleto, $contrasena);

    if ($insert_stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Usuario agregado correctamente']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al agregar el usuario.']);
    }
}
?>
