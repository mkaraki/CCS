<?php
require_once dirname(__FILE__) . '/SECRET/sqlinit.php';
header('Access-Control-Allow-Origin: *');
header("Content-type: text/plain; charset=utf-8");

$uid = intval($_POST['user']);
$rid = intval($_POST['room']);
$msg = $_POST['msg'];

if (!preg_match("/^[A-Za-z0-9+\/=]+$/", $msg))
{
    die("NG");
}

$users = $sql->query('SELECT * FROM Users WHERE id=' . $uid);
$rooms = $sql->query('SELECT * FROM Rooms WHERE id=' . $rid);

if ($users->num_rows != 1 || $rooms->num_rows != 1) {
    die("NG");
}

$id = $rid . $uid . time() . rand(1, 10);

$sql->query("INSERT INTO ChatLog VALUES ($id, $rid, $uid, '$msg', UNIX_TIMESTAMP())");

closesql();

echo "OK";
?>