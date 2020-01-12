<?php
require_once dirname(__FILE__) . '/__config.php';

$sql = new mysqli(Configuration::MYSQL_HOST, Configuration::MYSQL_USER, Configuration::MYSQL_PASS, Configuration::MYSQL_DBNAME);

function closesql()
{
    global $sql;
    $sql->close();
}
?>