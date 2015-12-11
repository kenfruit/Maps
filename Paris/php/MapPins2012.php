<?
$doc = DOMDocument::load("MapPins2012.xml");
header('Content-type: text/xml');
echo $doc->saveXML();
?>