<?php
//Start a session to save/get data.
session_start();
//Include coupa php functions.
include('coupa_00_functions.php');
//Create a variable to store the user_type passed to this page.
$user_type = 'guest';
if($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['login'])){
	$user_type = get_user_type($_POST['login']);
	//Save the local variable to the Session array.
	$_SESSION['user_type'] = $user_type;
}
elseif(isset($_SESSION['user_type'])){
	$user_type = $_SESSION['user_type'];	
}
echo'
<!DOCTYPE html>
<html lang="en-US">
<head>
	<title>Coupa Order Form</title>
	<meta charset="utf-8" />
	<link type="text/css" href="css/style.css" rel="stylesheet" media="screen" />
	<link type="text/css" href="css/style_print.css" rel="stylesheet" media="print" />
</head>
<header>
	<div class="container_01">
		<div class="header_center">
			<button class="logo" type="submit" onclick="window.location.href=\'coupa_00_order.php\'"></button>
		</div>
	</div>
	<div class="container_02">
		<nav class="navbar"">
			<form id="form_navbar" method="POST" action="coupa_01_login.php">';
if($user_type == 'guest'){
	echo'
				<button id="btn_login" name="login" type="submit">Log in</button>';
}
else{
	if($user_type == 'admin'){
		echo'
				<button id="btn_admin" name="admin" type="submit">Admin</button>';
	}
	echo'
				<button id="btn_logout" name="logout" type="submit">Log out</button>';
}
echo'
			</form>
		</nav>
	</div>
</header>';
?>