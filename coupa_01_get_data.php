<?php
//Connect to the coupa database.
require('coupa_mysqli_connect.php');
//Include coupa php functions.
include('coupa_00_functions.php');

if($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['med_id'])){
	//Sanitize the user input.
	$med_id = sanitize_string($_POST['med_id']);
	//Get the info for the item scanned.
	$q = "SELECT *
		  FROM inventory
		  WHERE MedId = " . $med_id;
	//Run the query.
	$r = mysqli_query($dbc, $q);
	//If it runs okay, display the records.
	if($r){
		//Fetch the record.
		while($row = mysqli_fetch_array($r, MYSQLI_ASSOC)){
			echo json_encode($row);
		}		
	}
	else{
		echo mysqli_error($dbc) . '<br>Query: ' . $q . '<br>';
		echo '<br>There was a problem finding what you requested.<br>';
	}
}
?>