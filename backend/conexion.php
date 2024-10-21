<?php

    $sername = "localhost";
    $username = "root";
    $password = "";
    $database = "utepsa";
 
   

    $connection = mysqli_connect($sername, $username, $password, $database);

    if (!$connection) {
        die("Connection failed: " . mysqli_connect_error());
    } 
    
?>