<?php
require_once dirname(__FILE__) . '/SECRET/sqlinit.php';
header('Access-Control-Allow-Origin: *');

$uid = intval($_GET['user']);
// $uid = 1;
$res = $sql->query('SELECT checkc FROM Users WHERE id = ' . $uid . ' LIMIT 1');

$checkc = $res->fetch_object()->checkc;

closesql();

echo $checkc;
?>