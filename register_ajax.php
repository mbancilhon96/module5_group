
<?php
require 'database.php';

    
//header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json
$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

$username_register = $json_obj['username'];
$email_register = $json_obj['email'];
$firstname_register = $json_obj['firstname'];
$lastname_register = $json_obj['lastname'];
$password_register = $json_obj['password'];
$password_hash = password_hash($password_register, PASSWORD_BCRYPT);

$stmt = $mysqli->prepare("insert into users(username, firstname, lastname, email, password) values (?,?,?,?,?)");
if(!$stmt){
	$json = json_encode(array(
        "success" => false,
        "message" => "failed to register"
    ));
    echo $json;
	exit;
} else {
    $stmt->bind_param('sssss', $username_register, $firstname_register, $lastname_register, $email_register, $password_hash);
    $stmt->execute();
    $stmt->close();

    echo json_encode(array(
        "success" => true,
        "firstname" => $firstname_register
    ));
}

?>
