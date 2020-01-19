<?php
require_once dirname(__FILE__) . '/SECRET/sqlinit.php';
header('Access-Control-Allow-Origin: *');
header("Content-type: text/plain; charset=utf-8");

$rid = intval($_GET['room']);
// $rid = 1;
$res = $sql->query('SELECT checkc FROM Rooms WHERE id = ' . $rid . ' LIMIT 1');

$checkc = $res->fetch_object()->checkc;

closesql();

echo $checkc;
?>