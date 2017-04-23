<?php

header("Access-Control-Allow-Origin: *");

include 'simple_html_dom.php';

function print_response($schedules, $minTime) {
    foreach ($schedules as $schedule) {
        $name = $schedule['name'];

        if (strpos($name, 'vrijdag') !== false || strpos($name, 'zaterdag') !== false || strpos($name, 'maandag') !== false) {
            $link = get_optimized_checkout_link($schedule, $minTime);
            echo create_reservation_link($link);
            return;
        }
    }

    echo 'null';
}

function get_optimized_checkout_link($schedule, $minTime)
{
    $timeslots = array_reverse($schedule['timeslots']);
    $length = count($timeslots);

    for ($i = 0; $i < $length; $i++) {
        $timeAsInt = intval(str_replace(':', '', $timeslots[$i]));

        if ($timeAsInt > $minTime) {
            return $schedule['links'][$length - $i - 1];
        }
    }

    return null;
}

function create_reservation_link($url)
{
    if (!$url) return '';
    $end = end(explode('/', $url));
    return "http://tilburg.euroscoop.nl/Reservation.asp?WCI=templateLogin&WCE=&Vorst={$end}&JAVA=true";
}

function get_schedule_script($html)
{
    foreach ($html->find('script') as $script) {
        $text = $script->innertext;
        if (strpos($text, 'scheduleData') !== false) {
            return $text;
        }
    }

    return null;
}

$scheduleData = str_replace('var scheduleData = ', '', get_schedule_script(file_get_html($_GET['target'])));
$json = substr($scheduleData, 0, strlen($scheduleData) - 1);

print_response(json_decode($json, true), 1900);