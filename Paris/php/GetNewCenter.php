<?php
	$address = $_GET['address'];

	$searchString = $address;
	str_replace(",", "", $searchString);
	str_replace(" ", "+", $searchString);
	$searchString2 = urlencode($searchString);
	$url = "http://maps.googleapis.com/maps/api/geocode/json?address=".$searchString2."&sensor=false";

	$ch = curl_init();
 
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_HEADER,0); //Change this to a 1 to return headers
	curl_setopt($ch, CURLOPT_USERAGENT, $_SERVER["HTTP_USER_AGENT"]);
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	
	$data = curl_exec($ch);
	//Print("$data");
	$json_a=json_decode($data,true);
	curl_close($ch);
	$formatted_address = $json_a['results'][0]['formatted_address'];

	$lat =  $json_a['results'][0]['geometry']['location']['lat'];
	$lng =  $json_a['results'][0]['geometry']['location']['lng'];
	header('Content-type: text/xml');
	echo '<newcenter><coordinates lat="'.$lat.'" lon="'.$lng.'"/></newcenter>';
?>
