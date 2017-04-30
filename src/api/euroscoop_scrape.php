<?php

header("Access-Control-Allow-Origin: *");

include 'simple_html_dom.php';

$currentHTML = file_get_html('https://www.euroscoop.nl/tilburg/films/');
$current = array();

foreach ($currentHTML->find('.instafilta-target') as $val) {
    $title = $val->find('.titleMobile', 0)->innertext;
    $link = "https://www.euroscoop.nl" . $val->find('a', 0)->href;

    $current[] = array('title' => $title, 'link' => $link);
}

$expectingHTML = file_get_html('https://www.euroscoop.nl/tilburg/films/wordt-verwacht/');

$expecting = array_map(function ($val) {
    $title = $val->find('.titleMobile', 0)->innertext;
    $date = $val->find('.desc .expected', 0)->innertext;
    $link = "https://www.euroscoop.nl" . $val->find('a', 0)->href;
    return array('title' => $title, 'release' => $date, 'link' => $link);
}, $expectingHTML->find('.instafilta-target'));

echo json_encode(array('current' => $current, 'expecting' => $expecting));

?>