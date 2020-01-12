<?php
require_once dirname(__FILE__) . '/SECRET/sqlinit.php';
header('Access-Control-Allow-Origin: *');

$uid = intval($_GET['user']);
$rid = intval($_GET['room']);
$msg = base64_encode($_GET['msg']);

$users = $sql->query('SELECT * FROM Users WHERE id=' . $uid);
$rooms = $sql->query('SELECT * FROM Rooms WHERE id=' . $rid);

if ($users->num_rows != 1 || $rooms->num_rows != 1) {
    die("NG");
}

$id = time() . $rid . $uid . rand(1, 9999);

$sql->query("INSERT INTO ChatLog VALUES ($id, $rid, $uid, '$msg', UNIX_TIMESTAMP())");

closesql();

echo "OK";
?>