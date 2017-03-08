<?php

header("Access-Control-Allow-Origin: *");

include 'curl_html.php';

$html = download_html('http://cinecitta.nl/');
$list = $html->find('ul.overzicht li');
$arr = array();

foreach($list as $val) {
	$time = intval(str_replace(':', '', substr($val->find('span.datum', 0)->innertext, -5)));
	$title = $val->find('span.title', 0)->innertext;
	$link = $val->find('a', 0)->href;
	
	if ($time > 2000) {
		$arr[] = array('title' => $title, 'link' => $link);
	}
}

echo json_encode($arr);