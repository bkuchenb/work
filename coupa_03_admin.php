<?php
include('coupa_00_header.php');
//Connect to the coupa database.
require('coupa_mysqli_connect.php');
//Check to see if changes have been submitted.
if($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['login'])){
	
}

//Display the items in the database.
$q = 'SELECT *
	  FROM inventory
	  ORDER BY MedDescription ASC';
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
			<form id="form_coupa" method="POST" action="coupa_03_admin.php">
				<table id="order_table" border="1">
					<thead>
						<tr>
							<th>MedId</th>
							<th>MedDescription</th>
							<th>LawsonNumber</th>
							<th>LawsonDescription</th>
							<th>UOM</th>
							<th>Source</th>
							<th>SuggestedQty</th>
							<th>OrderQty</th>
						</tr>
					</thead>
					<tbody id="table_body">';
//Print the results
for($i = 0; $i < count($inv_array); $i++){
	echo'
						<tr>
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
