<?php

header("Access-Control-Allow-Origin: *");
include 'simple_html_dom.php';

function transform_name($str) {
    return str_replace(' ', '_', str_replace(':', '', $str));
}

$rt = 'https://www.rottentomatoes.com/m/';
$html = file_get_html($rt . transform_name($_GET['title']));
$scorePanel = $html->find('#scorePanel', 0);

$critic = $scorePanel->find('.critic-score span.meter-value span', 0)->innertext;
$audience = $scorePanel->find('.audience-score div.meter-value span', 0)->innertext;

echo $critic
    ? json_encode(array('score' => array('critic' => $critic, 'audience' => str_replace('%', '', $audience))))
    : 'null';