<?php
include 'conexion.php';
include 'cors.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if(isset($data['usuario'])) {
    $usuario = $data['usuario'];

    $query = "SELECT participacion.nro_certificado, gestion.gestion 
              FROM participacion 
              INNER JOIN datos ON participacion.id_datos = datos.id 
              INNER JOIN gestion ON participacion.id_gestion = gestion.id_gestion
              WHERE datos.usuario='$usuario'";
    $result = mysqli_query($connection, $query);

    if(mysqli_num_rows($result) > 0){
        $certificados = [];
        while($row = mysqli_fetch_assoc($result)) {
            $certificados[] = $row;
        }
        echo json_encode(array('success' => true, 'certificados' => $certificados));
    } else {
        echo json_encode(array('success' => true, 'message' => 'Sin certificados registrados'));
    }
    
} else {
    echo json_encode(array('success' => false, 'message' => 'Missing parameters'));
}

mysqli_close($connection);
?>
