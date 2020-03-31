
<?php
require 'database.php';

 header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json
 $json_str = file_get_contents('php://input');
 $json_obj = json_decode($json_str, true);

$event_title = $json_obj['title'];
$date_begin = $json_obj['date_begin'];
$date_end = $json_obj['date_end'];
$time_begin = $json_obj['time_begin'];
$time_end = $json_obj['time_end'];
$description = $json_obj['description'];
$user_id = $json_obj['userid'];
$group = $json_obj['group'];

//========Insert event into event table=======
$stmt = $mysqli->prepare("insert into events(event_title, event_date_begin, event_date_end, event_time_begin, event_time_end, event_description,tag) values (?,?,?,?,?,?,?)");
$stmt->bind_param('sssssss', $event_title, $date_begin, $date_end, $time_begin, $time_end, $description, $group);
$stmt->execute();
// $result = $stmt->get_result();
$stmt->close();
$json_result = json_encode(array(
    "success" => true,
    "event_title" => $event_title,
    "date_begin" => $date_begin,
    "date_end" => $date_end,
    "time_begin" => $time_begin,
    "time_end" => $time_end,
    "description" => $description,
    "group"=>$group
));
echo $json_result;

//event id of most recently inserted event;
$event_id=$mysqli->insert_id;

//=========Insert event and users into userEvent table==============
$stmt = $mysqli->prepare("insert into userEvent(user_id, event_id) values (?,?)");
$stmt->bind_param('ss', $user_id,$event_id);
$stmt->execute();
$stmt->close(); 

//=========Insert event and shared  users into userEvent table==============
$shared_users = explode(',',$json_obj['shared_users']);
//if shared_users not empty

    foreach ($shared_users as $value){

        $stmt = $mysqli->prepare("select user_id from users where username=?");
        $stmt->bind_param('s', $value);
        $stmt->execute();
       // echo $stmt->fullQuery;
        $stmt->bind_result($shared_userid);
        $stmt->fetch();

        $stmt->close(); 

        $stmt = $mysqli->prepare("insert into userEvent(user_id, event_id) values (?,?)");
        $stmt->bind_param('ss', $shared_userid,$event_id);
        $stmt->execute();
        $stmt->close(); 
    }

exit;







// header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json
// $json_str = file_get_contents('php://input');
// $json_obj = json_decode($json_str, true);

// $event_title = $json_obj['title'];
// $date_begin = $json_obj['date_begin'];
// $date_end = $json_obj['date_end'];
// $time_begin = $json_obj['time_begin'];
// $time_end = $json_obj['time_end'];
// $description = $json_obj['description'];
// $user_id = $json_obj['userid'];
// $group = $json_obj['group'];

// $stmt = $mysqli->prepare("insert into events(event_title, event_date_begin, event_date_end, event_time_begin, event_time_end, event_description, user_id,tag) values (?,?,?,?,?,?,?,?)");
// if(!$stmt){
//     $sql_error = htmlspecialchars($mysqli->error);
// 	$json_result = json_encode(array(
//         "success" => false,
//         "message" => "failed to add event",
//         "sql" => $sql_error,
//         "event_title" => $event_title,
//         "date_begin" => $date_begin,
//         "date_end" => $date_end,
//         "time_begin" => $time_begin,
//         "time_end" => $time_end,
//         "description" => $description,
//         "user_id" => $user_id,
//         "group" => $group

//     ));
//     echo $json_result;
// 	exit;
// } else {
//     $stmt->bind_param('ssssssss', $event_title, $date_begin, $date_end, $time_begin, $time_end, $description, $user_id,$group);
//     $stmt->execute();
//     $stmt->close();
//     $json_result = json_encode(array(
//         "success" => true,
//         "event_title" => $event_title,
//         "date_begin" => $date_begin,
//         "date_end" => $date_end,
//         "time_begin" => $time_begin,
//         "time_end" => $time_end,
//         "description" => $description,
//         "user_id" => $user_id,
//         "group"=>$group
//     ));
//     echo $json_result;
//     exit;
// }

?>
