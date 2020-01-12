<?php
require_once dirname(__FILE__) . '/__config.php';
require_once dirname(__FILE__) . '/sqlinit.php';

$sql->query('DELETE FROM ChatLog WHERE senttime < UNIX_TIMESTAMP() - ' . Configuration::LOG_AUTOREMOVE_SEC);
$sql->query('DELETE FROM Rooms WHERE lastjoin < UNIX_TIMESTAMP() - ' . Configuration::ROOM_AUTOREMOVE_SEC);
$sql->query('DELETE FROM Users WHERE lastlogin < UNIX_TIMESTAMP() - ' . Configuration::USER_AUTOREMOVE_SEC);

closesql();

?>