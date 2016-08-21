//Get the first item element.
var items = document.getElementsByClassName('items');
var item = items[items.length -1];
var found_match = false;
//Place the cursor in the first empty cell.
item.focus();
//Add an action listener to the item.
create_listener(item);
//Hide the submit button.
document.getElementById('submit_coupa').style.visibility = "hidden";
//Create an action listener for the first button.
create_listener_delete(document.getElementById('btn_0'));

function create_listener_delete(btn_delete){
	//When clicked, remove all the element with quantity = 0.
	btn_delete.addEventListener("click", function(event){
		event.preventDefault();
		//Get the tr element that should be deleted.
		var row_id = btn_delete.id.replace('btn_', '')
		console.log(row_id);
		//var row = document.getElementById(row_id);
		document.getElementById("table_body").deleteRow(row_id);
	}, false);
}

function create_listener(item){
	//Add an event listener to the input cell.
	item.addEventListener("keyup", function(event){
		event.preventDefault();
		if(event.keyCode == 13){
			found_match = false;
			//Update the item details with a request from ajax.
			get_data(item);
		}
	}, false);
}

function check_rows(num, qty){
	//Get all the td elements.
	cells = document.getElementsByTagName('TD');
	//Cycle through the elments to see if there is a match.
	for(i = 1; i < cells.length; i += 7){
		//If there is a match, update the original and remove the data.
		if(cells[i].innerHTML == num){
			found_match = true;
			//Get the input that corresponds to the matching row.
			update_input = cells[i + 4].getElementsByClassName('qty');
			//Update the original qty.
			update_input[0].value = parseInt(update_input[0].value) + parseInt(qty);
			//Refresh the list of item elements.
			items = document.getElementsByClassName('items');
			//Delete the last entry
			items[items.length -1].value = '';
			//Set the focus on the first cell of the last row.
			items[items.length -1].focus();
		}
	}
}

function create_row(item){
	//Find the tbody element.
	var tbody = document.getElementById('table_body');
	//Create a new row in the table.
	var row = document.createElement('TR');
	//Create cells for the next item.
	var cell_0 = document.createElement('TD');
	var cell_1 = document.createElement('TD');
	var cell_2 = document.createElement('TD');
	var cell_3 = document.createElement('TD');
	var cell_4 = document.createElement('TD');
	var cell_5 = document.createElement('TD');
	var cell_6 = document.createElement('TD');
	//Create an input for the next barcode.
	var next_item = document.createElement('INPUT');
	//Set the id number, className and type.
	next_item.id = parseInt(item.id) + 1;
	next_item.className = 'items';
	next_item.type = 'text';
	//Create an input for the OrderQty.
	var next_order_qty = document.createElement('INPUT');
	//Create a delete button to remove the next_item.
	var btn_delete = document.createElement('BUTTON');
	//Set the className, id and innerHTML
	btn_delete.className = 'btn_delete';
	btn_delete.innerHTML = 'Delete';
	btn_delete.id = 'btn_' + item.id;
	//Set the className and type for the OrderQty input.
	next_order_qty.className = 'qty';
	next_order_qty.type = 'text';
	//Add the barcode input to the first cell.
	cell_0.appendChild(next_item);
	//Add the OrderQty input to the sixth cell.
	cell_5.appendChild(next_order_qty);
	//Add the delete button to the last cell.
	cell_6.appendChild(btn_delete);
	//Add all the cells to the row.
	row.appendChild(cell_0);
	row.appendChild(cell_1);
	row.appendChild(cell_2);
	row.appendChild(cell_3);
	row.appendChild(cell_4);
	row.appendChild(cell_5);
	row.appendChild(cell_6);
	//Add the row to the tbody.
	tbody.appendChild(row);
	//Move the cursor to the new empty line.
	next_item.focus();
	//Add an action listener to the new input.
	create_listener(next_item);
	//Create a listener for the button.
	create_listener_delete(btn_delete);
}

function get_data(item){
	//Replace the first part of the barcode.
	var med_id = item.value.replace('$(S)', '');
	var xhttp = new XMLHttpRequest();
	var post_data = "med_id=" + med_id;
	xhttp.onreadystatechange = function(){
		if (xhttp.readyState == 4 && xhttp.status == 200){
			//Get the data returned.
			var data_array = JSON.parse(xhttp.responseText);
			//Get all the td elements.
			cells = document.getElementsByTagName('TD');
			//Checkto see if this is a duplicate value.
			check_rows(data_array.LawsonNumber, data_array.OrderQty);
			if(!found_match){
				create_row(item);
				//Get the last tr element.
				rows = document.getElementsByTagName('TR');
				//Set the row id to the LawsonNumber.
				rows[rows.length - 2].id = data_array.LawsonNumber;
				//If the Source is W/S set the backgroundColor to red.
				if(data_array.Source == 'W/S'){
					for(j = 9; j <= 13; j++){
						cells[cells.length - j].style.backgroundColor = 'Red';
					}
				}
				//Add the data to the cells.
				cells[cells.length - 13].innerHTML = data_array.LawsonNumber;
				cells[cells.length - 12].innerHTML = data_array.LawsonDescription;
				cells[cells.length - 11].innerHTML = data_array.Source;
				cells[cells.length - 10].innerHTML = data_array.SuggestedQty;
				//Get all the qty inputs.
				quantities = document.getElementsByClassName('qty');
				quantities[quantities.length - 2].value = data_array.OrderQty;
			}
		}
	}
	xhttp.open("POST", "coupa_01_get_data.php", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send(post_data);
}