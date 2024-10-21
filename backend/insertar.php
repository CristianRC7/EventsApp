<?php
include 'conexion.php';
include 'cors.php';

$message = '';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $hora = $_POST['hora'];
    $descripcion = $_POST['descripcion'];
    $aula = $_POST['aula'];
    $expositor = $_POST['expositor'];
    $fecha = $_POST['fecha'];

    $query = "INSERT INTO eventos (hora, descripcion, aula, expositor, fecha) VALUES ('$hora', '$descripcion', '$aula', '$expositor', '$fecha')";
    
    if (mysqli_query($connection, $query)) {
        $message = json_encode(array('success' => true, 'message' => 'Evento insertado correctamente'));
    } else {
        $message = json_encode(array('success' => false, 'message' => 'Error al insertar evento: ' . mysqli_error($connection)));
    }
}

mysqli_close($connection);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Insertar Evento</title>
</head>
<body>
    <h1>Insertar Nuevo Evento</h1>
    <?php if (!empty($message)): ?>
        <p><?php echo $message; ?></p>
    <?php endif; ?>
    <form action="insertar.php" method="post">
        <label for="hora">Hora:</label><br>
        <input type="time" id="hora" name="hora" required><br>
        <label for="descripcion">Descripción:</label><br>
        <textarea id="descripcion" name="descripcion" rows="4" cols="50" required></textarea><br>
        <label for="aula">Aula:</label><br>
        <input type="text" id="aula" name="aula" required><br>
        <label for="expositor">Expositor:</label><br>
        <input type="text" id="expositor" name="expositor" required><br>
        <label for="fecha">Fecha:</label><br>
        <input type="date" id="fecha" name="fecha" required><br><br>
        <input type="submit" value="Insertar Evento">
    </form>
</body>
</html>
