<?php
include('coupa_00_header.php');
//Connect to the coupa database.
require('coupa_mysqli_connect.php');

//Create variables used for sorting the table.
$mainSort = '';
$order = '';
if($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['mainSort'])){
	//Set the variable depending on which heading was clicked
	$mainSort = $_GET['mainSort'];
	$order = $_GET['order'];
}
else{
	//Default sort.
	$mainSort = 'MedDescription';
	$order = 'ASC';
}
//Check to see if changes have been submitted.
if($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['inv_array'])){
	//Cycle through the POST data to see what has been changed.
	for($j = 0; $j < count($_POST['inv_array']); $j++){
		//Get all the cells that have been changed in the current row.
		$update_array = array_diff_assoc($_POST['inv_array'][$j], $_SESSION['inv_array'][$j]);
		//Update the database if there are changes.
		if(count($update_array) > 0){
			//Create an update statement.
			$q = 'UPDATE inventory SET ';
			//Add the sanitized values to the statement..
			foreach($update_array as $key => $value){
				$q = $q . $key . '="' . sanitize_string($value) . '",';
			}
			//Complete the statement.
			$q = rtrim($q, ',') . ' WHERE MedId="' . sanitize_string($_POST['inv_array'][$j]['MedId']) . '"';
			//Run the query.
			$r = mysqli_query($dbc, $q);
			if(!$r){
				echo mysqli_error($dbc) . '<br>Query: ' . $q . '<br>';
				echo '<br>There was a problem finding what you requested.<br>';
			}
		}
	}
}
//Display the items in the database.
$q = 'SELECT *
	  FROM inventory
	  ORDER BY '. $mainSort .' '. $order .'
	  LIMIT 100';
//Change the order for the next sort.
if($order == 'ASC'){
	$order = 'DESC';
}
else{
	$order = 'ASC';
}
//Run the query.
$r = mysqli_query($dbc, $q);
//If it runs okay, display the records.
if($r){
	//Create and array to store the results.
	$inv_array = array();
	//Create a counter.
	$counter = 0;
	//Fetch the records.
	while($row = mysqli_fetch_array($r, MYSQLI_ASSOC)){
		$inv_array[$counter] = $row;
		$counter++;
	}
	//Save the data in the Session.
	$_SESSION['inv_array'] = $inv_array;
}
else{
	echo mysqli_error($dbc) . '<br>Query: ' . $q . '<br>';
	echo '<br>There was a problem finding what you requested.<br>';
}
echo'
<body>
	<div class="container_03">
		<div class="body_center">
			<form id="form_admin" method="POST" action="coupa_03_admin.php">
				<input class="submit_admin" type="submit" value="Submit" />
				<table id="order_table" border="1">
					<thead>
						<tr>
							<th><a href="/coupa_03_admin.php?mainSort=MedId&order='. $order .'">MedId</a></th>
							<th><a href="/coupa_03_admin.php?mainSort=MedDescription&order='. $order .'">MedDescription</a></th>
							<th><a href="/coupa_03_admin.php?mainSort=LawsonNumber&order='. $order .'">LawsonNumber</a></th>
							<th><a href="/coupa_03_admin.php?mainSort=LawsonDescription&order='. $order .'">LawsonDescription</a></th>
							<th>UOM</th>
							<th><a href="/coupa_03_admin.php?mainSort=Source&order='. $order .'">Source</a></th>
							<th>SuggestedQty</th>
							<th>OrderQty</th>
						</tr>
					</thead>
					<tbody id="table_body">';
//Print the results
for($i = 0; $i < count($inv_array); $i++){
	echo'
						<tr class="hover">
							<td><input name="inv_array['. $i .'][MedId]" class="items"
								type="text" value="'. $inv_array[$i]['MedId'] .'" /></td>
							<td><input name="inv_array['. $i .'][MedDescription]" class="desc"
								type="text" value="'. $inv_array[$i]['MedDescription'] .'" /></td>
							<td><input name="inv_array['. $i .'][LawsonNumber]" class="lawnum"
								type="text" value="'. $inv_array[$i]['LawsonNumber'] .'" /></td>
							<td><input name="inv_array['. $i .'][LawsonDescription]" class="desc"
								type="text" value="'. $inv_array[$i]['LawsonDescription'] .'" /></td>
							<td><input name="inv_array['. $i .'][UOM]" class="uom"
								type="text" value="'. $inv_array[$i]['UOM'] .'" /></td>
							<td><input name="inv_array['. $i .'][Source]" class="source"
								type="text" value="'. $inv_array[$i]['Source'] .'" /></td>
							<td><input name="inv_array['. $i .'][SuggestedQty]" class="sqty"
								type="text" value="'. $inv_array[$i]['SuggestedQty'] .'" /></td>
							<td><input name="inv_array['. $i .'][OrderQty]" class="items"
								type="text" value="'. $inv_array[$i]['OrderQty'] .'" /></td>
						</tr>';
}
echo'
					</tbody>
				</table>
			</form>
		</div>
	</div>
</body>
</html>';
?>
