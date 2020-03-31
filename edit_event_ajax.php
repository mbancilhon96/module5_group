<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'database.php';

$user_id=$_POST['user_id'];

$event_id=$_POST['event_id'];
$event_title=$_POST['title-edit'];
$event_date=$_POST['date-edit'];
$event_start=$_POST['start-edit'];
$event_end=$_POST['end-edit'];
$event_description=$_POST['description-edit'];


$stmt = $mysqli->prepare("update events set event_title='$event_title', event_date_begin='$event_date',event_time_begin='$event_start',event_time_end='$event_end',event_description='$event_description' where event_id=? ");
if(!$stmt){
    printf("Query Prep Failed: %s\n", $mysqli->error);
    exit;
}
$stmt->bind_param('s', $event_id);
$stmt->execute();
$stmt->fetch();
$stmt->close();
echo "test";

?>