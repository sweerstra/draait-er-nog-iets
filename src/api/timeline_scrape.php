<?php

header("Access-Control-Allow-Origin: *");

include 'simple_html_dom.php';

$targetLink = $_GET['target'];
$html = file_get_html($targetLink);

$scheduleData = str_replace('var scheduleData = ', '', $html->find('script', 3)->innertext);
$json = substr($scheduleData, 0, strlen($scheduleData) - 1);
$schedules = json_decode($json, true);

$minTargetTime = 1900;

foreach($schedules as $schedule) {
	$name = $schedule['name'];
	
	if(strpos($name, 'vrijdag') !== false ||  strpos($name, 'zaterdag') !== false || strpos($name, 'maandag') !== false) {
		$link = get_optimized_checkout_link($schedule, $minTargetTime);
		echo $link ? create_reservation_link($link) : $targetLink;
		return;
	}
}

function get_optimized_checkout_link($schedule, $minTime) {
	$timeslots = array_reverse($schedule['timeslots']);
	$length = count($timeslots);
	
	for ($i = 0; $i < $length; $i++) {
		$timeAsInt = intval(str_replace(':', '', $timeslots[$i]));
		
		if($timeAsInt > $minTime)
			return $schedule['links'][$length - $i - 1];
		}
	}
}

function create_reservation_link($url) {
	$end = end(explode('/', $url));
	return "http://tilburg.euroscoop.nl/Reservation.asp?WCI=templateLogin&WCE=&Vorst={$end}&JAVA=true";
}