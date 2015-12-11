<?
$doc = DOMDocument::load("MetroStations.xml");
header('Content-type: text/xml');
echo $doc->saveXML();
?>