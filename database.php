<?php
// Content of database.php

$mysqli = new mysqli('localhost', 'mel_news2', 'password', 'calendar');

if($mysqli->connect_errno) {
	printf("Connection Failed: %s\n", $mysqli->connect_error);
	exit;
}
?>
