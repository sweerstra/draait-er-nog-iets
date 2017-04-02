<?php

header("Access-Control-Allow-Origin: *");
include 'curl_html.php';
include 'curl.php';

$traktData = download_html('https://trakt.tv/users/russiandaddy/lists/anticipated');
$suggestions = json_decode(get('https://draait-er-nog-iets.firebaseio.com/suggestions.json'), true);
$suggestionData = array();
$items = array();

foreach ($suggestions as $key => $value) {
    $suggestionData[] = array('title' => $value['title'], 'poster' => $value['poster']);
}

foreach($traktData->find('.grid-item') as $element)
{
	$title = $element->find('a.titles-link div.titles h3', 0)->innertext;
	$poster = $element->find('a div.poster img.real', 0)->getAttribute('data-original') . '.webp';

	$items[] = array('title' => $title, 'poster' => $poster);
}

echo json_encode(array_merge($items, $suggestionData));

