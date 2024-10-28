<?php
include 'conexion.php';
include 'cors.php';

$search = $_GET['search'] ?? '';

$sql = "SELECT id, usuario, nombre_completo FROM datos WHERE usuario LIKE ? OR nombre_completo LIKE ?";
$stmt = $connection->prepare($sql);
$searchTerm = "%{$search}%";
$stmt->bind_param("ss", $searchTerm, $searchTerm);
$stmt->execute();
$result = $stmt->get_result();

$users = [];
while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}

header('Content-Type: application/json');
echo json_encode($users);
?>
