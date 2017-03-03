<?php

header("Access-Control-Allow-Origin: *");

include 'simple_html_dom.php';

function download($href) {
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);
    curl_setopt($curl, CURLOPT_HEADER, false);
    curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($curl, CURLOPT_URL, $href);
    curl_setopt($curl, CURLOPT_REFERER, $href);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($curl, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/533.4 (KHTML, like Gecko) Chrome/5.0.375.125 Safari/533.4");
    $str = curl_exec($curl);
    curl_close($curl);

    $dom = new simple_html_dom();

    $dom->load($str, true, false);

    return $dom;
}

$data = download('https://trakt.tv/users/' . ($_GET['user'] ?: 'russiandaddy') . '/watchlist');

$items = array();
$currentYear = intval(date("Y"));
$previousYear = strval($currentYear - 1);
$currentYear = strval($currentYear);
$targetType = 'movie';

function starts_with($str, $substr)
{
     $length = strlen($substr);
     return substr($str, 0, $length) === $substr;
}

foreach($data->find('.grid-item') as $element)
{
	$title = $element->find('a.titles-link div.titles h3', 0)->innertext;
	$poster = $element->find('a div.poster img.real', 0)->getAttribute('data-original') . '.webp';
	$released = $element->getAttribute('data-released');
	$type = $element->getAttribute('data-type');

	if($type === $targetType && starts_with($released, $previousYear) || starts_with($released, $currentYear)) {
		$items[] = array('title' => $title, 'poster' => $poster);
	}
}

echo json_encode($items);

?>