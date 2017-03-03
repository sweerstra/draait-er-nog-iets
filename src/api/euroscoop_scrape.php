<?php

header("Access-Control-Allow-Origin: *");

include 'simple_html_dom.php';

$currentHTML = file_get_html('https://www.euroscoop.nl/tilburg/films/');

$current = array_map(function($val) {
	return $val->innertext;
}, $currentHTML->find('.titleMobile'));

$expectingHTML = file_get_html('https://www.euroscoop.nl/tilburg/films/wordt-verwacht/');

$expecting = array_map(function($val) {
	$title = $val->find('.titleMobile', 0)->innertext;
	$date = $val->find('.desc .expected', 0)->innertext;
	return array('title' => $title, 'release' => $date);
}, $expectingHTML->find('.instafilta-target'));
		   
echo json_encode(array('current' => $current, 'expecting' => $expecting));

?>