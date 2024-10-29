<?php
include('conexion.php');
require_once('library/vendor/tecnickcom/tcpdf/tcpdf.php');

if (isset($_GET['usuario']) && isset($_GET['nro_certificado'])) {
    $usuario = $_GET['usuario'];
    $nro_certificado = $_GET['nro_certificado'];
    $sql_info = "SELECT datos.nombre_completo, participacion.nro_certificado, gestion.gestion
                 FROM datos
                 INNER JOIN participacion ON datos.id = participacion.id_datos
                 INNER JOIN gestion ON participacion.id_gestion = gestion.id_gestion
                 WHERE datos.usuario = '$usuario' AND participacion.nro_certificado = '$nro_certificado'";

    $result_info = mysqli_query($connection, $sql_info);

    if ($result_info && mysqli_num_rows($result_info) > 0) {
        $row = mysqli_fetch_assoc($result_info);

        $nombreCompleto = $row['nombre_completo'];
        $nroCertificado = $row['nro_certificado'];
        $gestion = $row['gestion'];
        $pdf = new TCPDF('P', 'mm', 'A4', true, 'UTF-8', false);

        $pdf->setPrintHeader(false);
        $pdf->setPrintFooter(false);
        $pdf->SetMargins(0, 0, 0);
        $pdf->SetAutoPageBreak(false, 0);
        $pdf->AddPage();
        $imageFile = "certificados/gestion_$gestion.jpg"; 
        $pdf->Image($imageFile, 0, 0, $pdf->getPageWidth(), $pdf->getPageHeight(), '', '', '', false, 300, '', false, false, 0, false, false, false);

        $pdf->SetFont('helvetica', 'B', 26);

        if($gestion == 2022){
            $yNombre = 143;
        } elseif($gestion == 2024){
            $yNombre = 128;
        }else {
            $yNombre = 125; 
        }

        $xNombre = ($pdf->getPageWidth() - $pdf->getStringWidth($nombreCompleto)) / 2;
        
        $pdf->Text($xNombre, $yNombre, $nombreCompleto);
        $pdf->SetFont('helvetica', 'B', 14);

        $xNroCertificado = $pdf->getPageWidth() - 25;
        $yNroCertificado = $pdf->getPageHeight() - 10;
        $pdf->Text($xNroCertificado, $yNroCertificado, 'Nro* ' . $nroCertificado);

        $pdf->Output('certificado.pdf', 'D');
    } else {
        echo "Error al obtener información del estudiante: " . mysqli_error($connection);
    }
} else {
    echo 'Usuario o número de certificado no proporcionado';
}

mysqli_close($connection);
?>
