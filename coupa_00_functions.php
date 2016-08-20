<?php
function sanitize_string($var){
    if(get_magic_quotes_gpc()){
        $var = stripslashes($var);
    }
    $var = htmlentities($var);
    $var = strip_tags($var);
    return $var;
}

function sanitize_mysql($var){
    $var = mysql_real_escape_string($var);
    $var = sanitze_string($var);
    return $var;
}

function get_user_type($user){
	//Connect to the coupa database.
	require('coupa_mysqli_connect.php');
	
	//Sanitize the user input.
	$user = sanitize_string($user);
	//Create a variable to store the user type.
	$user_type = 'guest';
	//Get the info for the item scanned.
	$q = 'SELECT userType
		  FROM users
		  WHERE userName = "' . $user . '"';
	//Run the query.
	$r = mysqli_query($dbc, $q);
	//If it runs okay, display the records.
	if($r){
		//Fetch the record.
		$row = mysqli_fetch_array($r, MYSQLI_ASSOC);
		//If the user is found, save the value.
		if(isset($row['userType']) && $row['userType'] != ''){
			$user_type = $row['userType'];
		}
	}
	else{
		echo mysqli_error($dbc) . '<br>Query: ' . $q . '<br>';
		echo '<br>There was a problem finding what you requested.<br>';
	}
	return $user_type;
}
?>