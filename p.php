<?php

$location = $_GET['url'];

if ($_SERVER['REQUEST_METHOD'] == 'POST'){
	
	echo url_get_contents($location, $_POST, 'POST') ;
	exit();

}else{

	echo url_get_contents($location) ;
	exit();

}

function url_get_contents($url, $params = null, $method = 'GET') {
    $contents = false;
    if (!in_array($method, array('GET', 'POST'))) {
        error_log(__FUNCTION__ . ": Unknown method '$method'");
        return false;
    }
    if ($method == 'GET') {
        if (is_array($params) && count($params) > 0) {
            if ($params === array_values($params)) {
                error_log(__FUNCTION__ . ": Numerical array recieved for argument '\$params' (assoc array expected)");
                return false;
            }
            else {
                $url .= '?' . http_build_query($params);
            }
        }
        elseif (!is_null($params)) {
            error_log(__FUNCTION__ . ": If you're making a GET request, argument \$params must be null or assoc array.");
            return false;
        }
    }
    $ch = curl_init($url);
    if ($ch !== false) {
        curl_setopt_array($ch, array(
            CURLOPT_HEADER => false,
            CURLOPT_RETURNTRANSFER => true,
        ));
        if ($method == 'POST') {
            curl_setopt($ch, CURLOPT_POST, true);
            if (is_string($params) || is_array($params)) {
                curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
            }
            else {
                error_log(__FUNCTION__ . ": Argument \$params should be an array of parameters or (if you want to send raw data) a string");
                return false;
            }
        }
        $contents = curl_exec($ch);
        curl_close($ch);
    }
    return $contents;
}