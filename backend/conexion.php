<?php
    $host = "localhost";
    $user = "root";
    $password = "";
    $db = "eventsappdb";

    $conexion = new mysqli($host, $user, $pass, $db);

    if($conexion->connect_error){
        die("Error en la conexión: " . $conexion->connect_error);
    }
        
?>