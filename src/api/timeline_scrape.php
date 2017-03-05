<?php

header("Access-Control-Allow-Origin: *");

include 'simple_html_dom.php';

$targetLink = $_GET['target'];
$html = file_get_html($targetLink);

$scheduleData = str_replace('var scheduleData = ', '', $html->find('script', 3)->innertext);
$json = substr($scheduleData, 0, strlen($scheduleData) - 1);
$schedules = json_decode($json, true);

$targetTimeslots = array('19:00', '19:30', '21:00', '22:00', '22:15');

foreach($schedules as $schedule) {
	$name = $schedule['name'];
	
	if(strpos($name, 'vrijdag') !== false ||  strpos($name, 'zaterdag') !== false || strpos($name, 'maandag') !== false) {
		$link = get_optimized_checkout_link($schedule, $targetTimeslots);
		echo $link ? create_reservation_link($link) : $targetLink;
		return;
	}
}

function get_optimized_checkout_link($schedule, $target) {
	$timeslots = array_reverse($schedule['timeslots']);
	$length = count($timeslots);
	
	for ($i = 0; $i < $length; $i++) {
		foreach($target as $targetSlot) {
			if($timeslots[$i] === $targetSlot) {
				return $schedule['links'][$length - $i - 1];
			}
		}
	}
}

function create_reservation_link($url) {
	$end = end(explode('/', $url));
	return "http://tilburg.euroscoop.nl/Reservation.asp?WCI=templateLogin&WCE=&Vorst={$end}&JAVA=true";
}