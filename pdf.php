<?php

	$empleadoID = $_GET["data"];

	$url = "url=" . $empleadoID;
	$ch = curl_init();
 
    curl_setopt($ch,CURLOPT_URL,$url);
    curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
 
    $output=curl_exec($ch);

    $json = json_decode($output)->Data;

	$binary = base64_decode($json);

    file_put_contents('Comprobante_de_Nomina.pdf', $binary);
 
    curl_close($ch);

    

	header('Content-type: application/pdf');
	header('Content-Disposition: attachment; filename="Comprobante_de_Nomina.pdf"');

	echo $binary;
	

?>