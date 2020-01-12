<?php
require_once dirname(__FILE__) . '/SECRET/sqlinit.php';
header('Access-Control-Allow-Origin: *');

$rid = intval($_GET['room']);
$from = intval($_GET['from']);

$rooms = $sql->query('SELECT * FROM Rooms WHERE id=' . $rid);

if ($rooms->num_rows != 1) {
    die("NG");
}

$obj = [];

if ($res = $sql->query("SELECT * FROM ChatLog WHERE id > $from AND room = $rid")) {
    while ($i = $res->fetch_assoc()) {
        $obj[] = array(
            "id"=> $i['id'],
            "user"=> $i['user'],
            "message"=> base64_decode($i['message']),
            "time"=> $i['senttime'],
        );
    }

    $res->close();
}

closesql();

echo json_encode($obj);
?>