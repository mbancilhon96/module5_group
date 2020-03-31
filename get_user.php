<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();

echo json_encode(array(
    "success" => !!$_SESSION['username'],
    "username" => $_SESSION['username'],
    "userid" => $_SESSION['user_id']
))
   
?>
