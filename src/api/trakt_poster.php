<?php

header("Access-Control-Allow-Origin: *");
include 'simple_html_dom.php';

$html = file_get_html($_GET['target']);

echo json_encode($html ? $html->find('#info-wrapper .poster img.real', 0)->getAttribute('data-original') . '.webp' : null);