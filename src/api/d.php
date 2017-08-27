<?php

header("Access-Control-Allow-Origin: *");

include 'simple_html_dom.php';

$url = transformToCommentsUrl($_GET['target']);
$html = file_get_html($url);
$comments = array();

foreach ($html->find('article.comment') as $comment) {
    $kudos = $comment->getAttribute('data-kudos');

    if (intval($kudos) > 0) {
        if ($comment->find('a', 0)->innertext !== '+') {
            echo $comment;
        }
    }
}

function transformToCommentsUrl($url)
{
    $split = explode('/', $url);

    return 'https://comments.dumpert.nl/embed/' . $split[4] . '/' . $split[5] . '/comments/';
}