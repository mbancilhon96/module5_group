
<?php
require 'database.php';

        
    header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json
    $json_str = file_get_contents('php://input');
    $json_obj = json_decode($json_str, true);

    $username_attempt = $json_obj['username'];
    $password_attempt = $json_obj['password'];

    $stmt = $mysqli->prepare("select user_id, username, password, firstname, lastname from users where username=?");
    if(!$stmt){
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }
    $stmt->bind_param('s', $username_attempt);
    $stmt->execute();
    $stmt->bind_result($userid, $username, $pwd_hash, $first, $last);
    $stmt->fetch();
    
    if(password_verify($password_attempt, $pwd_hash)){
        session_start();
        $_SESSION['username'] = $username;
        $_SESSION['user_id'] = $userid;
        $_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32)); 

        $lifetime=600;
        //session_start();
        setcookie(session_name(),session_id(),time()+$lifetime);

        $json = json_encode(array(
            "success" => true,
            "userid" => $userid,
            "username" => $username, 
            "firstname" => $first,
            "lastname" => $last,
            "object" => $json_obj 
        ));
        echo $json;
        
        exit;
    }else{
        $json = json_encode(array(
            "success" => false,
            "message" => "Incorrect Username or Password",
        ));
        echo $json;
        exit;
    }
?>
