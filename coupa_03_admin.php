<?php
include('coupa_00_header.php');
echo'
<body>
	<div class="container_03">
		<div class="body_center">
			<form id="form_coupa" method="POST" action="coupa_03_admin.php">
				<table id="order_table" border="1">
					<thead>
						<tr>
							<th>Barcode</th>
							<th>Lawson Number</th>
							<th>Description</th>
							<th>Source</th>
							<th>Suggested Qty</th>
							<th>Order Qty</th>
						</tr>
					</thead>
					<tbody id="table_body">
						<tr>
							<td><input id="1" class="items" type="text" /></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td><input class="qty" type="text" /></td>
						</tr>
					</tbody>
				</table>
			</form>
		</div>
	</div>
<script type="text/javascript" src="coupa_02_scripts.js"></script>
</body>
</html>';
?>
