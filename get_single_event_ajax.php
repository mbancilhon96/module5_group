
<?php
require 'database.php';

        
    header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json
    $json_str = file_get_contents('php://input');
    $json_obj = json_decode($json_str, true);

    $eventid = $json_obj['eventid'];

    $stmt = $mysqli->prepare("select event_id, event_title, event_date_begin, event_date_end, event_time_begin, event_time_end, event_description from events where event_id=?");
    if(!$stmt){
        $sql_error = htmlspecialchars($mysqli->error);
        $json_result = json_encode(array(
            "success" => false,
            "message" => "failed to get event",
            "sql" => $sql_error
        ));
        echo $json_result;
        exit;
    } else {
        $stmt->bind_param('i', $eventid);
        $stmt->execute();
        $stmt->bind_result($event_id, $event_title, $date_begin, $date_end, $time_begin, $time_end, $description);
        $stmt->fetch();
        $json_response = json_encode(array(
            "success" => true,
            "event_id" => $event_id,
            "event_title" => $event_title,
            "date_begin" => $date_begin,
            "date_end" => $date_end,
            "time_begin" => $time_begin,
            "time_end" => $time_end,
            "description" => $description
        ));
        echo $json_response;
        exit;    
    }
   
?>
