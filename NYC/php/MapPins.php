<?
$doc = DOMDocument::load("MapPins.xml");
header('Content-type: text/xml');
echo $doc->saveXML();
?>