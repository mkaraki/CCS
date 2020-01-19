<?php
require_once dirname(__FILE__) . '/SECRET/sqlinit.php';
header('Access-Control-Allow-Origin: *');
header("Content-type: text/plain; charset=utf-8");

$uid = intval($_GET['user']);
// $uid = 1;
$res = $sql->query('SELECT checkc FROM Users WHERE id = ' . $uid . ' LIMIT 1');

$checkc = $res->fetch_object()->checkc;

closesql();

echo $checkc;
?>