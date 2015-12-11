<?
$doc = DOMDocument::load("SubwayEntrances-13.xml");
header('Content-type: text/xml');
echo $doc->saveXML();
?>