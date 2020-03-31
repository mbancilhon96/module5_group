<?php
require 'database.php';

$user_id=$_POST['user_id'];
$event_type=$_POST['event_type'];

//get event from userEvent table
$stmt = $mysqli->prepare("select event_id from userEvent where user_id=?");
if(!$stmt){
    $sql_error = htmlspecialchars($mysqli->error);
    $json_result = json_encode(array(
        "success" => false,
        "message" => "1failed to get event",
        "sql" => $sql_error
    ));
    echo $json_result;
    exit;
} else {

        $stmt->bind_param('i', $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        while ($data = $result->fetch_assoc())
        {
            $events[] = $data;
        }
        $stmt->close();
        function getId($anEvent) {
            return $anEvent['event_id'];
        }
        $event_ids = array_map("getId", $events);
        $event_ids_string = implode(',', array_fill(0, count($event_ids), '?'));
        $bindStr = str_repeat('i', count($event_ids));

    //get event details from event table
    $stmt = $mysqli->prepare("select event_id,event_title, event_date_begin, event_date_end, event_time_begin, event_time_end, event_description from events where event_id IN (" . $event_ids_string .") and tag='".$event_type."'");
    if(!$stmt){
        $sql_error = htmlspecialchars($mysqli->error);
        $json_result = json_encode(array(
            "success" => false,
            "message" => "2failed to get event",
            "sql" => $sql_error
        ));
        echo $json_result;
        exit;
    } else {
        //$stmt->bind_param('i', $event_id);
        $stmt -> bind_param($bindStr, ...$event_ids);
        $stmt->execute();
        $stmt->bind_result($event_id,$event_title, $date_begin, $date_end, $time_begin, $time_end, $description);

        $json_obj_array = array();
        while($stmt->fetch()) {
            $tester = array(
                "success" => true,
                "event_id" => $event_id,
                "event_title" => $event_title,
                "date_begin" => $date_begin,
                "date_end" => $date_end,
                "time_begin" => $time_begin,
                "time_end" => $time_end,
                "description" => $description,
                "user_id" => $userid
            );
            $json_obj_array[] = $tester;
        }
        echo json_encode($json_obj_array);
        exit;  
    }
}


// $stmt = $mysqli->prepare("select event_id from events where tag=?");
// if(!$stmt){
//     $sql_error = htmlspecialchars($mysqli->error);
//     $json_result = json_encode(array(
//         "success" => false,
//         "message" => "failed to get event",
//         "sql" => $sql_error
//     ));
//     echo $json_result;
//     exit;
// } else {
//     $stmt->bind_param('s', $event_type);
//     $stmt->execute();
//     $stmt->bind_result($event_id);
//     $json_obj_array = array();
//     while($stmt->fetch()) {
//         $tester = array(
//             "success" => true,
//             "event_id" => $event_id
//         );
//         $json_obj_array[] = $tester;
//     }
//     echo json_encode($json_obj_array);
//     exit;    
// }

?>