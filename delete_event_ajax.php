<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'database.php';


$event_id=$_POST['event_id'];

//===========Delete userEvent table===========

$stmt = $mysqli->prepare("delete from userEvent where event_id=?");
if(!$stmt){
    printf("Query Prep Failed: %s\n", $mysqli->error);
    exit;
}
$stmt->bind_param('i', $event_id);
$stmt->execute();
$stmt->close();

//===========Delete from events table===========

$stmt = $mysqli->prepare("delete from events where event_id=?");
if(!$stmt){
    printf("Query Prep Failed: %s\n", $mysqli->error);
    exit;
}
$stmt->bind_param('i', $event_id);
$stmt->execute();
$stmt->close();

?>