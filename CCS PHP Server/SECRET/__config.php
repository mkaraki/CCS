<?php

class Configuration {
    
    // DB Config
    const MYSQL_HOST = '127.0.0.1';
    const MYSQL_USER = 'dev1';
    const MYSQL_PASS = 'dev1';
    const MYSQL_DBNAME = 'ccs_db';

    // Auto Delete
    const LOG_AUTOREMOVE_SEC = 259200; // 3days
    const ROOM_AUTOREMOVE_SEC = 604800; // 7days
    const USER_AUTOREMOVE_SEC = 604800; // 7days

}

?>