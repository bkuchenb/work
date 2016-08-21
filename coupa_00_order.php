<?php
include('coupa_00_header.php');
?>
<body>
	<div class="container_03">
		<div class="body_center">
			<form id="form_coupa" method="POST" action="javascript:void(0);">
				<input class="submit_coupa" id="submit_coupa" type="submit" value="Submit" />
				<table id="order_table" border="1">
					<thead>
						<tr>
							<th>Barcode</th>
							<th>LawsonNumber</th>
							<th>Description</th>
							<th>Source</th>
							<th>SuggestedQty</th>
							<th>OrderQty</th>
						</tr>
					</thead>
					<tbody id="table_body">
						<tr>
							<td><input id="1" class="items" type="text" /></td>
							<td class="lawnum_order"></td>
							<td class="desc_order"></td>
							<td class="source_order"></td>
							<td class="sqty_order"></td>
							<td><input class="qty" type="text" /></td>
							<td><button class="btn_delete" id="btn_0">Delete</button></td>
						</tr>
					</tbody>
				</table>
			</form>
		</div>
	</div>
<script type="text/javascript" src="coupa_02_scripts.js"></script>
</body>
</html>
