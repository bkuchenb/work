//Load the formulary
var formulary = load_formulary();
console.log(formulary.length + ' items were loaded from the formulary.');
//Get the first item element.
var items = document.getElementsByClassName('items');
var item = items[items.length -1];
//Create flags for item in formulary and already scanned.
var in_formulary = false;
var found_match = false;
//Place the cursor in the first empty cell.
item.focus();
//Add an action listener to the barcode field (class = items).
create_listener(item);
//Create an action listener for the first button.
create_listener_delete(document.getElementById('btn_0'));
//Create an action listener for the print button.
create_listener_print(document.getElementById('btn_print'));

function create_listener_print(btn_print){
	//Add an event listener to the print button.
	btn_print.addEventListener('click', function(event){
		//Get all the items that need to be printed.
		var  barcode_list = document.getElementsByClassName('barcode');
		var  lawnum_order_list = document.getElementsByClassName('lawnum_order');
		var  desc_order = document.getElementsByClassName('desc_order');
		var  source_order_list = document.getElementsByClassName('source_order');
		var  sqty_order_list = document.getElementsByClassName('sqty_order');
		var  qty_list = document.getElementsByClassName('qty');
		var  location_list = document.getElementsByClassName('location');
		//Create a csv list of all the data.
		var csv = [];
		for(var i = 0; i < lawnum_order_list.length - 1; i++){
			csv.push(location_list[i + 1].innerHTML + ',' + lawnum_order_list[i].innerHTML
			+ ',' + desc_order[i].innerHTML	+ ',' + source_order_list[i].innerHTML
			+ ',' + sqty_order_list[i].innerHTML + ',' + qty_list[i].value)
		}
		console.log(csv);
		//Reorder the items in the csv list.
		var sorted_locations = sortAlphaNum(csv);
		//Cycle through the sorted list.
		for(var j = 0; j < sorted_locations.length; j++){
			//Split the array.
			var row_array = sorted_locations[j].split(',');
			//Update each field in the order form.
			if(row_array[0].slice(0, 1) == '0'){
				location_list[j + 1].innerHTML = row_array[0].slice(1);
			}
			else{
				location_list[j + 1].innerHTML = row_array[0];
			}
			lawnum_order_list[j].innerHTML = row_array[1];
			desc_order[j].innerHTML = row_array[2];
			source_order_list[j].innerHTML = row_array[3];
			sqty_order_list[j].innerHTML = row_array[4];
			qty_list[j].value = row_array[5];
			//Replace the barcode valu with line #.
			barcode_list[j + 1].innerHTML = j + 1;
		}
		//Update the barcode column heading.
		barcode_list[0].innerHTML = 'Line';
		window.print();
	}, false);
}

function create_listener_delete(btn_delete){
	//When clicked, remove the element.
	btn_delete.addEventListener('click', function(event){
		event.preventDefault();
		//Get the tr element that should be deleted.
		var row_id = btn_delete.id.replace('btn_', '')
		console.log('Row ' + row_id + ' has been deleted.');
		//Delete the row.
		document.getElementById('table_body').deleteRow(row_id);
		//Get the remaining delete buttons.
		var btns_remain = document.getElementsByClassName('btn_delete');
		//Re-number the delete buttons.
		for(var y = 0; y < btns_remain.length; y++){
			btns_remain[y].id = ('btn_' + y);
		}
	}, false);
}

function create_listener(item){
	//Add an event listener to the input cell.
	item.addEventListener('keyup', function(event){
		event.preventDefault();
		if(event.keyCode == 13){
			found_match = false;
			//Update the item details.
			get_data(item);
		}
	}, false);
}

function check_rows(num, qty){
	//Get all the td elements.
	cells = document.getElementsByTagName('td');
	//Cycle through the elments to see if there is a match.
	for(i = 1; i < cells.length; i += 8){
		//If there is a match, update the original and remove the data.
		if(cells[i].innerHTML == num && num != 'N/A'){
			found_match = true;
			//Get the input that corresponds to the matching row.
			update_input = cells[i + 4].getElementsByClassName('qty');
			//Update the original qty.
			update_input[0].value = parseInt(update_input[0].value) + qty;
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
	var row = document.createElement('tr');
	//Set the class name for the row.
	row.className = 'empty_row'
	//Create cells for the next item.
	var cell_0 = document.createElement('td');
	//Set the class name for the barcode cell.
	cell_0.className = 'barcode';
	var cell_1 = document.createElement('td');
	//Set the class name for the lawson number cell.
	cell_1.className = 'lawnum_order';
	var cell_2 = document.createElement('td');
	//Set the class name for the description cell.
	cell_2.className = 'desc_order';
	var cell_3 = document.createElement('td');
	//Set the class name for the source cell.
	cell_3.className = 'source_order';
	var cell_4 = document.createElement('td');
	//Set the class name for the suggested qty cell.
	cell_4.className = 'sqty_order';
	var cell_5 = document.createElement('td');
	var cell_6 = document.createElement('td');
	//Set the class name for the delete button cell.
	cell_6.className = 'delete';
	var cell_7 = document.createElement('td');
	//Set the class name for the location cell.
	cell_7.className = 'location';
	//Create an input for the next barcode.
	var next_item = document.createElement('input');
	//Set the id number, className and type.
	next_item.id = parseInt(item.id) + 1;
	next_item.className = 'items';
	next_item.type = 'text';
	//Create an input for the OrderQty.
	var next_order_qty = document.createElement('input');
	//Create a delete button to remove the next_item.
	var btn_delete = document.createElement('button');
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
	row.appendChild(cell_7);
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
	//Check the formulary for a match.
	for(var k = 0; k < formulary.length; k++){
		if(formulary[k].MedId == med_id){
			var entry = formulary[k];
			var in_formulary = true;
			console.log(formulary[k].MedId);
		}
	}
	if(!in_formulary){
		var entry = {"MedId": med_id,
		"LawsonNumber": "N/A",
		"LawsonDescription": "Invalid MedId",
		"UOM": "N/A",
		"Source": "N/A",
		"OrderQty": "N/A"}
	}
	//Get all the td elements.
	cells = document.getElementsByTagName('td');
	//Check to see if this is a duplicate value.
	check_rows(entry.LawsonNumber, entry.OrderQty);
	if(!found_match){
		create_row(item);
		//Get the last tr element.
		rows = document.getElementsByTagName('tr');
		//Set the row id to the LawsonNumber.
		rows[rows.length - 2].id = entry.LawsonNumber;
		//Change the className of the row.
		rows[rows.length - 2].className = 'row';
		//If the row number is even set the backgroundColor to grey.
		if((rows.length - 2) % 2 === 0){
			for(j = 11; j <= 16; j++){
				cells[cells.length - j].style.backgroundColor = '#D3D3D3';
			}
		}
		//If the Source is W/S set the backgroundColor to red.
		if(entry.Source == 'W/S' || entry.Source == 'N/A'){
			for(j = 11; j <= 16; j++){
				cells[cells.length - j].style.backgroundColor = 'Red';
			}
		}
		//Add the data to the cells.
		cells[cells.length - 15].innerHTML = entry.LawsonNumber;
		cells[cells.length - 14].innerHTML = entry.LawsonDescription;
		cells[cells.length - 13].innerHTML = entry.Source;
		cells[cells.length - 12].innerHTML = '';
		cells[cells.length - 9].innerHTML = entry.Location;
		//Get all the qty inputs.
		quantities = document.getElementsByClassName('qty');
		quantities[quantities.length - 2].value = entry.OrderQty;
	}
}

function sortAlphaNum(list){
	//Create an aray to temporarily store list entries.
	var temp = [];
	//Cycle through the list.
	for(var x = 0; x < list.length; x++){
		//Get the first two characters.
		var chars = list[x].slice(0, 2);
		//If they are numbers add the entry.
		if(parseInt(chars) > 9){
			temp.push(list[x]);
		}
		//If not, add a leading zero. 
		else{
			temp.push('0' + list[x]);
		}
	}
	return temp.sort();
}

function load_formulary(){
	var formulary = [
		{"MedId": "98686", "LawsonNumber": "103803", "LawsonDescription": "ACETAMIN SUPP 120MG U/D", "UOM": "12 SUPP/BX", "Source": "INV", "OrderQty": 12, "Location": "1B1A"},
		{"MedId": "98687", "LawsonNumber": "103806", "LawsonDescription": "ACETAMIN SUPP 325MG U/D", "UOM": "12 SUPP/BX", "Source": "INV", "OrderQty": 12, "Location": "1B1B"},
		{"MedId": "26839", "LawsonNumber": "254198", "LawsonDescription": "ACETAMINOPHEN TAB 325MG UD", "UOM": "1000 TABS/CT", "Source": "INV", "OrderQty": 1000, "Location": "6C5A"},
		{"MedId": "22742", "LawsonNumber": "254199", "LawsonDescription": "ACETAMINOPHEN TAB 500MG UD", "UOM": "1000 TABS/CT", "Source": "INV", "OrderQty": 1000, "Location": "2A1A"},
		{"MedId": "98688", "LawsonNumber": "216771", "LawsonDescription": "ACETAMIN SUPP 650MG", "UOM": "12 SUPP/BX", "Source": "INV", "OrderQty": 12, "Location": "1B1C"},
		{"MedId": "98775", "LawsonNumber": "104709", "LawsonDescription": "ACETAMIN TAB 80MG", "UOM": "30 TABS/BO", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "13875", "LawsonNumber": "201321", "LawsonDescription": "ACETAMIN EL 650MG 20.3ML", "UOM": "10 CUPS/CA", "Source": "INV", "OrderQty": 10, "Location": "6A1B"},
		{"MedId": "4510", "LawsonNumber": "107042", "LawsonDescription": "ACETAZOL TAB 250MG", "UOM": "100 TABS/BO", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "11356", "LawsonNumber": "101541", "LawsonDescription": "ACETAZOL VL 500MG/10ML", "UOM": "1 VIAL", "Source": "INV", "OrderQty": 1, "Location": "3C1A"},
		{"MedId": "77550", "LawsonNumber": "105382", "LawsonDescription": "ACETIC ACID OTIC 2% 15ML", "UOM": "1 BOTTLE", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "99549", "LawsonNumber": "200523", "LawsonDescription": "ACETYLCYS SOL 10% 4ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "1B3A"},
		{"MedId": "78880", "LawsonNumber": "107773", "LawsonDescription": "ACETYLCYSTEINE VL 6G/30ML", "UOM": "4 VIALS/CT", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "99289", "LawsonNumber": "107015", "LawsonDescription": "ACETYLCYSTEINE CAP 600MG", "UOM": "60 CAPS/BO", "Source": "INV", "OrderQty": 60, "Location": "2A1B"},
		{"MedId": "23349", "LawsonNumber": "104128", "LawsonDescription": "ACYCLOVIR CAP 200MG", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A1C"},
		{"MedId": "3139", "LawsonNumber": "100633", "LawsonDescription": "ACYCLOVIR VL 500MG", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "3C1B"},
		{"MedId": "98972", "LawsonNumber": "105526", "LawsonDescription": "ACYCLOVIR TAB 800MG", "UOM": "100 TABS/BO", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "22587", "LawsonNumber": "250374", "LawsonDescription": "ADENOSINE VL 6MG", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "3C1C"},
		{"MedId": "54738", "LawsonNumber": "215609", "LawsonDescription": "ALBUTEROL SOL 2.5MG 3ML SINGLE", "UOM": "30 NEBS/CT", "Source": "INV", "OrderQty": 30, "Location": "6C6A"},
		{"MedId": "57884", "LawsonNumber": "103924", "LawsonDescription": "ALBUTEROL SOL 20ML BOT", "UOM": "1 BOTTLE", "Source": "INV", "OrderQty": 1, "Location": "1B3D"},
		{"MedId": "82289", "LawsonNumber": "233702", "LawsonDescription": "ALBUTEROL HFA INHALER (OR/ICU)", "UOM": "1 INHALER", "Source": "INV", "OrderQty": 1, "Location": "1B3C"},
		{"MedId": "34872", "LawsonNumber": "214857", "LawsonDescription": "ALBUTEROL HFA IN HALER", "UOM": "1 INHALER", "Source": "INV", "OrderQty": 1, "Location": "1C1A"},
		{"MedId": "82137", "LawsonNumber": "222683", "LawsonDescription": "ALBUTEROL/IPRATROP INH 3ML", "UOM": "30 EACH/CT", "Source": "INV", "OrderQty": 30, "Location": "6D1A"},
		{"MedId": "99134", "LawsonNumber": "105300", "LawsonDescription": "ALENDRONATE TAB 10MG", "UOM": "100 TABS/BO", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "3717", "LawsonNumber": "107022", "LawsonDescription": "ALLOPURINOL TAB 100MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A1E"},
		{"MedId": "3722", "LawsonNumber": "107033", "LawsonDescription": "ALLOPURINOL TAB 300MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A1F"},
		{"MedId": "82375", "LawsonNumber": "240328", "LawsonDescription": "ALTEPLASE VI 2MG (CATHFLOW)", "UOM": "1 VIAL", "Source": "INV", "OrderQty": 1, "Location": "10A1D"},
		{"MedId": "4595", "LawsonNumber": "260635", "LawsonDescription": "ALUMINUM HYDROX. 16 OZ BO", "UOM": "1 BOTTLE", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "44971", "LawsonNumber": "100339", "LawsonDescription": "DRUG AMINOPHY VL 500MG", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "3C3A"},
		{"MedId": "98530", "LawsonNumber": "244882", "LawsonDescription": "AMIODARONE TAB 200MG", "UOM": "500 TABS/BO", "Source": "INV", "OrderQty": 500, "Location": "2A1G"},
		{"MedId": "4590", "LawsonNumber": "105748", "LawsonDescription": "AMITRIPTY TAB 10MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A2A"},
		{"MedId": "99029", "LawsonNumber": "105572", "LawsonDescription": "AMLODIPINE TAB 10MG", "UOM": "90 TABS/BO", "Source": "INV", "OrderQty": 90, "Location": "2A2G"},
		{"MedId": "43522", "LawsonNumber": "105584", "LawsonDescription": "AMLODIPINE TAB 2.5MG", "UOM": "90 TABS/BO", "Source": "INV", "OrderQty": 90, "Location": "2A2E"},
		{"MedId": "99026", "LawsonNumber": "247407", "LawsonDescription": "AMLODIPINE TAB 5MG", "UOM": "500 TABS/BO", "Source": "INV", "OrderQty": 500, "Location": "2A2F"},
		{"MedId": "22577", "LawsonNumber": "106502", "LawsonDescription": "AMOX CAP 250MG", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A2H"},
		{"MedId": "98849", "LawsonNumber": "105777", "LawsonDescription": "AMOX/CLAV TAB 500MG", "UOM": "20 TABS/BO", "Source": "INV", "OrderQty": 20, "Location": "2A2J"},
		{"MedId": "99189", "LawsonNumber": "247013", "LawsonDescription": "AMOX/CLAV TAB 875MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A2K"},
		{"MedId": "82516", "LawsonNumber": "248115", "LawsonDescription": "APIXABAN TAB 2.5MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A3D"},
		{"MedId": "82517", "LawsonNumber": "248116", "LawsonDescription": "APIXABAN TAB 5MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A3E"},
		{"MedId": "43108", "LawsonNumber": "107794", "LawsonDescription": "ASCORB ACID TAB 500MG", "UOM": "1000 TABS/BO", "Source": "INV", "OrderQty": 1000, "Location": "2A3F"},
		{"MedId": "4565", "LawsonNumber": "104934", "LawsonDescription": "ASPIRIN TAB 325MG", "UOM": "500 TABS/BO", "Source": "INV", "OrderQty": 500, "Location": "2A3H"},
		{"MedId": "98693", "LawsonNumber": "105510", "LawsonDescription": "ASPIRIN SUPP 600MG U/D", "UOM": "12 SUPP/BX", "Source": "INV", "OrderQty": 12, "Location": "10A1F"},
		{"MedId": "6623", "LawsonNumber": "104936", "LawsonDescription": "ASPIRIN TAB CHEW 81MG", "UOM": "750 TABS/BO", "Source": "INV", "OrderQty": 750, "Location": "6D4A"},
		{"MedId": "9662", "LawsonNumber": "107939", "LawsonDescription": "ASPIRIN TAB EC 325MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A3J"},
		{"MedId": "98865", "LawsonNumber": "227031", "LawsonDescription": "ASPIRIN TAB EC 81MG", "UOM": "1000 TABS/BO", "Source": "INV", "OrderQty": 1000, "Location": "2A3G"},
		{"MedId": "34124", "LawsonNumber": "105436", "LawsonDescription": "ATENOLOL TAB 25MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A3K"},
		{"MedId": "2105", "LawsonNumber": "105435", "LawsonDescription": "ATENOLOL TAB 50MG", "UOM": "1000 TABS/BO", "Source": "INV", "OrderQty": 1000, "Location": "2A3L"},
		{"MedId": "42850", "LawsonNumber": "105574", "LawsonDescription": "ATORVASTATIN TAB 10MG", "UOM": "90 TABS/BO", "Source": "INV", "OrderQty": 90, "Location": "2A3M"},
		{"MedId": "82354", "LawsonNumber": "238254", "LawsonDescription": "ATORVASTATIN TAB 20MG", "UOM": "90 TABLETS/BO", "Source": "INV", "OrderQty": 90, "Location": "2A3N"},
		{"MedId": "45320", "LawsonNumber": "244506", "LawsonDescription": "ATORVASTATIN TAB 40MG", "UOM": "90 TABS/BO", "Source": "INV", "OrderQty": 90, "Location": "2A4A"},
		{"MedId": "53710", "LawsonNumber": "105608", "LawsonDescription": "ATORVASTATIN TAB 80MG", "UOM": "90 TABS/BO", "Source": "INV", "OrderQty": 90, "Location": "2A4B"},
		{"MedId": "5695", "LawsonNumber": "101067", "LawsonDescription": "ATROPINE VL .4MG 1ML", "UOM": "25 VIALS/BX", "Source": "INV", "OrderQty": 25, "Location": "3D1C"},
		{"MedId": "19709", "LawsonNumber": "101088", "LawsonDescription": "ATROPINE VL 1MG 1ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "3D1D"},
		{"MedId": "19432", "LawsonNumber": "104090", "LawsonDescription": "ATROPINE SYR 1MG/10ML", "UOM": "10 SYR/CT", "Source": "INV", "OrderQty": 10, "Location": "3D1B"},
		{"MedId": "99071", "LawsonNumber": "258039", "LawsonDescription": "AZITHROMYCIN TAB 250MG", "UOM": "18 TABS/BX", "Source": "INV", "OrderQty": 18, "Location": "2A4C"},
		{"MedId": "25652", "LawsonNumber": "237881", "LawsonDescription": "BACITRACIN VL 50KU", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "11D1A"},
		{"MedId": "5226", "LawsonNumber": "103805", "LawsonDescription": "BACITRACIN OINT 1OZ", "UOM": "12 TUBES", "Source": "INV", "OrderQty": 12, "Location": "1D4G"},
		{"MedId": "45264", "LawsonNumber": "106990", "LawsonDescription": "BACLOFEN TAB 10MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A4D"},
		{"MedId": "34041", "LawsonNumber": "106985", "LawsonDescription": "BACLOFEN TAB 20MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A4E"},
		{"MedId": "31252", "LawsonNumber": "104117", "LawsonDescription": "BENAZEPRIL TAB 10MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A4F"},
		{"MedId": "24129", "LawsonNumber": "105063", "LawsonDescription": "BENZOCAINE SPRAY 2OZ", "UOM": "12 CANS", "Source": "INV", "OrderQty": 12, "Location": "6D4B"},
		{"MedId": "46600", "LawsonNumber": "101585", "LawsonDescription": "BENZOCAINE SPRAY 20% KIT", "UOM": "1 CAN", "Source": "INV", "OrderQty": 1, "Location": "1D5A"},
		{"MedId": "49937", "LawsonNumber": "105676", "LawsonDescription": "BENZONATATE CAP 100MG", "UOM": "500 CAPS/BO", "Source": "INV", "OrderQty": 500, "Location": "2A4H"},
		{"MedId": "31890", "LawsonNumber": "201180", "LawsonDescription": "BENZTROPINE", "UOM": "5 AMPS/CT", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "16055", "LawsonNumber": "106999", "LawsonDescription": "CITRA PH 30ML", "UOM": "10 CUPS/CA", "Source": "INV", "OrderQty": 10, "Location": "6A5A"},
		{"MedId": "98694", "LawsonNumber": "106982", "LawsonDescription": "BISACODYL SUPP 10MG", "UOM": "100 SUPP/BX", "Source": "INV", "OrderQty": 100, "Location": "1B1D"},
		{"MedId": "17529", "LawsonNumber": "104891", "LawsonDescription": "BISACODYL TAB 5MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A5B"},
		{"MedId": "21427", "LawsonNumber": "104124", "LawsonDescription": "BISMUTH LIQ 16OZ", "UOM": "1 BOTTLE", "Source": "INV", "OrderQty": 1, "Location": "6A3B"},
		{"MedId": "54447", "LawsonNumber": "105047", "LawsonDescription": "BIVALIRUDIN VL 250MG", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "3D3C"},
		{"MedId": "33437", "LawsonNumber": "100492", "LawsonDescription": "BOTULINUM TOXIN VL 100U", "UOM": "1 VIAL", "Source": "INV", "OrderQty": 1, "Location": "10A2A"},
		{"MedId": "53892", "LawsonNumber": "100831", "LawsonDescription": "BUDESONIDE 0.5MG/2ML NEB", "UOM": "30 NEBS/CT", "Source": "INV", "OrderQty": 30, "Location": "1C4A"},
		{"MedId": "10102", "LawsonNumber": "101101", "LawsonDescription": "BUMETANIDE VL 1MG 4ML", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "3D4A"},
		{"MedId": "2616", "LawsonNumber": "103330", "LawsonDescription": "BUMETANIDE TAB 1MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A5D"},
		{"MedId": "39466", "LawsonNumber": "254455", "LawsonDescription": "BUMETANIDE TAB 2MG", "UOM": "500 TABS/BO", "Source": "INV", "OrderQty": 500, "Location": "2A5E"},
		{"MedId": "57034", "LawsonNumber": "100413", "LawsonDescription": "BUPIV TTV .25% 30ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "3D5B"},
		{"MedId": "57173", "LawsonNumber": "100414", "LawsonDescription": "BUPIVACAINE TTV .5% 30ML", "UOM": "25 VIALS /CT", "Source": "INV", "OrderQty": 25, "Location": "3E1A"},
		{"MedId": "21184", "LawsonNumber": "105397", "LawsonDescription": "BUPROPRION TAB 100MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A5G"},
		{"MedId": "41252", "LawsonNumber": "105396", "LawsonDescription": "BUPROPRION TAB 75MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A5F"},
		{"MedId": "45365", "LawsonNumber": "103338", "LawsonDescription": "BUPROPION TAB 150MG SR", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A5H"},
		{"MedId": "23373", "LawsonNumber": "103377", "LawsonDescription": "BUSPIRONE TAB 10MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A5J"},
		{"MedId": "98516", "LawsonNumber": "103376", "LawsonDescription": "BUSPIRONE TAB 5MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A5I"},
		{"MedId": "65229", "LawsonNumber": "201030", "LawsonDescription": "CALCITONIN NASAL SPR-RDNA", "UOM": "1 SPRAY", "Source": "INV", "OrderQty": 1, "Location": "10A2B"},
		{"MedId": "98769", "LawsonNumber": "106500", "LawsonDescription": "CALCITROL CAP .25MCG", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A5K"},
		{"MedId": "21265", "LawsonNumber": "100311", "LawsonDescription": "CALCITRIOL INJ 1MCG/ML", "UOM": "10 VIALS/CT", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "98959", "LawsonNumber": "105405", "LawsonDescription": "CALCIUM ACET CAP 667MG", "UOM": "200 CAPS/BO", "Source": "INV", "OrderQty": 200, "Location": "2A5L"},
		{"MedId": "6320", "LawsonNumber": "229136", "LawsonDescription": "CA CARB TAB 500MG", "UOM": "300 TABS/BO", "Source": "INV", "OrderQty": 300, "Location": "2A6B"},
		{"MedId": "24276", "LawsonNumber": "213583", "LawsonDescription": "CALCIUM CARB TAB 600MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A6C"},
		{"MedId": "82477", "LawsonNumber": "246658", "LawsonDescription": "CALCIUM CARBONATE CHEW 1000MG", "UOM": "72 TABS/BO", "Source": "INV", "OrderQty": 72, "Location": "2A6E"},
		{"MedId": "6323", "LawsonNumber": "104125", "LawsonDescription": "CALCIUM D TAB 250MG", "UOM": "1000 TABS/BO", "Source": "INV", "OrderQty": 1000, "Location": "2A5M"},
		{"MedId": "28707", "LawsonNumber": "213582", "LawsonDescription": "CALCIUM CARB-VIT D TAB 600MG", "UOM": "150 TABS/BO", "Source": "INV", "OrderQty": 150, "Location": "2A6A"},
		{"MedId": "17274", "LawsonNumber": "104088", "LawsonDescription": "SYR CA CL 10ML", "UOM": "10 SYR/CT", "Source": "INV", "OrderQty": 10, "Location": "3E2A"},
		{"MedId": "53114", "LawsonNumber": "104942", "LawsonDescription": "CAPTOPRIL TAB 25MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2A6G"},
		{"MedId": "51878", "LawsonNumber": "103316", "LawsonDescription": "CARBI/LEVO TAB 25/100MG", "UOM": "500 TABS/BO", "Source": "INV", "OrderQty": 500, "Location": "2B1A"},
		{"MedId": "20629", "LawsonNumber": "105565", "LawsonDescription": "CARBOPROST VL 250MCG", "UOM": "10 VIALS/BO", "Source": "INV", "OrderQty": 10, "Location": "10A2D"},
		{"MedId": "45376", "LawsonNumber": "103561", "LawsonDescription": "CARVEDILOL TAB 12.5MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2B1G"},
		{"MedId": "45378", "LawsonNumber": "209226", "LawsonDescription": "CARVEDILOL TAB 25MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2B1H"},
		{"MedId": "45374", "LawsonNumber": "103563", "LawsonDescription": "CARVEDILOL TAB 3.125MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2B1E"},
		{"MedId": "45375", "LawsonNumber": "103562", "LawsonDescription": "CARVEDILOL TAB 6.25MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2B1F"},
		{"MedId": "46557", "LawsonNumber": "105444", "LawsonDescription": "CEFAZOLIN VL 1GM", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "6E1A"},
		{"MedId": "13307", "LawsonNumber": "254304", "LawsonDescription": "CEFTRIAXONE VL 1GM", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "3F1B"},
		{"MedId": "13198", "LawsonNumber": "104862", "LawsonDescription": "CEFTRIAXONE VL 250MG", "UOM": "10 VIALS/BX", "Source": "INV", "OrderQty": 10, "Location": "3F1A"},
		{"MedId": "50424", "LawsonNumber": "105615", "LawsonDescription": "CELECOXIB CAP 100MG", "UOM": "100 CAPS/BX", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "50525", "LawsonNumber": "105616", "LawsonDescription": "CELECOXIB CAP 200MG", "UOM": "100 CAPS/BX", "Source": "INV", "OrderQty": 100, "Location": "2B2E"},
		{"MedId": "15875", "LawsonNumber": "104104", "LawsonDescription": "CEPHALEXIN CAP 250MG", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "2B2G"},
		{"MedId": "15876", "LawsonNumber": "104103", "LawsonDescription": "CEPHALEXIN CAP 500MG", "UOM": "500 CAPS/BO", "Source": "INV", "OrderQty": 500, "Location": "2B2H"},
		{"MedId": "99078", "LawsonNumber": "107012", "LawsonDescription": "CHARCOAL ACTIV/AQUA 50GM", "UOM": "1 BOTTLE", "Source": "INV", "OrderQty": 1, "Location": "6A3G"},
		{"MedId": "98744", "LawsonNumber": "103554", "LawsonDescription": "CHLORAMBUCIL TAB 2MG", "UOM": "50 TABS/BO", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "98948", "LawsonNumber": "100610", "LawsonDescription": "CHLORHEX ORAL RINSE 16OZ", "UOM": "12 BOTTLES", "Source": "INV", "OrderQty": 12, "Location": "6A4A"},
		{"MedId": "8525", "LawsonNumber": "238248", "LawsonDescription": "CHLOROPROC VL 3% 20ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "3F2A"},
		{"MedId": "98881", "LawsonNumber": "105296", "LawsonDescription": "CHLOROTHIAZIDE VL INJECT 500MG", "UOM": "1 VIAL", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "23403", "LawsonNumber": "101065", "LawsonDescription": "CHLORPROM AMP 50MG 2ML", "UOM": "25 AMPS/BX", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "82124", "LawsonNumber": "222176", "LawsonDescription": "CHOLECALCIFEROL TAB 1000IU", "UOM": "180 TABS/BO", "Source": "INV", "OrderQty": 180, "Location": "2B3A"},
		{"MedId": "99205", "LawsonNumber": "104885", "LawsonDescription": "CHOLECALCIFEROL CAP 400IU", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "2B2I"},
		{"MedId": "98768", "LawsonNumber": "106983", "LawsonDescription": "CHOLESTYRAMINE PWD PK 4GM", "UOM": "60 PKTS/BX", "Source": "INV", "OrderQty": 60, "Location": "2B3B"},
		{"MedId": "61222", "LawsonNumber": "200535", "LawsonDescription": "CINACALCET TAB 30MG", "UOM": "30 TABS/BO", "Source": "INV", "OrderQty": 30, "Location": "2B3D"},
		{"MedId": "5505", "LawsonNumber": "107944", "LawsonDescription": "CIPRO TAB 250MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2B3E"},
		{"MedId": "5507", "LawsonNumber": "107946", "LawsonDescription": "CIPROFLOXACIN TAB 500MG U/D", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2B3F"},
		{"MedId": "99145", "LawsonNumber": "249980", "LawsonDescription": "CISATRACURIUM VL 5ML", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "11D2A"},
		{"MedId": "15865", "LawsonNumber": "105775", "LawsonDescription": "CLINDAMYCIN CAP 150MG", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "2B4C"},
		{"MedId": "60543", "LawsonNumber": "105738", "LawsonDescription": "CLONIDINE TAB 0.1MG", "UOM": "100 TABS/BX", "Source": "INV", "OrderQty": 100, "Location": "2B4D"},
		{"MedId": "60564", "LawsonNumber": "105739", "LawsonDescription": "CLONIDINE TAB 0.2MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2B5A"},
		{"MedId": "48014", "LawsonNumber": "246460", "LawsonDescription": "CLOPIDOGREL TAB 75 MG", "UOM": "90 TABS/BO", "Source": "INV", "OrderQty": 90, "Location": "2B5B"},
		{"MedId": "22681", "LawsonNumber": "105875", "LawsonDescription": "CLOTRIMAZOLE TROC 10MG", "UOM": "140 TROCS/BO", "Source": "INV", "OrderQty": 140, "Location": "2B5C"},
		{"MedId": "30948", "LawsonNumber": "107792", "LawsonDescription": "COCOA BUTTER BAR 1OZ", "UOM": "1 STICK", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "38230", "LawsonNumber": "104658", "LawsonDescription": "COLLAGEN FLOUR JAR 0.5GM", "UOM": "6 JARS/BX", "Source": "INV", "OrderQty": 6, "Location": "1D6A"},
		{"MedId": "9518", "LawsonNumber": "100702", "LawsonDescription": "CORTROSYN VL .25MG", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "3F2C"},
		{"MedId": "2052", "LawsonNumber": "100623", "LawsonDescription": "CYANOCOBAL VL 1MG 1ML", "UOM": "25 VIALS/BX", "Source": "INV", "OrderQty": 25, "Location": "3F2D"},
		{"MedId": "26706", "LawsonNumber": "104135", "LawsonDescription": "CYANOCOBAL TAB 1000MCG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2B5F"},
		{"MedId": "41144", "LawsonNumber": "106959", "LawsonDescription": "CYCLOBENZAPR TAB 10MG", "UOM": "1000 TABS/BO", "Source": "INV", "OrderQty": 1000, "Location": "2B5H"},
		{"MedId": "99417", "LawsonNumber": "104742", "LawsonDescription": "CYCLOBENZAPRINE TAB 5MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2B5G"},
		{"MedId": "82270", "LawsonNumber": "231913", "LawsonDescription": "DABIGATRAN CAP 150MG", "UOM": "60 TABS/BO", "Source": "INV", "OrderQty": 60, "Location": "2B6A"},
		{"MedId": "82433", "LawsonNumber": "244164", "LawsonDescription": "DEGARELIX KIT 240MG (2X120MG)", "UOM": "1 VIAL", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "3901", "LawsonNumber": "101069", "LawsonDescription": "DEXAMETH VL 10MG 1ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "3F4B"},
		{"MedId": "5763", "LawsonNumber": "100640", "LawsonDescription": "DEXAMETH VL 20MG/5ML(MDV)", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "3F4A"},
		{"MedId": "99505", "LawsonNumber": "100635", "LawsonDescription": "DEXAMETH VL 4MG/1ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "3F3A"},
		{"MedId": "46705", "LawsonNumber": "105906", "LawsonDescription": "DEXAMETH TAB 4MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2B6C"},
		{"MedId": "17851", "LawsonNumber": "100337", "LawsonDescription": "DEXTROSE SYR 50% 50ML", "UOM": "10 SYR/CT", "Source": "INV", "OrderQty": 10, "Location": "6F2A"},
		{"MedId": "18746", "LawsonNumber": "127513", "LawsonDescription": "DIBUCAINE OINT 1% 1OZ", "UOM": "1 TUBE", "Source": "INV", "OrderQty": 1, "Location": "1D6D"},
		{"MedId": "27117", "LawsonNumber": "107066", "LawsonDescription": "DICYCLOMINE CAP 10MG", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "2B6D"},
		{"MedId": "27118", "LawsonNumber": "104952", "LawsonDescription": "DICYCLOMINE TAB 20MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2B6E"},
		{"MedId": "14305", "LawsonNumber": "101582", "LawsonDescription": "DIGOXIN TAB .125MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2B6F"},
		{"MedId": "24056", "LawsonNumber": "101581", "LawsonDescription": "DIGOXIN TAB .25MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2B6G"},
		{"MedId": "12783", "LawsonNumber": "101062", "LawsonDescription": "DIGOXIN AMP .5MG 2ML", "UOM": "25 AMPS/BX", "Source": "INV", "OrderQty": 25, "Location": "3F5B"},
		{"MedId": "38534", "LawsonNumber": "105963", "LawsonDescription": "DIGOXIN IMMUNE FAB 40MG", "UOM": "1 VIAL", "Source": "INV", "OrderQty": 1, "Location": "10A3C"},
		{"MedId": "33324", "LawsonNumber": "103553", "LawsonDescription": "DIGOXIN PED AMP .1MG 1ML", "UOM": "10 AMPS/CT", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "13310", "LawsonNumber": "101558", "LawsonDescription": "DIHYDROER 45 VL 1MG/1ML", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "3F5C"},
		{"MedId": "32400", "LawsonNumber": "107193", "LawsonDescription": "DILTIAZEM VL 5MG/ML 5ML", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "11D3C"},
		{"MedId": "6246", "LawsonNumber": "106508", "LawsonDescription": "DILTIAZEM TAB 30MG U/D", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2B6H"},
		{"MedId": "6266", "LawsonNumber": "106504", "LawsonDescription": "DILTIAZEM TAB 60MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2C1A"},
		{"MedId": "99025", "LawsonNumber": "229498", "LawsonDescription": "DILTIAZEM CD 120MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2C1B"},
		{"MedId": "32712", "LawsonNumber": "229499", "LawsonDescription": "DILTIAZEM CD 180MG", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "2C1C"},
		{"MedId": "32715", "LawsonNumber": "100618", "LawsonDescription": "DILTIAZEM CD 240MG", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "2C1D"},
		{"MedId": "98641", "LawsonNumber": "107906", "LawsonDescription": "DILUENT-ORAL CHERRY 500ML", "UOM": "1 BOTTLE", "Source": "INV", "OrderQty": 1, "Location": "6A5B"},
		{"MedId": "35914", "LawsonNumber": "200521", "LawsonDescription": "DIPHENHYD ELIX 25MG 10ML", "UOM": "10 CUPS/BX", "Source": "INV", "OrderQty": 10, "Location": "6A5C"},
		{"MedId": "36789", "LawsonNumber": "106936", "LawsonDescription": "DIPHENHYD CAP 25MGU/D", "UOM": "100 CAPS/BX", "Source": "INV", "OrderQty": 100, "Location": "2C1F"},
		{"MedId": "23884", "LawsonNumber": "100630", "LawsonDescription": "DIPHENHYD VL 50MG 1ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "3F6A"},
		{"MedId": "36824", "LawsonNumber": "104894", "LawsonDescription": "DIPHENHYD CAP 50MG U/D", "UOM": "100 CAPS/BX", "Source": "INV", "OrderQty": 100, "Location": "2C1G"},
		{"MedId": "10550", "LawsonNumber": "100395", "LawsonDescription": "DIVALPROEX SODIUM TAB EC 250MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2C2C"},
		{"MedId": "99379", "LawsonNumber": "100377", "LawsonDescription": "DIVALPROIC ACID TAB SR 500MG", "UOM": "80 TABS/BO", "Source": "INV", "OrderQty": 80, "Location": "2C2D"},
		{"MedId": "99072", "LawsonNumber": "216773", "LawsonDescription": "DOBUTAMINE 500MG/D5W 250ML", "UOM": "12 BAGS/CA", "Source": "INV", "OrderQty": 12, "Location": "6F4A"},
		{"MedId": "61972", "LawsonNumber": "105633", "LawsonDescription": "DOCUSATE SF 100MG 10ML", "UOM": "100 CUPS/CA", "Source": "INV", "OrderQty": 10, "Location": "6A6A"},
		{"MedId": "43123", "LawsonNumber": "229140", "LawsonDescription": "DOCUSATE CAP 100MG U/D", "UOM": "750 CAPS/BX", "Source": "INV", "OrderQty": 750, "Location": "6F5A"},
		{"MedId": "42493", "LawsonNumber": "264130", "LawsonDescription": "DONEPEZIL TAB 10MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2C2F"},
		{"MedId": "42489", "LawsonNumber": "264129", "LawsonDescription": "DONEPEZIL TAB 5MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2C2E"},
		{"MedId": "34821", "LawsonNumber": "103512", "LawsonDescription": "DORNASE ALPHA AMP 2.5MG", "UOM": "30 AMPS/CT", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "98990", "LawsonNumber": "213574", "LawsonDescription": "DOXAZOSIN TAB 1MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2C2G"},
		{"MedId": "98991", "LawsonNumber": "213575", "LawsonDescription": "DOXAZOSIN TAB 2MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2C2H"},
		{"MedId": "98992", "LawsonNumber": "213576", "LawsonDescription": "DOXAZOSIN TAB 4MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2C2I"},
		{"MedId": "61997", "LawsonNumber": "213577", "LawsonDescription": "DOXAZOSIN TAB 8MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2C2J"},
		{"MedId": "16291", "LawsonNumber": "249462", "LawsonDescription": "DOXYCYCLINE CAP 100MG", "UOM": "50 CAPS/BO", "Source": "INV", "OrderQty": 50, "Location": "2C2L"},
		{"MedId": "62485", "LawsonNumber": "254174", "LawsonDescription": "DULOXETINE CAP 30MG", "UOM": "30 EA/BO", "Source": "INV", "OrderQty": 30, "Location": "2C2O"},
		{"MedId": "62483", "LawsonNumber": "254175", "LawsonDescription": "DULOXETINE CAP 60MG", "UOM": "30 CAPS/BO", "Source": "INV", "OrderQty": 30, "Location": "2C2P"},
		{"MedId": "63162", "LawsonNumber": "102187", "LawsonDescription": "ELECTROLYTE BOWEL SOL 4L", "UOM": "6 BOTTLES", "Source": "INV", "OrderQty": 6, "Location": "7B1A"},
		{"MedId": "15662", "LawsonNumber": "107937", "LawsonDescription": "ENALAPRIL TAB 5MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2C3B"},
		{"MedId": "6729", "LawsonNumber": "100368", "LawsonDescription": "DRUG ENALAPRIL VL 2.5MG 2ML", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "4A4A"},
		{"MedId": "99203", "LawsonNumber": "100876", "LawsonDescription": "ENOXAPARIN SYR 100MG/ML", "UOM": "10 SYR/CT", "Source": "INV", "OrderQty": 10, "Location": "4B2A"},
		{"MedId": "99295", "LawsonNumber": "100886", "LawsonDescription": "ENOXAPARIN SYR 120MG", "UOM": "10 SYR/CT", "Source": "INV", "OrderQty": 10, "Location": "4B3A"},
		{"MedId": "99294", "LawsonNumber": "100887", "LawsonDescription": "ENOXAPARIN SYR 150MG", "UOM": "10 SYR/CT", "Source": "INV", "OrderQty": 10, "Location": "4B3B"},
		{"MedId": "33629", "LawsonNumber": "100889", "LawsonDescription": "ENOXAPARIN SYR 30MG/0.3ML", "UOM": "10 SYR/CT", "Source": "INV", "OrderQty": 10, "Location": "4A5A"},
		{"MedId": "99169", "LawsonNumber": "100871", "LawsonDescription": "ENOXAPARIN SYR 40MG/0.4ML", "UOM": "10 SYR/CT", "Source": "INV", "OrderQty": 10, "Location": "7A2A"},
		{"MedId": "99201", "LawsonNumber": "100877", "LawsonDescription": "ENOXAPARIN SYR 60MG/0.6ML", "UOM": "10 SYR/CT", "Source": "INV", "OrderQty": 10, "Location": "4A6A"},
		{"MedId": "99202", "LawsonNumber": "100878", "LawsonDescription": "ENOXAPARIN SYR 80MG/0.8ML", "UOM": "10 SYR/CT", "Source": "INV", "OrderQty": 10, "Location": "4B1A"},
		{"MedId": "1183", "LawsonNumber": "236672", "LawsonDescription": "EPHEDRINE AMP 50MG", "UOM": "10 AMPS/CT", "Source": "INV", "OrderQty": 10, "Location": "4B4B"},
		{"MedId": "2806", "LawsonNumber": "100333", "LawsonDescription": "EPINEPHRINE AMP 1 MG/1 ML", "UOM": "25 AMPS/BX", "Source": "INV", "OrderQty": 25, "Location": "4B5B"},
		{"MedId": "18323", "LawsonNumber": "104089", "LawsonDescription": "EPINEPHRINE SYR 10ML", "UOM": "10 SYR/CT", "Source": "INV", "OrderQty": 10, "Location": "4B4C"},
		{"MedId": "98228", "LawsonNumber": "105416", "LawsonDescription": "RACEMIC EPI INH NEB 2.25%", "UOM": "30 NEBS/BX", "Source": "INV", "OrderQty": 30, "Location": "1D2F"},
		{"MedId": "29771", "LawsonNumber": "104746", "LawsonDescription": "EPOETIN VL 10000U 1ML", "UOM": "6 VIALS/CT", "Source": "INV", "OrderQty": 6, "Location": "10A4D"},
		{"MedId": "29308", "LawsonNumber": "104733", "LawsonDescription": "EPOETIN VL 2000U 1ML", "UOM": "6 VIALS/CT", "Source": "INV", "OrderQty": 6, "Location": "10A4A"},
		{"MedId": "43421", "LawsonNumber": "104735", "LawsonDescription": "EPOETIN VL 20000U 1ML", "UOM": "4 VIALS/CT", "Source": "INV", "OrderQty": 4, "Location": "10A4E"},
		{"MedId": "29310", "LawsonNumber": "104745", "LawsonDescription": "EPOETIN VL 3000U 1ML", "UOM": "6 VIALS/CT", "Source": "INV", "OrderQty": 6, "Location": "10A4B"},
		{"MedId": "20973", "LawsonNumber": "104734", "LawsonDescription": "EPOETIN VL 4000U 1ML", "UOM": "6 VIALS/CT", "Source": "INV", "OrderQty": 6, "Location": "10A4C"},
		{"MedId": "49071", "LawsonNumber": "105969", "LawsonDescription": "EPTIFIBATIDE VL 10ML", "UOM": "1 VIAL", "Source": "INV", "OrderQty": 1, "Location": "11D5A"},
		{"MedId": "99198", "LawsonNumber": "105970", "LawsonDescription": "EPTIFIBATIDE VL 100ML", "UOM": "1 VIAL", "Source": "INV", "OrderQty": 1, "Location": "11D5B"},
		{"MedId": "82607", "LawsonNumber": "253183", "LawsonDescription": "ESCITALOPRAM TAB 10MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2C3G"},
		{"MedId": "82608", "LawsonNumber": "253184", "LawsonDescription": "ESCITALOPRAM TAB 20MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2C3H"},
		{"MedId": "82606", "LawsonNumber": "253182", "LawsonDescription": "ESCITALOPRAM TAB 5MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2C3F"},
		{"MedId": "58370", "LawsonNumber": "105293", "LawsonDescription": "ETHACRYNIC ACID VL 50MG", "UOM": "1 INJECTION", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "4946", "LawsonNumber": "101538", "LawsonDescription": "ETOMIDATE VL 20MG 10ML", "UOM": "10 VL/CT", "Source": "INV", "OrderQty": 10, "Location": "4C1B"},
		{"MedId": "98940", "LawsonNumber": "242065", "LawsonDescription": "ETOPOSIDE CAP 50MG", "UOM": "20 CAPS/BO", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "98864", "LawsonNumber": "103536", "LawsonDescription": "EUCERIN CREAM 4OZ", "UOM": "1 JAR", "Source": "INV", "OrderQty": 1, "Location": "1E1A"},
		{"MedId": "58207", "LawsonNumber": "105287", "LawsonDescription": "EZETIMIDE TAB 10MG", "UOM": "90 TABS/BO", "Source": "INV", "OrderQty": 90, "Location": "2C3I"},
		{"MedId": "22754", "LawsonNumber": "100303", "LawsonDescription": "FAMOTIDINE VL 20MG 2ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "11E1A"},
		{"MedId": "22745", "LawsonNumber": "247749", "LawsonDescription": "FAMOTIDINE TAB 20MG", "UOM": "500 TABS/BO", "Source": "INV", "OrderQty": 500, "Location": "2C3J"},
		{"MedId": "57784", "LawsonNumber": "103492", "LawsonDescription": "FENOFIBRATE CAP 200 MG", "UOM": "90 CAPS/BO", "Source": "INV", "OrderQty": 90, "Location": "2C3K"},
		{"MedId": "99077", "LawsonNumber": "102929", "LawsonDescription": "FERRIC SUBSULFATE AQUEOUS", "UOM": "12 BO/CA", "Source": "INV", "OrderQty": 12, "Location": "1E1B"},
		{"MedId": "99142", "LawsonNumber": "107781", "LawsonDescription": "FERRIS SUBSULFATE SOL 500", "UOM": "1 BOTTLE", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "23345", "LawsonNumber": "106991", "LawsonDescription": "FERROUS GLU TAB 325MG UD", "UOM": "100 TABS/BX", "Source": "INV", "OrderQty": 100, "Location": "2C3L"},
		{"MedId": "82443", "LawsonNumber": "245059", "LawsonDescription": "FERROUS SULF LIQ 16OZ", "UOM": "1 BOTTLE", "Source": "INV", "OrderQty": 1, "Location": "6A6E"},
		{"MedId": "43135", "LawsonNumber": "104114", "LawsonDescription": "FERROUS SUL TAB 325MG", "UOM": "1000 TABS/BO", "Source": "INV", "OrderQty": 1000, "Location": "2C3M"},
		{"MedId": "231414", "LawsonNumber": "231414", "LawsonDescription": "BUBBLE GUM FLAVOR CONC 2OZ", "UOM": "1 BOTTLE", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "231415", "LawsonNumber": "231415", "LawsonDescription": "CHOCOLATE FLAVOR CONC 2OZ", "UOM": "1 BOTTLE", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "99001", "LawsonNumber": "104859", "LawsonDescription": "FLUMAZENIL VL 0.5MG 5ML", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "4C2B"},
		{"MedId": "31865", "LawsonNumber": "100529", "LawsonDescription": "FLOURETS OPH STRIPS 100", "UOM": "1 STRIP", "Source": "INV", "OrderQty": 1, "Location": "1A4D"},
		{"MedId": "15336", "LawsonNumber": "100554", "LawsonDescription": "FLUORESCEIN VL 10% 5ML", "UOM": "12 VIALS/CT", "Source": "INV", "OrderQty": 12, "Location": "4C2C"},
		{"MedId": "99093", "LawsonNumber": "105690", "LawsonDescription": "FLUOXETINE CAP 10MG", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "2C4E"},
		{"MedId": "98556", "LawsonNumber": "105677", "LawsonDescription": "FLUOXETINE CAP 20MG", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "2C4F"},
		{"MedId": "22089", "LawsonNumber": "107815", "LawsonDescription": "FOLIC ACID TAB 1MG", "UOM": "1000 TABS/BO", "Source": "INV", "OrderQty": 1000, "Location": "2C4G"},
		{"MedId": "63027", "LawsonNumber": "211013", "LawsonDescription": "FONDAPARINUX SYR 10MG", "UOM": "10 SYR/CT", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "64714", "LawsonNumber": "206027", "LawsonDescription": "FONDAPARINUX SYR 2.5MG", "UOM": "10 SYR/CT", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "63025", "LawsonNumber": "211011", "LawsonDescription": "FONDAPARINUX SYR 5MG", "UOM": "10 SYR/CT", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "63026", "LawsonNumber": "211012", "LawsonDescription": "FONDAPARINUX SYR 7.5MG", "UOM": "2 SYR/CT", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "59787", "LawsonNumber": "210196", "LawsonDescription": "FORMOTEROL 12 mcg", "UOM": "12 CAPS/PK", "Source": "INV", "OrderQty": 12, "Location": "N/A"},
		{"MedId": "11754", "LawsonNumber": "105907", "LawsonDescription": "FUROSEM TAB 20MG U/D", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2C4I"},
		{"MedId": "16524", "LawsonNumber": "100415", "LawsonDescription": "FUROSEM VL 40MG 4ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "7C1A"},
		{"MedId": "54695", "LawsonNumber": "263265", "LawsonDescription": "FUROSEMIDE LIQ 40MG/5ML 500ML", "UOM": "1 BOTTLE", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "11814", "LawsonNumber": "105884", "LawsonDescription": "FUROSEM TAB 40MG", "UOM": "1000 TABS/BO", "Source": "INV", "OrderQty": 1000, "Location": "2C4J"},
		{"MedId": "34801", "LawsonNumber": "105576", "LawsonDescription": "GABAPENTIN CAP 100MG", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "2C5A"},
		{"MedId": "34802", "LawsonNumber": "255605", "LawsonDescription": "GABAPENTIN CAP 300MG", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "2C5B"},
		{"MedId": "34804", "LawsonNumber": "105553", "LawsonDescription": "GABAPENTIN CAP 400MG", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "2C6A"},
		{"MedId": "52437", "LawsonNumber": "105604", "LawsonDescription": "GABAPENTIN TAB 600MG", "UOM": "500 TABS/BO", "Source": "INV", "OrderQty": 500, "Location": "2C6B"},
		{"MedId": "4284", "LawsonNumber": "100398", "LawsonDescription": "DRUG GENTAMICIN VL 80MG 2ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "4C4C"},
		{"MedId": "4255", "LawsonNumber": "100657", "LawsonDescription": "GENTAMICIN PFV20MG/2ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "4C4B"},
		{"MedId": "6237", "LawsonNumber": "101184", "LawsonDescription": "GENTAMICIN PB 80MG 50ML", "UOM": "24 EA/CA", "Source": "INV", "OrderQty": 24, "Location": "7C2A"},
		{"MedId": "16555", "LawsonNumber": "107814", "LawsonDescription": "GLUCAGON VL 1MG", "UOM": "1 VIAL", "Source": "INV", "OrderQty": 1, "Location": "4C6A"},
		{"MedId": "45213", "LawsonNumber": "105516", "LawsonDescription": "GEL GLUCOSE ORAL GLUTOSE 15", "UOM": "3 TUBES", "Source": "INV", "OrderQty": 3, "Location": "6B1B"},
		{"MedId": "99649", "LawsonNumber": "229157", "LawsonDescription": "GLYCERIN SUPP INFANT U/D", "UOM": "10 SUPP/CT", "Source": "INV", "OrderQty": 10, "Location": "1B1E"},
		{"MedId": "34195", "LawsonNumber": "103799", "LawsonDescription": "GLYCERIN SUPP ADULT U/D", "UOM": "10 SUPP/BX", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "46516", "LawsonNumber": "101095", "LawsonDescription": "GLYCOPYROLATE VL .2MG 1ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "7C2B"},
		{"MedId": "4693", "LawsonNumber": "105641", "LawsonDescription": "GUAIFENESIN LIQ 10ML U/D", "UOM": "10 CUPS/CT", "Source": "INV", "OrderQty": 10, "Location": "6B1C"},
		{"MedId": "4692", "LawsonNumber": "105635", "LawsonDescription": "GUAIFENESIN LIQ 15ML U/D", "UOM": "10 CUPS/CT", "Source": "INV", "OrderQty": 10, "Location": "6B1D"},
		{"MedId": "5661", "LawsonNumber": "201315", "LawsonDescription": "GUAIFENESIN DM 10ML U/D", "UOM": "10 CUPS/CT", "Source": "INV", "OrderQty": 10, "Location": "6B2A"},
		{"MedId": "42200", "LawsonNumber": "107868", "LawsonDescription": "GUAIFENESIN TAB 600MG SA", "UOM": "500 TABS/BO", "Source": "INV", "OrderQty": 500, "Location": "2C6M"},
		{"MedId": "51406", "LawsonNumber": "100862", "LawsonDescription": "HAEMOPHILUS B VL(ACTHIB)", "UOM": "5 VIALS/BX", "Source": "INV", "OrderQty": 5, "Location": "10A6C"},
		{"MedId": "54774", "LawsonNumber": "105383", "LawsonDescription": "HALOPERIDOL TAB .5MG", "UOM": "100 TABS/BO", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "54863", "LawsonNumber": "105384", "LawsonDescription": "HALOPERIDOL TAB 1MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2D1A"},
		{"MedId": "16579", "LawsonNumber": "105988", "LawsonDescription": "HALOPERIDOL VL 5MG 1ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "4C6C"},
		{"MedId": "54985", "LawsonNumber": "105386", "LawsonDescription": "HALOPERIDOL TAB 5MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2D1B"},
		{"MedId": "17388", "LawsonNumber": "105672", "LawsonDescription": "TRIAM/HCTZ TAB 37.5/25", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3B2K"},
		{"MedId": "47129", "LawsonNumber": "100625", "LawsonDescription": "HEPARIN VL 1KU/ML 10ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "4D1C"},
		{"MedId": "82216", "LawsonNumber": "227030", "LawsonDescription": "HEPARIN VL 5KU/ML 1 ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "7C3A"},
		{"MedId": "82620", "LawsonNumber": "253957", "LawsonDescription": "HEPARIN 25KU 0.45NACL 250ML", "UOM": "24 BAGS/CA", "Source": "INV", "OrderQty": 24, "Location": "13A2A"},
		{"MedId": "82418", "LawsonNumber": "200915", "LawsonDescription": "HEPATITIS B (DOH 1st) VACCINE", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "N/A"},
		{"MedId": "3176", "LawsonNumber": "101290", "LawsonDescription": "HEP-B IMMUNE GLOB VL 5ML", "UOM": "1 VIAL", "Source": "INV", "OrderQty": 1, "Location": "10A6F"},
		{"MedId": "859", "LawsonNumber": "201038", "LawsonDescription": "HYALURONIDASE VL 150U", "UOM": "4 VIALS/CT", "Source": "W/S", "OrderQty": 4, "Location": "N/A"},
		{"MedId": "4303", "LawsonNumber": "100626", "LawsonDescription": "HYDRALAZINE VL 20MG 1ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "4D3A"},
		{"MedId": "18298", "LawsonNumber": "105678", "LawsonDescription": "HYDRALAZINE TAB 10MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2D1C"},
		{"MedId": "37116", "LawsonNumber": "105687", "LawsonDescription": "HYDRALAZINE TAB 25MG U/D", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2D1D"},
		{"MedId": "37140", "LawsonNumber": "105686", "LawsonDescription": "HYDRALAZINE TAB 50MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2D1E"},
		{"MedId": "68290", "LawsonNumber": "222309", "LawsonDescription": "HCTZ CAP 12.5MG U/D", "UOM": "100 CAPS/BX", "Source": "INV", "OrderQty": 100, "Location": "2D1F"},
		{"MedId": "4907", "LawsonNumber": "105743", "LawsonDescription": "HCTZ TAB 25MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2D1G"},
		{"MedId": "35009", "LawsonNumber": "105567", "LawsonDescription": "HYDROCORT VL 100MG PF", "UOM": "48 VIALS/CT", "Source": "INV", "OrderQty": 48, "Location": "4D3B"},
		{"MedId": "8184", "LawsonNumber": "103212", "LawsonDescription": "HYDROCORT CR 1% 1OZ", "UOM": "12 TUBES", "Source": "INV", "OrderQty": 12, "Location": "1E2B"},
		{"MedId": "9137", "LawsonNumber": "105675", "LawsonDescription": "HYDROXYZINE TAB 10MG", "UOM": "100 TABS/BO", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "51446", "LawsonNumber": "245036", "LawsonDescription": "HYDROXYZINE PAM CAP 25MG", "UOM": "500 CAPS/BO", "Source": "INV", "OrderQty": 500, "Location": "2D1I"},
		{"MedId": "45668", "LawsonNumber": "245037", "LawsonDescription": "HYDROXYZINE PAM CAP 50MG", "UOM": "500 CAPS/BO", "Source": "INV", "OrderQty": 500, "Location": "2D1J"},
		{"MedId": "63987", "LawsonNumber": "201314", "LawsonDescription": "IBUPROFEN LIQ 5ML U/D", "UOM": "50 CUPS/CA", "Source": "INV", "OrderQty": 50, "Location": "6B2C"},
		{"MedId": "33251", "LawsonNumber": "254479", "LawsonDescription": "IBUPROFEN TAB 200MG UD", "UOM": "100 TABS/BX", "Source": "INV", "OrderQty": 100, "Location": "2D2A"},
		{"MedId": "23950", "LawsonNumber": "261022", "LawsonDescription": "IBUPROFEN TAB 400MG UD", "UOM": "750 TABS/BO", "Source": "INV", "OrderQty": 750, "Location": "7D1B"},
		{"MedId": "25825", "LawsonNumber": "261023", "LawsonDescription": "IBUPROFEN TAB 600MG UD", "UOM": "750 TABS/BO", "Source": "INV", "OrderQty": 750, "Location": "7D1C"},
		{"MedId": "56331", "LawsonNumber": "260650", "LawsonDescription": "IBUPROFEN TAB 800MG UD", "UOM": "750 TABS/BO", "Source": "INV", "OrderQty": 750, "Location": "7D1D"},
		{"MedId": "5339", "LawsonNumber": "104110", "LawsonDescription": "INDOMETHACIN CAP 25MG", "UOM": "100 CAPS/BO", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "98736", "LawsonNumber": "211289", "LawsonDescription": "INDOMETHACIN SUPP 50MG", "UOM": "30 SUPPS/BX", "Source": "INV", "OrderQty": 30, "Location": "10A7C"},
		{"MedId": "82795", "LawsonNumber": "263950", "LawsonDescription": "INFLUENZA TRI VAC 0.5ML", "UOM": "10 SYRINGES/CT", "Source": "INV", "OrderQty": 10, "Location": "11A2A"},
		{"MedId": "55585", "LawsonNumber": "200253", "LawsonDescription": "INSULIN NOVOLOG", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "10A7D"},
		{"MedId": "82178", "LawsonNumber": "206024", "LawsonDescription": "INSULIN DETEMIR VL 100U", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "10A8C"},
		{"MedId": "30631", "LawsonNumber": "200904", "LawsonDescription": "INSULIN NOVOLOG 70/30", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "10A7E"},
		{"MedId": "17897", "LawsonNumber": "105480", "LawsonDescription": "INSULIN NOVOLIN N", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "10A8A"},
		{"MedId": "17878", "LawsonNumber": "105479", "LawsonDescription": "INSULIN NOVOLIN R", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "10A8D"},
		{"MedId": "99754", "LawsonNumber": "104006", "LawsonDescription": "IODINE TINCTURE 2% PTS", "UOM": "1 BOTTLE", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "99090", "LawsonNumber": "215610", "LawsonDescription": "IPRATROPIUM NEB .5MG 2.5ML SGL", "UOM": "30 NEBS/CT", "Source": "INV", "OrderQty": 30, "Location": "1D1A"},
		{"MedId": "47023", "LawsonNumber": "102267", "LawsonDescription": "IRBESARTAN TAB 150MG", "UOM": "90 TABS/BO", "Source": "INV", "OrderQty": 90, "Location": "2D3B"},
		{"MedId": "14351", "LawsonNumber": "107040", "LawsonDescription": "IRON DEXTRAN VL 2ML", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "4D4E"},
		{"MedId": "54227", "LawsonNumber": "100683", "LawsonDescription": "IRON SUCROSE VL 20MG 5ML", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "4D4F"},
		{"MedId": "23886", "LawsonNumber": "100334", "LawsonDescription": "ISOPROTER AMP 1MG 5ML", "UOM": "10 AMPS/CT", "Source": "INV", "OrderQty": 10, "Location": "4D4G"},
		{"MedId": "39680", "LawsonNumber": "103381", "LawsonDescription": "ISOSORBIDE MONO 30MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2D3E"},
		{"MedId": "33797", "LawsonNumber": "103380", "LawsonDescription": "ISOSORBIDE MONO TAB 60MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2D3F"},
		{"MedId": "49038", "LawsonNumber": "107194", "LawsonDescription": "KETOROLAC VL 15MG", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "4D5A"},
		{"MedId": "98883", "LawsonNumber": "100355", "LawsonDescription": "KETOROLAC VL 30MG 1ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "4D5B"},
		{"MedId": "98932", "LawsonNumber": "101550", "LawsonDescription": "KETOROLAC VL 60MG", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "4D4H"},
		{"MedId": "98852", "LawsonNumber": "100305", "LawsonDescription": "DRUG LABETALOL VL 100MG 20ML", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "4D6A"},
		{"MedId": "25681", "LawsonNumber": "105723", "LawsonDescription": "LABETALOL TAB 100MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2D3G"},
		{"MedId": "23480", "LawsonNumber": "105724", "LawsonDescription": "LABETALOL TAB 200MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2D3H"},
		{"MedId": "51941", "LawsonNumber": "104884", "LawsonDescription": "LACTOBICILLUS CAP", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "2D3J"},
		{"MedId": "19028", "LawsonNumber": "229175", "LawsonDescription": "LACTULOSE LIQ 30ML", "UOM": "10 CUPS/CT", "Source": "INV", "OrderQty": 10, "Location": "6B3B"},
		{"MedId": "41345", "LawsonNumber": "103574", "LawsonDescription": "LAMOTRIGINE TAB 100MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2D4C"},
		{"MedId": "55020", "LawsonNumber": "104870", "LawsonDescription": "LANOLIN TENDER CARE 0.3OZ", "UOM": "50 TUBES/CA", "Source": "INV", "OrderQty": 50, "Location": "1E3A"},
		{"MedId": "41705", "LawsonNumber": "105578", "LawsonDescription": "LATANOPROST OPH SOL 2.5ML", "UOM": "12 BOTTLES", "Source": "INV", "OrderQty": 12, "Location": "10C1A"},
		{"MedId": "55239", "LawsonNumber": "208965", "LawsonDescription": "LEUPROLIDE INJ 11.25MG", "UOM": "1 INJECTIOIN", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "59061", "LawsonNumber": "218092", "LawsonDescription": "LEUPROLIDE KIT 30MG", "UOM": "I KIT", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "52771", "LawsonNumber": "107862", "LawsonDescription": "LEUPROLIDE INJ 22.5MG", "UOM": "1 SYRINGE", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "29646", "LawsonNumber": "106453", "LawsonDescription": "LEUPROLIDE INJ 3.75MG", "UOM": "1 SYRINGE", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "19528", "LawsonNumber": "106454", "LawsonDescription": "LEUPROLIDE INJ 7.5MG", "UOM": "1 SYRINGE", "Source": "INV", "OrderQty": 1, "Location": "4E2A"},
		{"MedId": "52602", "LawsonNumber": "230252", "LawsonDescription": "LEVETIRACETAM TAB 500MG U/D", "UOM": "100 TABS/BX", "Source": "INV", "OrderQty": 100, "Location": "2D4I"},
		{"MedId": "67818", "LawsonNumber": "208147", "LawsonDescription": "LEVETIRACETAM VL 500MG", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "4E2B"},
		{"MedId": "42846", "LawsonNumber": "104719", "LawsonDescription": "LEVOFLOXACIN TAB 250MG", "UOM": "100 TABS/BX", "Source": "INV", "OrderQty": 100, "Location": "2D4K"},
		{"MedId": "42843", "LawsonNumber": "104741", "LawsonDescription": "LEVOFLOXACIN PB 250MG", "UOM": "24 BAGS/BX", "Source": "INV", "OrderQty": 24, "Location": "7D1E"},
		{"MedId": "42848", "LawsonNumber": "265425", "LawsonDescription": "LEVOFLOXACIN TAB 500MG", "UOM": "100 TABS/BX", "Source": "INV", "OrderQty": 100, "Location": "2D4L"},
		{"MedId": "42844", "LawsonNumber": "104722", "LawsonDescription": "LEVOFLOXACIN MB 500MG 100", "UOM": "24 BAGS/CA", "Source": "INV", "OrderQty": 24, "Location": "7D2A"},
		{"MedId": "99268", "LawsonNumber": "243460", "LawsonDescription": "LEVOFLOXACIN TAB 750MG", "UOM": "100 TABS/BX", "Source": "INV", "OrderQty": 100, "Location": "2D4M"},
		{"MedId": "54065", "LawsonNumber": "104743", "LawsonDescription": "LEVOFLOXACIN PB 750MG", "UOM": "24 BAGS/CA", "Source": "INV", "OrderQty": 24, "Location": "7D4A"},
		{"MedId": "82148", "LawsonNumber": "258272", "LawsonDescription": "LEVONORGESTREL TAB 1.5MG", "UOM": "1 TAB/BX", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "6686", "LawsonNumber": "103458", "LawsonDescription": "LEVOTHYRO TAB 100MCG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2D5E"},
		{"MedId": "18508", "LawsonNumber": "103460", "LawsonDescription": "LEVOTHYROX TAB 112MCG", "UOM": "90 TABS/BO", "Source": "INV", "OrderQty": 90, "Location": "2D5F"},
		{"MedId": "98748", "LawsonNumber": "103467", "LawsonDescription": "LEVOTHYROX TAB 125MCG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2D5G"},
		{"MedId": "64357", "LawsonNumber": "208284", "LawsonDescription": "LEVOTHYROX TAB 137MCG", "UOM": "90 TABS/BO", "Source": "INV", "OrderQty": 90, "Location": "2D5H"},
		{"MedId": "6778", "LawsonNumber": "103455", "LawsonDescription": "LEVOTHYROX TAB 150MCG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2D5I"},
		{"MedId": "60381", "LawsonNumber": "211731", "LawsonDescription": "LEVOTHYROX TAB 175MCG", "UOM": "90 TABS/BO", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "98745", "LawsonNumber": "103456", "LawsonDescription": "LEVOTHYROX TAB 25MCG", "UOM": "90 TABS/BO", "Source": "INV", "OrderQty": 90, "Location": "2D5A"},
		{"MedId": "6588", "LawsonNumber": "103457", "LawsonDescription": "LEVOTHYROX TAB 50MCG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2D5B"},
		{"MedId": "98746", "LawsonNumber": "103470", "LawsonDescription": "LEVOTHYROX TAB 75MCG", "UOM": "100 TABS/BX", "Source": "INV", "OrderQty": 100, "Location": "2D5C"},
		{"MedId": "30036", "LawsonNumber": "103459", "LawsonDescription": "LEVOTHYROX TAB 88MCG", "UOM": "90 TABS/BO", "Source": "INV", "OrderQty": 90, "Location": "2D5D"},
		{"MedId": "12797", "LawsonNumber": "229139", "LawsonDescription": "LIDOCAINE VL 1% 20ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "7E1A"},
		{"MedId": "32880", "LawsonNumber": "100320", "LawsonDescription": "LIDOCAINE W/EPI 1% 20ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "4E4A"},
		{"MedId": "15650", "LawsonNumber": "265212", "LawsonDescription": "LIDOCAINE 1% W/EPI VL 30ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "4E3C"},
		{"MedId": "44959", "LawsonNumber": "100338", "LawsonDescription": "LIDOCAINE 2% SYR 100MG/5M", "UOM": "10 SYR/CT", "Source": "INV", "OrderQty": 10, "Location": "7F1A"},
		{"MedId": "56229", "LawsonNumber": "100323", "LawsonDescription": "LIDOCAINE VL 2% 20ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "7E3A"},
		{"MedId": "32881", "LawsonNumber": "100321", "LawsonDescription": "LIDOCAINE W/EPI 2% 20ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "4E5A"},
		{"MedId": "17438", "LawsonNumber": "257248", "LawsonDescription": "LIDOCAINE 2% W/EPI 20ML SDV", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "4E5B"},
		{"MedId": "99303", "LawsonNumber": "103419", "LawsonDescription": "LMX 5 GM TUBE", "UOM": "5 TUBES/CT", "Source": "INV", "OrderQty": 5, "Location": "1E5B"},
		{"MedId": "82298", "LawsonNumber": "100285", "LawsonDescription": "KIT LARYNGOTRACHEAL ANES", "UOM": "25 KITS/CA", "Source": "INV", "OrderQty": 25, "Location": "7F2A"},
		{"MedId": "52234", "LawsonNumber": "103317", "LawsonDescription": "LIDOCAINE PATCH 700MG", "UOM": "30 PATCH/BX", "Source": "INV", "OrderQty": 30, "Location": "1E5A"},
		{"MedId": "31691", "LawsonNumber": "100817", "LawsonDescription": "LIDOCAINE JELLY 2% 30GM", "UOM": "12 TUBES", "Source": "INV", "OrderQty": 12, "Location": "1E3B"},
		{"MedId": "23040", "LawsonNumber": "105878", "LawsonDescription": "LIDOCAINE TOP SOL 4% 50ML", "UOM": "1  BOTTLE", "Source": "INV", "OrderQty": 1, "Location": "1E4B"},
		{"MedId": "7688", "LawsonNumber": "105881", "LawsonDescription": "LIDOCAINE VISC 2% 100ML", "UOM": "1 BOTTLE", "Source": "INV", "OrderQty": 1, "Location": "6B5A"},
		{"MedId": "33587", "LawsonNumber": "107904", "LawsonDescription": "EMLA CREAM ER PYXIS", "UOM": "5 TUBES/BX", "Source": "INV", "OrderQty": 5, "Location": "1D6E"},
		{"MedId": "6089", "LawsonNumber": "222306", "LawsonDescription": "LISINOPRIL TAB 10MG U/D", "UOM": "100 TABS/BX", "Source": "INV", "OrderQty": 100, "Location": "2D6A"},
		{"MedId": "18568", "LawsonNumber": "104120", "LawsonDescription": "LISINOPRIL TAB 20MG", "UOM": "500 TABS/BO", "Source": "INV", "OrderQty": 500, "Location": "2D6B"},
		{"MedId": "6106", "LawsonNumber": "254131", "LawsonDescription": "LISINOPRIL TAB 5MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2D5K"},
		{"MedId": "9274", "LawsonNumber": "105387", "LawsonDescription": "LOPERAMIDE CAP 2MG", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "2D6D"},
		{"MedId": "33585", "LawsonNumber": "254321", "LawsonDescription": "LORATADINE TAB 10MG", "UOM": "300 TABS/BO", "Source": "INV", "OrderQty": 300, "Location": "2D6E"},
		{"MedId": "38291", "LawsonNumber": "105302", "LawsonDescription": "LOSARTAN TAB 25MG", "UOM": "90 TABS/BO", "Source": "INV", "OrderQty": 90, "Location": "2D6G"},
		{"MedId": "38294", "LawsonNumber": "257940", "LawsonDescription": "LOSARTAN TAB 50MG", "UOM": "1000 TABS/BO", "Source": "INV", "OrderQty": 1000, "Location": "2D6H"},
		{"MedId": "98599", "LawsonNumber": "104907", "LawsonDescription": "MAGNESIUM 500MG (SLO-MAG)", "UOM": "60 TABS/BO", "Source": "INV", "OrderQty": 60, "Location": "2D6J"},
		{"MedId": "43489", "LawsonNumber": "105871", "LawsonDescription": "MAG OXIDE TAB 400MG", "UOM": "120 TABS/BO", "Source": "INV", "OrderQty": 120, "Location": "2D6K"},
		{"MedId": "53804", "LawsonNumber": "201178", "LawsonDescription": "MAG HYDROX PLUS 30ML", "UOM": "10 CUPS/SLEEVE", "Source": "INV", "OrderQty": 10, "Location": "7F4A"},
		{"MedId": "49714", "LawsonNumber": "100688", "LawsonDescription": "DRUG MANNITOL VL 25 50ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "4F2B"},
		{"MedId": "2012", "LawsonNumber": "216573", "LawsonDescription": "SOL MANNITOL 20% IV 500ML", "UOM": "None", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "40328", "LawsonNumber": "105280", "LawsonDescription": "MMR II VL (MEAS/MUMP/RUB", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "10C2A"},
		{"MedId": "37540", "LawsonNumber": "105522", "LawsonDescription": "MECLIZINE TAB 12.5MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2E1A"},
		{"MedId": "33524", "LawsonNumber": "105582", "LawsonDescription": "DEPO PROVERA VL 150MG/1ML", "UOM": "1 VIAL", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "82378", "LawsonNumber": "240470", "LawsonDescription": "MELATONIN TAB 3MG", "UOM": "60 TABLETS/BO", "Source": "INV", "OrderQty": 60, "Location": "2E1B"},
		{"MedId": "98689", "LawsonNumber": "102739", "LawsonDescription": "MELPHALEN TAB 2MG", "UOM": "50 TABS/BO", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "82618", "LawsonNumber": "253952", "LawsonDescription": "MEMANTINE XR CAP 14MG", "UOM": "30 CAPS/BO", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "82619", "LawsonNumber": "257831", "LawsonDescription": "MEMANTINE XR CAP 28MG", "UOM": "30 CAPS/BO", "Source": "INV", "OrderQty": 30, "Location": "2E1D"},
		{"MedId": "82617", "LawsonNumber": "253951", "LawsonDescription": "MEMANTINE XR CAP 7 MG", "UOM": "30 CAPS/BO", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "29881", "LawsonNumber": "100863", "LawsonDescription": "MENINGOCOCCAL VAC VL", "UOM": "1 VIAL", "Source": "INV", "OrderQty": 1, "Location": "10C1C"},
		{"MedId": "18027", "LawsonNumber": "107800", "LawsonDescription": "CEPACOL LOZENGE 384/BX", "UOM": "384 LOZ/BX", "Source": "INV", "OrderQty": 384, "Location": "2B2F"},
		{"MedId": "54969", "LawsonNumber": "100341", "LawsonDescription": "MEPIVACAINE VL 1%  30ML", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "4F3A"},
		{"MedId": "55117", "LawsonNumber": "100382", "LawsonDescription": "MEPIVACAINE VL 2% 20ML", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "4F3B"},
		{"MedId": "99107", "LawsonNumber": "105713", "LawsonDescription": "MESALAMINE EC CAP 400MG", "UOM": "180 CAPS/BO", "Source": "INV", "OrderQty": 180, "Location": "2E1E"},
		{"MedId": "37948", "LawsonNumber": "107852", "LawsonDescription": "METFORMIN TAB 500MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2E1G"},
		{"MedId": "60474", "LawsonNumber": "104109", "LawsonDescription": "METHYLDOPA TAB 250MG", "UOM": "100 TABS/BX", "Source": "INV", "OrderQty": 100, "Location": "2E2C"},
		{"MedId": "12391", "LawsonNumber": "107454", "LawsonDescription": "METHYLENE  BL VL 1% 10ML", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "4F4B"},
		{"MedId": "20063", "LawsonNumber": "250379", "LawsonDescription": "METHERGINE AMP 1ML", "UOM": "10 AMPS/CT", "Source": "INV", "OrderQty": 10, "Location": "10C1D"},
		{"MedId": "85057", "LawsonNumber": "216553", "LawsonDescription": "METHYLNALTREXONE VL 12MG", "UOM": "1 VIAL", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "316", "LawsonNumber": "105561", "LawsonDescription": "METHYLPRED (DEPO) 40MG/ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "4F6B"},
		{"MedId": "7824", "LawsonNumber": "105562", "LawsonDescription": "METHYLPRED (DEPO) 80MG/ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "4F6C"},
		{"MedId": "35015", "LawsonNumber": "100359", "LawsonDescription": "METHYLPRED VL 125MG", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "4F6D"},
		{"MedId": "35016", "LawsonNumber": "100307", "LawsonDescription": "METHYLPRED VL 40MG 2ML", "UOM": "25 VIALS/BX", "Source": "INV", "OrderQty": 25, "Location": "4F5A"},
		{"MedId": "17083", "LawsonNumber": "105650", "LawsonDescription": "METOCLOPRAM LIQ 10MG U/D", "UOM": "10 CUPS/SLEEVE", "Source": "INV", "OrderQty": 10, "Location": "6B5C"},
		{"MedId": "4414", "LawsonNumber": "105994", "LawsonDescription": "DRUG METOCLOPRAM VL 10MG 2ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "5A1A"},
		{"MedId": "53090", "LawsonNumber": "105680", "LawsonDescription": "METOCLOPRAM TAB 10MG", "UOM": "1000 TABS/BO", "Source": "INV", "OrderQty": 1000, "Location": "2E2G"},
		{"MedId": "13895", "LawsonNumber": "100418", "LawsonDescription": "METOPROLOL VL 5MG 5ML", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "8B1A"},
		{"MedId": "99092", "LawsonNumber": "100821", "LawsonDescription": "METOPROLOL TAB XL 100MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2E4D"},
		{"MedId": "99278", "LawsonNumber": "253118", "LawsonDescription": "METOPROLOL TAB XL 25MG", "UOM": "1000 TAB/BO", "Source": "INV", "OrderQty": 1000, "Location": "2E3D"},
		{"MedId": "99091", "LawsonNumber": "252552", "LawsonDescription": "METOPROLOL TAB XL 50MG", "UOM": "1000 TAB/BO", "Source": "INV", "OrderQty": 1000, "Location": "2E4B"},
		{"MedId": "36872", "LawsonNumber": "107969", "LawsonDescription": "METOPROLOL TAB 100MG", "UOM": "1000 TABS/BO", "Source": "INV", "OrderQty": 1000, "Location": "2E4C"},
		{"MedId": "99495", "LawsonNumber": "255392", "LawsonDescription": "METOPROLOL TAB 25MG", "UOM": "500 TABS/BO", "Source": "INV", "OrderQty": 500, "Location": "2E3C"},
		{"MedId": "36868", "LawsonNumber": "107968", "LawsonDescription": "METOPROLOL TAB 50MG", "UOM": "1000 TABS/BO", "Source": "INV", "OrderQty": 1000, "Location": "2E4A"},
		{"MedId": "3160", "LawsonNumber": "101249", "LawsonDescription": "METRONIDAZ PB 500MG 100ML", "UOM": "24 BAGS/BX", "Source": "INV", "OrderQty": 24, "Location": "8A1A"},
		{"MedId": "5636", "LawsonNumber": "105684", "LawsonDescription": "METRONIDAZ TAB 500MG", "UOM": "500 TABS/BO", "Source": "INV", "OrderQty": 500, "Location": "2E5B"},
		{"MedId": "99021", "LawsonNumber": "105422", "LawsonDescription": "MICONAZOLE 2% PWD1.5OZ.", "UOM": "12 BO/CA", "Source": "INV", "OrderQty": 12, "Location": "1E6C"},
		{"MedId": "33212", "LawsonNumber": "103219", "LawsonDescription": "MICONAZOLE CR 2% 30GM", "UOM": "6 TUBES", "Source": "INV", "OrderQty": 6, "Location": "1E6B"},
		{"MedId": "42948", "LawsonNumber": "257247", "LawsonDescription": "MIDODRINE TAB 5MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2E5D"},
		{"MedId": "97058", "LawsonNumber": "201179", "LawsonDescription": "MILK OF MAG 30ML", "UOM": "10 CUPS/SLEEVE", "Source": "INV", "OrderQty": 10, "Location": "8B4A"},
		{"MedId": "33417", "LawsonNumber": "100644", "LawsonDescription": "MILRINONE VL  10ML10MG", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "5A3B"},
		{"MedId": "17098", "LawsonNumber": "200368", "LawsonDescription": "MINERAL OIL STERILE 25ML", "UOM": "25 VIALS/PK", "Source": "INV", "OrderQty": 25, "Location": "5A3D"},
		{"MedId": "41587", "LawsonNumber": "222388", "LawsonDescription": "MIRTAZAPINE TAB 15MG U/D", "UOM": "100 TABS/BX", "Source": "INV", "OrderQty": 100, "Location": "2E5H"},
		{"MedId": "41589", "LawsonNumber": "254370", "LawsonDescription": "MIRTAZAPINE TAB 30MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2E5I"},
		{"MedId": "48082", "LawsonNumber": "256176", "LawsonDescription": "MONTELUKAST TAB 10MG", "UOM": "500 TABS/BO", "Source": "INV", "OrderQty": 500, "Location": "2E6A"},
		{"MedId": "82157", "LawsonNumber": "223349", "LawsonDescription": "MOXIFLOXACIN TAB 400MG", "UOM": "30 TABS/BO", "Source": "INV", "OrderQty": 30, "Location": "2E6B"},
		{"MedId": "17130", "LawsonNumber": "104945", "LawsonDescription": "MULTIVITE/M VIT TAB", "UOM": "1000 TAB/BO", "Source": "INV", "OrderQty": 1000, "Location": "2E6D"},
		{"MedId": "24891", "LawsonNumber": "104130", "LawsonDescription": "MULTIVIT W/ZINC TAB", "UOM": "60 TABS/BO", "Source": "INV", "OrderQty": 60, "Location": "2E6E"},
		{"MedId": "17134", "LawsonNumber": "104903", "LawsonDescription": "MULTIVIT THERAP TAB", "UOM": "1000 TABS/BO", "Source": "INV", "OrderQty": 1000, "Location": "2E6C"},
		{"MedId": "6744", "LawsonNumber": "106507", "LawsonDescription": "MUPIROCIN OINT 2% 22GM", "UOM": "6 TUBES", "Source": "INV", "OrderQty": 6, "Location": "1F1A"},
		{"MedId": "82601", "LawsonNumber": "253056", "LawsonDescription": "NALBUPHINE 20MG/ML SDV", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "5A5A"},
		{"MedId": "57583", "LawsonNumber": "265058", "LawsonDescription": "NALOXONE VL 0.4MG/1ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "5A5B"},
		{"MedId": "6818", "LawsonNumber": "103318", "LawsonDescription": "NALOXONE SYR 2MG 2ML", "UOM": "10 EA/CT", "Source": "INV", "OrderQty": 10, "Location": "5A5C"},
		{"MedId": "39942", "LawsonNumber": "104931", "LawsonDescription": "NAPROSYN TAB 500MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2E6G"},
		{"MedId": "45933", "LawsonNumber": "104823", "LawsonDescription": "NIACIN TAB SR 500MG", "UOM": "90 TABS/BO", "Source": "INV", "OrderQty": 90, "Location": "2F1E"},
		{"MedId": "51505", "LawsonNumber": "105425", "LawsonDescription": "NICOTINE PATCH 14MG", "UOM": "14 PATCH/BX", "Source": "INV", "OrderQty": 14, "Location": "1F3B"},
		{"MedId": "41382", "LawsonNumber": "105423", "LawsonDescription": "NICOTINE PATCH 21MG", "UOM": "14 PATCH/BX", "Source": "INV", "OrderQty": 14, "Location": "1F3C"},
		{"MedId": "51504", "LawsonNumber": "255939", "LawsonDescription": "NICOTINE PATCH 7MG", "UOM": "14 PATCH/BX", "Source": "INV", "OrderQty": 14, "Location": "1F3A"},
		{"MedId": "3142", "LawsonNumber": "105737", "LawsonDescription": "NIFEDIPINE CAP 10MG", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "2F1F"},
		{"MedId": "58453", "LawsonNumber": "209427", "LawsonDescription": "PROCARDIA (GEQ) TAB XL 30MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3A2A"},
		{"MedId": "63629", "LawsonNumber": "264002", "LawsonDescription": "PROCARDIA XL TAB 60MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3A2B"},
		{"MedId": "82753", "LawsonNumber": "264003", "LawsonDescription": "PROCARDIA XL TAB 90MG", "UOM": "80 TABS/BO", "Source": "INV", "OrderQty": 80, "Location": "3A2C"},
		{"MedId": "3959", "LawsonNumber": "104107", "LawsonDescription": "NITROFURAN CAP 100MG (BID)", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "2F1K"},
		{"MedId": "799", "LawsonNumber": "224194", "LawsonDescription": "NITROGLY OINT 2% FOIL PK", "UOM": "48 EA/CT", "Source": "INV", "OrderQty": 48, "Location": "1F4A"},
		{"MedId": "98931", "LawsonNumber": "245883", "LawsonDescription": "NITROGLY 25MG/D5W 250ML", "UOM": "12 BO/CA", "Source": "INV", "OrderQty": 12, "Location": "8B5B"},
		{"MedId": "82551", "LawsonNumber": "250511", "LawsonDescription": "NITROGLY 50MG/D5W 250ML", "UOM": "12 BO/CA", "Source": "INV", "OrderQty": 12, "Location": "12A4A"},
		{"MedId": "17220", "LawsonNumber": "103425", "LawsonDescription": "NITROLINGUAL SPR .4MG", "UOM": "1 BOTTLE", "Source": "INV", "OrderQty": 1, "Location": "1F4B"},
		{"MedId": "23324", "LawsonNumber": "103373", "LawsonDescription": "NITROGLY SL 0.4MG (BO OF25)", "UOM": "4 BOTTLES/BX", "Source": "INV", "OrderQty": 4, "Location": "2F2A"},
		{"MedId": "60327", "LawsonNumber": "229138", "LawsonDescription": "NYSTATIN SUSP 5ML", "UOM": "10 CUPS/CT", "Source": "INV", "OrderQty": 10, "Location": "6B6A"},
		{"MedId": "22062", "LawsonNumber": "236671", "LawsonDescription": "NYSTATIN CR 15GM", "UOM": "12 TUBES", "Source": "INV", "OrderQty": 12, "Location": "1F4C"},
		{"MedId": "19151", "LawsonNumber": "105468", "LawsonDescription": "OCTREOTIDE VL 100MCG 1ML", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "10C3A"},
		{"MedId": "19147", "LawsonNumber": "105471", "LawsonDescription": "OCTREOTIDE 50MCG 1ML", "UOM": "10 VI/CT", "Source": "INV", "OrderQty": 10, "Location": "10C2C"},
		{"MedId": "62276", "LawsonNumber": "223048", "LawsonDescription": "OCTREOTIDE LAR SYR 30MG", "UOM": "1 SYRINGE", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "41932", "LawsonNumber": "103299", "LawsonDescription": "OLANZAPINE TAB 10MG", "UOM": "30 TABS/BO", "Source": "INV", "OrderQty": 30, "Location": "2F2G"},
		{"MedId": "61205", "LawsonNumber": "103307", "LawsonDescription": "OLANZAPINE VL 10MG", "UOM": "1 VIAL", "Source": "INV", "OrderQty": 1, "Location": "5B2B"},
		{"MedId": "45361", "LawsonNumber": "103296", "LawsonDescription": "OLANZAPINE TAB 2.5MG", "UOM": "30 TABS/BO", "Source": "INV", "OrderQty": 30, "Location": "2F2C"},
		{"MedId": "42922", "LawsonNumber": "103295", "LawsonDescription": "OLANZAPINE TAB 5MG", "UOM": "30 TABS/BO", "Source": "INV", "OrderQty": 30, "Location": "2F2E"},
		{"MedId": "53822", "LawsonNumber": "103308", "LawsonDescription": "OLANZAPINE DISIN TAB 5MG", "UOM": "30 TABS/BX", "Source": "INV", "OrderQty": 30, "Location": "2F2D"},
		{"MedId": "98953", "LawsonNumber": "208846", "LawsonDescription": "ONDANSETRON VL 4MG 2ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "5B3A"},
		{"MedId": "50661", "LawsonNumber": "208981", "LawsonDescription": "ONDANSETRON TAB 4MG", "UOM": "30 TABS/BO", "Source": "INV", "OrderQty": 30, "Location": "2F3D"},
		{"MedId": "50662", "LawsonNumber": "264161", "LawsonDescription": "ONDANSETRON TAB 8 MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2F3E"},
		{"MedId": "99583", "LawsonNumber": "209047", "LawsonDescription": "ONDANSETRON OD TAB 4MG", "UOM": "30 TABS/BO", "Source": "INV", "OrderQty": 30, "Location": "2F3C"},
		{"MedId": "8342", "LawsonNumber": "105685", "LawsonDescription": "OXYBUTYNIN TAB 5MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2F3F"},
		{"MedId": "56611", "LawsonNumber": "100622", "LawsonDescription": "OXYTOCIN VL 10U 1ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "5B6C"},
		{"MedId": "82251", "LawsonNumber": "230825", "LawsonDescription": "PANCRELIPASE CAP 24KU", "UOM": "250 CAPS/BO", "Source": "INV", "OrderQty": 250, "Location": "2F3J"},
		{"MedId": "82266", "LawsonNumber": "107156", "LawsonDescription": "PANTOPRAZOLE VL 40MG", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "5C1A"},
		{"MedId": "82266", "LawsonNumber": "256607", "LawsonDescription": "PANTOPRAZOLE VL 40MG", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "N/A"},
		{"MedId": "52743", "LawsonNumber": "263256", "LawsonDescription": "PANTOPRAZOLE TAB 40MG", "UOM": "1000 TABS/BO", "Source": "INV", "OrderQty": 1000, "Location": "2F4B"},
		{"MedId": "32890", "LawsonNumber": "249054", "LawsonDescription": "PAPAVERINE VL 60MG 2ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "5C4A"},
		{"MedId": "55908", "LawsonNumber": "100421", "LawsonDescription": "PARICALCITOL VL 2MCG 1ML", "UOM": "25 VIALS/CT", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "40540", "LawsonNumber": "105529", "LawsonDescription": "PAROXETINE TAB 10MG", "UOM": "100 TABS/BO", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "33494", "LawsonNumber": "105525", "LawsonDescription": "PAROXETINE TAB 20MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2F4E"},
		{"MedId": "33498", "LawsonNumber": "100777", "LawsonDescription": "PAROXETINE TAB 30MG", "UOM": "100 TABS/BX", "Source": "INV", "OrderQty": 100, "Location": "2F4F"},
		{"MedId": "40541", "LawsonNumber": "229142", "LawsonDescription": "PAROXETINE TAB 40MG", "UOM": "100 TABS/BX", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "99301", "LawsonNumber": "265211", "LawsonDescription": "PEG BOWEL 17GM", "UOM": "100 PCKT/CT", "Source": "INV", "OrderQty": 100, "Location": "6C1A"},
		{"MedId": "64771", "LawsonNumber": "105374", "LawsonDescription": "PCN/BENZATHINE LA 1.2MU", "UOM": "10 SYR/CT", "Source": "W/S", "OrderQty": 10, "Location": "N/A"},
		{"MedId": "63571", "LawsonNumber": "105365", "LawsonDescription": "PCN/BENZATHINE LA 2.4MU", "UOM": "10 SYR/CT", "Source": "W/S", "OrderQty": 10, "Location": "N/A"},
		{"MedId": "16436", "LawsonNumber": "107803", "LawsonDescription": "PEN VK TAB 500MG", "UOM": "100 TABS/BO", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "82675", "LawsonNumber": "256608", "LawsonDescription": "PHENAZOPYRIDINE TAB 95MG", "UOM": "30 TABS/BO", "Source": "INV", "OrderQty": 30, "Location": "2F5D"},
		{"MedId": "14112", "LawsonNumber": "105966", "LawsonDescription": "PHENYLEPH NAS SP .25%15ML", "UOM": "1 BOTTLE", "Source": "INV", "OrderQty": 1, "Location": "1D2B"},
		{"MedId": "2090", "LawsonNumber": "101281", "LawsonDescription": "PHENYLEPH NAS SP .5 15ML", "UOM": "1 BOTTLE", "Source": "INV", "OrderQty": 1, "Location": "1D2C"},
		{"MedId": "6740", "LawsonNumber": "105550", "LawsonDescription": "PHENYLEPH DROP 1% 30ML", "UOM": "1 BOTTLE", "Source": "INV", "OrderQty": 1, "Location": "1D2A"},
		{"MedId": "14286", "LawsonNumber": "107960", "LawsonDescription": "PHYSOSTIGMINE AMP 2MG 2ML", "UOM": "10 AMPS/CT", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "58619", "LawsonNumber": "100345", "LawsonDescription": "DRUG VIT K AMP 10MG 1ML", "UOM": "25 AMPS/CT", "Source": "INV", "OrderQty": 25, "Location": "5F4A"},
		{"MedId": "98796", "LawsonNumber": "105292", "LawsonDescription": "PHYTONADIONE TAB 5MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2F5F"},
		{"MedId": "5207", "LawsonNumber": "105317", "LawsonDescription": "PNEUMOCOCCOL VAC VL", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "10C5A"},
		{"MedId": "6753", "LawsonNumber": "101547", "LawsonDescription": "POLYMIXIN B VL 500000U", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "5C5C"},
		{"MedId": "52606", "LawsonNumber": "103131", "LawsonDescription": "PORACTANT VL 1.5ML", "UOM": "1 VIAL", "Source": "INV", "OrderQty": 1, "Location": "10C5C"},
		{"MedId": "52607", "LawsonNumber": "103130", "LawsonDescription": "PORACTANT VL 3ML", "UOM": "1 VIAL", "Source": "INV", "OrderQty": 1, "Location": "10C5D"},
		{"MedId": "20817", "LawsonNumber": "218742", "LawsonDescription": "POT CHL TAB 10MEQ", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2F6A"},
		{"MedId": "97059", "LawsonNumber": "105640", "LawsonDescription": "POT CHL LIQ 40MEQ/30ML UD", "UOM": "10 CUPS/SLEEVE", "Source": "INV", "OrderQty": 10, "Location": "6C2C"},
		{"MedId": "57011", "LawsonNumber": "230070", "LawsonDescription": "POT CHL TAB SR 20MEQ", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2F6B"},
		{"MedId": "98792", "LawsonNumber": "106986", "LawsonDescription": "POT CHL PKT 20MEQ", "UOM": "30 PKTS/CT", "Source": "INV", "OrderQty": 30, "Location": "6C3B"},
		{"MedId": "32390", "LawsonNumber": "102257", "LawsonDescription": "PRAVASTATIN TAB 20MG", "UOM": "90 TABS/BO", "Source": "INV", "OrderQty": 90, "Location": "3A1B"},
		{"MedId": "82355", "LawsonNumber": "238255", "LawsonDescription": "PRAVASTATIN TAB 40MG", "UOM": "90 TABLETS/BO", "Source": "INV", "OrderQty": 90, "Location": "3A1C"},
		{"MedId": "82356", "LawsonNumber": "238256", "LawsonDescription": "PRAVASTATIN TAB 80MG", "UOM": "90 TABLETS/BO", "Source": "INV", "OrderQty": 90, "Location": "3A1D"},
		{"MedId": "98987", "LawsonNumber": "103379", "LawsonDescription": "PREDNISOLONE LIQ 15MG/5ML BULK", "UOM": "1 BOTTLE", "Source": "INV", "OrderQty": 1, "Location": "6C3C"},
		{"MedId": "23669", "LawsonNumber": "105887", "LawsonDescription": "PREDNISONE TAB 10MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3A1I"},
		{"MedId": "13556", "LawsonNumber": "105899", "LawsonDescription": "PREDNISONE TAB 20MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3A1J"},
		{"MedId": "7838", "LawsonNumber": "105757", "LawsonDescription": "PREDNISONE TAB 5MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3A1H"},
		{"MedId": "82766", "LawsonNumber": "264369", "LawsonDescription": "PRENATAL VIT W/ IODINE", "UOM": "90 TABS/BO", "Source": "INV", "OrderQty": 90, "Location": "3A1L"},
		{"MedId": "4421", "LawsonNumber": "101064", "LawsonDescription": "PROCHLORPER 10MG INJ", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "5D1A"},
		{"MedId": "40630", "LawsonNumber": "106931", "LawsonDescription": "PROCHLORPERAZINE TAB 10MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3A2D"},
		{"MedId": "98787", "LawsonNumber": "105509", "LawsonDescription": "PROCHLORPER SUPP 25MG", "UOM": "12 SUPP/BX", "Source": "INV", "OrderQty": 12, "Location": "1B2H"},
		{"MedId": "23418", "LawsonNumber": "101063", "LawsonDescription": "PROMETHAZINE VL  25MG", "UOM": "25 VIALS/BX", "Source": "INV", "OrderQty": 25, "Location": "5D1B"},
		{"MedId": "98814", "LawsonNumber": "103808", "LawsonDescription": "PROMETHAZINE SUPP 25MG", "UOM": "12 SUPP/BX", "Source": "INV", "OrderQty": 12, "Location": "10C6A"},
		{"MedId": "20110", "LawsonNumber": "107024", "LawsonDescription": "PROMETHAZINE TAB 25MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3A2E"},
		{"MedId": "99669", "LawsonNumber": "103414", "LawsonDescription": "PROPARACAINE OPH .5% 15ML", "UOM": "1 BOTTLE", "Source": "INV", "OrderQty": 1, "Location": "10C6B"},
		{"MedId": "33914", "LawsonNumber": "101086", "LawsonDescription": "PROPOFOL VL 100ML", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "8F1A"},
		{"MedId": "18469", "LawsonNumber": "100627", "LawsonDescription": "PROPRAN VL 1MG 1ML", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "5D1C"},
		{"MedId": "48661", "LawsonNumber": "100621", "LawsonDescription": "PROTAMINE VL 50MG/5ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "5D2C"},
		{"MedId": "99200", "LawsonNumber": "107971", "LawsonDescription": "PSYLLIUM S/F INSTANT U/D", "UOM": "30 PACKETS/BX", "Source": "INV", "OrderQty": 30, "Location": "3A2I"},
		{"MedId": "29441", "LawsonNumber": "105936", "LawsonDescription": "PYRIDOSTIG AMP 5MG/ML", "UOM": "10 AMPS/CT", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "35960", "LawsonNumber": "107943", "LawsonDescription": "PYRIDOXINE TAB 50MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3A2K"},
		{"MedId": "46537", "LawsonNumber": "100828", "LawsonDescription": "QUETIAPINE TAB 100MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3A3C"},
		{"MedId": "46538", "LawsonNumber": "107982", "LawsonDescription": "QUETIAPINE TAB 200MG U/D", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3A3D"},
		{"MedId": "46540", "LawsonNumber": "100827", "LawsonDescription": "QUETIAPINE TAB 25MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3A3A"},
		{"MedId": "54347", "LawsonNumber": "205070", "LawsonDescription": "QUETIAPINE TAB 50MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3A3B"},
		{"MedId": "32678", "LawsonNumber": "105579", "LawsonDescription": "QUINAPRIL TAB 10MG", "UOM": "90 TABS/BO", "Source": "INV", "OrderQty": 90, "Location": "3A3F"},
		{"MedId": "32680", "LawsonNumber": "105580", "LawsonDescription": "QUINAPRIL TAB 20MG", "UOM": "90 TABS/BO", "Source": "INV", "OrderQty": 90, "Location": "3A3G"},
		{"MedId": "5659", "LawsonNumber": "107948", "LawsonDescription": "RABIES IMMUNE GLOB 2ML", "UOM": "1 VIAL", "Source": "INV", "OrderQty": 1, "Location": "10C7A"},
		{"MedId": "1508", "LawsonNumber": "102754", "LawsonDescription": "RABIES VACCINE HUMAN 1ML", "UOM": "1 SYRINGE", "Source": "INV", "OrderQty": 1, "Location": "10C6C"},
		{"MedId": "31185", "LawsonNumber": "257349", "LawsonDescription": "RAMIPRIL CAP 10MG", "UOM": "500 CAPS/BO", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "31183", "LawsonNumber": "257347", "LawsonDescription": "RAMIPRIL CAP 2.5MG", "UOM": "500 CAPS/BO", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "31184", "LawsonNumber": "105367", "LawsonDescription": "RAMIPRIL CAP 5MG", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "3A3I"},
		{"MedId": "66861", "LawsonNumber": "206026", "LawsonDescription": "RANOLAZINE TAB 500MG", "UOM": "60 TABS/BO", "Source": "INV", "OrderQty": 60, "Location": "3A3J"},
		{"MedId": "82264", "LawsonNumber": "231417", "LawsonDescription": "RIFAXIMIN TAB 550MG", "UOM": "60 TABS/BO", "Source": "INV", "OrderQty": 60, "Location": "3A4C"},
		{"MedId": "99115", "LawsonNumber": "100532", "LawsonDescription": "ROCURONIUM VL 10ML", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "11E5A"},
		{"MedId": "82302", "LawsonNumber": "246955", "LawsonDescription": "ROPIVAC VL 0.5% 20ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "5D3D"},
		{"MedId": "41967", "LawsonNumber": "100832", "LawsonDescription": "ROPIVAC VL 10MG/ML 20ML", "UOM": "25 VIALS/BX", "Source": "INV", "OrderQty": 25, "Location": "5D4B"},
		{"MedId": "51257", "LawsonNumber": "256609", "LawsonDescription": "ROPIVAC VL 2MG/ML 10ML", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "5D3C"},
		{"MedId": "99656", "LawsonNumber": "200881", "LawsonDescription": "SACCHAROMYCES CAP 250MG", "UOM": "50 CAPS/BO", "Source": "INV", "OrderQty": 50, "Location": "3A4J"},
		{"MedId": "98607", "LawsonNumber": "224433", "LawsonDescription": "SCOPOLAMINE PATCH", "UOM": "24 PATCH/BX", "Source": "INV", "OrderQty": 24, "Location": "1F5B"},
		{"MedId": "19783", "LawsonNumber": "104923", "LawsonDescription": "SENNA TAB BULK", "UOM": "1000 TABS/BO", "Source": "INV", "OrderQty": 1000, "Location": "3A5A"},
		{"MedId": "33845", "LawsonNumber": "255274", "LawsonDescription": "SERTRALINE TAB 100MG", "UOM": "500 TABS/BO", "Source": "INV", "OrderQty": 500, "Location": "3A5D"},
		{"MedId": "43243", "LawsonNumber": "105598", "LawsonDescription": "SERTRALINE TAB 25MG", "UOM": "90 TABS/BO", "Source": "INV", "OrderQty": 90, "Location": "3A5B"},
		{"MedId": "33655", "LawsonNumber": "255273", "LawsonDescription": "SERTRALINE TAB 50MG", "UOM": "500 TABS/BO", "Source": "INV", "OrderQty": 500, "Location": "3A5C"},
		{"MedId": "54533", "LawsonNumber": "103530", "LawsonDescription": "SEVELAMER TAB 800MG", "UOM": "180 TABS/BO", "Source": "INV", "OrderQty": 180, "Location": "3A5E"},
		{"MedId": "96077", "LawsonNumber": "100815", "LawsonDescription": "SILVER NITRATE APP STICK", "UOM": "100 STICKS/BX", "Source": "INV", "OrderQty": 100, "Location": "1F5C"},
		{"MedId": "16441", "LawsonNumber": "107845", "LawsonDescription": "SILVER SULF 20GM TB ER/OR", "UOM": "1 TUBE", "Source": "INV", "OrderQty": 1, "Location": "1F5D"},
		{"MedId": "16353", "LawsonNumber": "105745", "LawsonDescription": "SIMETHICONE TAB 80MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3A5G"},
		{"MedId": "32871", "LawsonNumber": "105299", "LawsonDescription": "SIMVASTATIN TAB 10MG", "UOM": "90 TABS/BO", "Source": "INV", "OrderQty": 90, "Location": "3A5H"},
		{"MedId": "32874", "LawsonNumber": "105319", "LawsonDescription": "SIMVASTATIN TAB 20MG", "UOM": "1000 TABS/BO", "Source": "INV", "OrderQty": 1000, "Location": "3A5I"},
		{"MedId": "32875", "LawsonNumber": "228643", "LawsonDescription": "SIMVASTATIN TAB 40MG", "UOM": "1000 TABS/BO", "Source": "INV", "OrderQty": 1000, "Location": "3A5J"},
		{"MedId": "68099", "LawsonNumber": "208146", "LawsonDescription": "SITAGLIPTIN TAB 100MG", "UOM": "90 TABS/BO", "Source": "INV", "OrderQty": 90, "Location": "3A6C"},
		{"MedId": "68094", "LawsonNumber": "208145", "LawsonDescription": "SITAGLIPTIN TAB 50MG", "UOM": "30 TABS/BO", "Source": "INV", "OrderQty": 30, "Location": "3A6B"},
		{"MedId": "98910", "LawsonNumber": "100659", "LawsonDescription": "SOD BICARB SDV 4.2% 5ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "5D6A"},
		{"MedId": "16036", "LawsonNumber": "100340", "LawsonDescription": "SOD BICARB SYR 50ML", "UOM": "10 SYR/CT", "Source": "INV", "OrderQty": 10, "Location": "9A1A"},
		{"MedId": "98807", "LawsonNumber": "216552", "LawsonDescription": "NEUTROPHOS TAB 250MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "2F1D"},
		{"MedId": "38468", "LawsonNumber": "100658", "LawsonDescription": "SOD CHL SDV 10ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "5E2A"},
		{"MedId": "78950", "LawsonNumber": "100332", "LawsonDescription": "SOD CHL BACT FTV 30ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "9B2A"},
		{"MedId": "18493", "LawsonNumber": "102729", "LawsonDescription": "SOD POLYSTY SUSP 60ML U/D", "UOM": "10 BO/CT", "Source": "INV", "OrderQty": 10, "Location": "6C3H"},
		{"MedId": "19355", "LawsonNumber": "105742", "LawsonDescription": "SORE THROAT SPRAY 6OZ", "UOM": "6 BOTTLES", "Source": "INV", "OrderQty": 6, "Location": "6C4A"},
		{"MedId": "99133", "LawsonNumber": "105528", "LawsonDescription": "SOTALOL TAB 120MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3A6E"},
		{"MedId": "99034", "LawsonNumber": "105527", "LawsonDescription": "SOTALOL TAB 80MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3A6D"},
		{"MedId": "60450", "LawsonNumber": "100314", "LawsonDescription": "DRUG SUCCINYLCHO FTV200MG/10ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "11F1A"},
		{"MedId": "8418", "LawsonNumber": "239688", "LawsonDescription": "SUCRALFATE TAB 1GM", "UOM": "500 TABS/BO", "Source": "INV", "OrderQty": 500, "Location": "3A6H"},
		{"MedId": "82151", "LawsonNumber": "200894", "LawsonDescription": "SOL SUCROSE NAT SWEET-EASE", "UOM": "None", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "99378", "LawsonNumber": "200894", "LawsonDescription": "SOL SUCROSE NAT SWEET-EASE", "UOM": "None", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "82770", "LawsonNumber": "265053", "LawsonDescription": "SUGAMMADEX VL 200MG/2ML", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "5E3B"},
		{"MedId": "23917", "LawsonNumber": "106973", "LawsonDescription": "SULFAM/TRI TAB DS", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3A6I"},
		{"MedId": "98902", "LawsonNumber": "103923", "LawsonDescription": "SULFAM/TRI LIQ 16OZ.", "UOM": "1 BOTTLE", "Source": "INV", "OrderQty": 1, "Location": "6C4B"},
		{"MedId": "99055", "LawsonNumber": "103589", "LawsonDescription": "SUMATRIPTAN VL 6MG/.5ML", "UOM": "5 VIALS/CT", "Source": "INV", "OrderQty": 5, "Location": "5E3D"},
		{"MedId": "46218", "LawsonNumber": "100358", "LawsonDescription": "TAMSULOSIN CAP 0.4MG", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "3B1E"},
		{"MedId": "82589", "LawsonNumber": "251247", "LawsonDescription": "TBO-FILGRASTIM SYR 300MCG 0.5M", "UOM": "10 SYRINGES/CT", "Source": "INV", "OrderQty": 10, "Location": "10C7B"},
		{"MedId": "82590", "LawsonNumber": "251248", "LawsonDescription": "TBO-FILGRASTIM SYR 480MCG 0.8M", "UOM": "10 SYRINGES/CT", "Source": "INV", "OrderQty": 10, "Location": "10C7C"},
		{"MedId": "22205", "LawsonNumber": "100662", "LawsonDescription": "TERBUTALINE VL 1MG 1ML", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "5E4B"},
		{"MedId": "1809", "LawsonNumber": "101289", "LawsonDescription": "TETANUS IMMUNE GLOB 250U", "UOM": "1 SYRINGE", "Source": "INV", "OrderQty": 1, "Location": "10C8B"},
		{"MedId": "3884", "LawsonNumber": "100868", "LawsonDescription": "TETANUS/DIP ADULT 0.5ML", "UOM": "10 SYRINGES/CT", "Source": "INV", "OrderQty": 10, "Location": "10C8C"},
		{"MedId": "64912", "LawsonNumber": "200857", "LawsonDescription": "ACELLULAR DPT (ADACEL)", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "10A1A"},
		{"MedId": "82363", "LawsonNumber": "239703", "LawsonDescription": "TETRACAINE AMP 20MG 2ML", "UOM": "25 AMPS/CT", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "17574", "LawsonNumber": "106979", "LawsonDescription": "THEOPHYL TAB SR 300MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3B1F"},
		{"MedId": "1448", "LawsonNumber": "100620", "LawsonDescription": "THIAMINE VL 100MG 2ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "5E4C"},
		{"MedId": "43169", "LawsonNumber": "107940", "LawsonDescription": "THIAMINE TAB 100MG", "UOM": "1000 TABS/BO", "Source": "INV", "OrderQty": 1000, "Location": "3B2A"},
		{"MedId": "21128", "LawsonNumber": "105372", "LawsonDescription": "THROMBIN KIT 20 UNIT", "UOM": "10 KITS", "Source": "INV", "OrderQty": 10, "Location": "9B5A"},
		{"MedId": "744", "LawsonNumber": "105375", "LawsonDescription": "THROMBIN TOPICAL 5000U", "UOM": "1 KIT", "Source": "INV", "OrderQty": 1, "Location": "1F5G"},
		{"MedId": "82390", "LawsonNumber": "241233", "LawsonDescription": "TICAGRELOR TAB 90MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3B2B"},
		{"MedId": "245010", "LawsonNumber": "245010", "LawsonDescription": "TIPRANAVIR CAP 250MG", "UOM": "120 CAPS/BO", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "43038", "LawsonNumber": "103324", "LawsonDescription": "TIZANIDINE TAB 4MG", "UOM": "150 TABS/BO", "Source": "INV", "OrderQty": 150, "Location": "3B2C"},
		{"MedId": "99331", "LawsonNumber": "100663", "LawsonDescription": "TOBRAMYCIN VL 80MG 2ML", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "5E4F"},
		{"MedId": "1995", "LawsonNumber": "250372", "LawsonDescription": "TOBRAMYCIN INJECT POW 1.2GM", "UOM": "6 VIALS/CT", "Source": "INV", "OrderQty": 6, "Location": "5E4E"},
		{"MedId": "42911", "LawsonNumber": "264331", "LawsonDescription": "TOPIRAMATE TAB 100MG", "UOM": "100 TABS/BX", "Source": "INV", "OrderQty": 100, "Location": "3B2G"},
		{"MedId": "42909", "LawsonNumber": "264330", "LawsonDescription": "TOPIRAMATE TAB 25MG", "UOM": "50 TABS/BX", "Source": "INV", "OrderQty": 50, "Location": "3B2F"},
		{"MedId": "775", "LawsonNumber": "105674", "LawsonDescription": "TRAZODONE TAB 100MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3B2J"},
		{"MedId": "745", "LawsonNumber": "229414", "LawsonDescription": "TRAZODONE TAB 50MG", "UOM": "500 TABS/BO", "Source": "INV", "OrderQty": 500, "Location": "3B2I"},
		{"MedId": "31200", "LawsonNumber": "102194", "LawsonDescription": "TRIAMCIN ACET VL 40MG 5ML", "UOM": "1 VIAL", "Source": "INV", "OrderQty": 1, "Location": "5E5B"},
		{"MedId": "48346", "LawsonNumber": "103416", "LawsonDescription": "TRIFLURIDINE OPH 1% 7.5ML", "UOM": "1 BOTTLE", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "4407", "LawsonNumber": "105376", "LawsonDescription": "TRIMETHOBENZ VL 200MG", "UOM": "25 VL/CT", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "98949", "LawsonNumber": "106484", "LawsonDescription": "URSODIOL CAP 300MG", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "3B3A"},
		{"MedId": "42802", "LawsonNumber": "105453", "LawsonDescription": "VALSARTAN CAP 160MG", "UOM": "90 CAPS/BO", "Source": "INV", "OrderQty": 90, "Location": "3B3F"},
		{"MedId": "42797", "LawsonNumber": "105452", "LawsonDescription": "VALSARTAN CAP 80MG", "UOM": "90 CAPS/BO", "Source": "INV", "OrderQty": 90, "Location": "3B3E"},
		{"MedId": "33771", "LawsonNumber": "262909", "LawsonDescription": "VANCOMYCIN VL 500MG", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "5E6B"},
		{"MedId": "67420", "LawsonNumber": "207911", "LawsonDescription": "VARENICLINE TAB 0.5MG", "UOM": "56 TABS/BO", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "67421", "LawsonNumber": "207912", "LawsonDescription": "VARENICLINE TAB 1MG", "UOM": "56 TABS/BO", "Source": "INV", "OrderQty": 56, "Location": "3B3H"},
		{"MedId": "17687", "LawsonNumber": "100652", "LawsonDescription": "VASOPRESSIN VL 20U", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "11F2A"},
		{"MedId": "32456", "LawsonNumber": "107952", "LawsonDescription": "VECURONIUM VL 10MG 10ML", "UOM": "10 VIALS/CT", "Source": "INV", "OrderQty": 10, "Location": "5F2A"},
		{"MedId": "35326", "LawsonNumber": "107143", "LawsonDescription": "VENLAFAXINE TAB 25MG", "UOM": "100 TABS/BO", "Source": "W/S", "OrderQty": 1, "Location": "N/A"},
		{"MedId": "35331", "LawsonNumber": "107148", "LawsonDescription": "VENLAFAXINE TAB 37.5MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3B3I"},
		{"MedId": "46372", "LawsonNumber": "264004", "LawsonDescription": "VENLAFAXINE CAP XR 150MG", "UOM": "100 CAPS/BX", "Source": "INV", "OrderQty": 100, "Location": "N/A"},
		{"MedId": "49449", "LawsonNumber": "107145", "LawsonDescription": "VENLAFAXINE TAB 75MG XRUD", "UOM": "90 CAPS/BO", "Source": "INV", "OrderQty": 90, "Location": "3B3J"},
		{"MedId": "2904", "LawsonNumber": "104899", "LawsonDescription": "VERAPAMIL TAB 120MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3B4C"},
		{"MedId": "4454", "LawsonNumber": "100351", "LawsonDescription": "DRUG VERAPAMIL VL 10MG", "UOM": "5 VIALS/CT", "Source": "INV", "OrderQty": 5, "Location": "5F3C"},
		{"MedId": "5517", "LawsonNumber": "107030", "LawsonDescription": "VERAPAMIL TAB 40MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3B4A"},
		{"MedId": "2889", "LawsonNumber": "107023", "LawsonDescription": "VERAPAMIL TAB 80MG U/D", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3B4B"},
		{"MedId": "30820", "LawsonNumber": "106945", "LawsonDescription": "VERAPAMIL TAB SR 120MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3B4D"},
		{"MedId": "23076", "LawsonNumber": "106947", "LawsonDescription": "VERAPAMIL TAB SR 180MG U/D", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3B4E"},
		{"MedId": "17705", "LawsonNumber": "106948", "LawsonDescription": "VERAPAMIL TAB SR 240MG U/D", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3B4F"},
		{"MedId": "48444", "LawsonNumber": "104908", "LawsonDescription": "VIT B W/VIT C CAP", "UOM": "130 CAPS/BO", "Source": "INV", "OrderQty": 130, "Location": "3B4G"},
		{"MedId": "24019", "LawsonNumber": "102242", "LawsonDescription": "DRUG WARFARIN TAB 1MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3B5A"},
		{"MedId": "16288", "LawsonNumber": "102248", "LawsonDescription": "DRUG WARFARIN TAB 10MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3B6C"},
		{"MedId": "16274", "LawsonNumber": "102247", "LawsonDescription": "DRUG WARFARIN TAB 2MG", "UOM": "100 TABS/BX", "Source": "INV", "OrderQty": 100, "Location": "3B5B"},
		{"MedId": "18916", "LawsonNumber": "102240", "LawsonDescription": "DRUG WARFARIN TAB 2.5MG", "UOM": "100 TABS/BX", "Source": "INV", "OrderQty": 100, "Location": "3B5C"},
		{"MedId": "43374", "LawsonNumber": "102243", "LawsonDescription": "DRUG WARFARIN TAB 3MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3B5D"},
		{"MedId": "16283", "LawsonNumber": "102239", "LawsonDescription": "DRUG WARFARIN TAB 5MG", "UOM": "100 TABS/BX", "Source": "INV", "OrderQty": 100, "Location": "3B6A"},
		{"MedId": "16286", "LawsonNumber": "102241", "LawsonDescription": "DRUG WARFARIN TAB 7.5MG", "UOM": "100 TABS/BO", "Source": "INV", "OrderQty": 100, "Location": "3B6B"},
		{"MedId": "44978", "LawsonNumber": "100656", "LawsonDescription": "WATER INJ STER 20ML SD", "UOM": "25 VIALS/CT", "Source": "INV", "OrderQty": 25, "Location": "5F5A"},
		{"MedId": "12385", "LawsonNumber": "101643", "LawsonDescription": "WITCH HAZEL PADS", "UOM": "20 EA/BX", "Source": "INV", "OrderQty": 20, "Location": "9C3A"},
		{"MedId": "98842", "LawsonNumber": "106974", "LawsonDescription": "ZINC SULFATE CAP 220MG", "UOM": "100 CAPS/BO", "Source": "INV", "OrderQty": 100, "Location": "3B6D"}
	];
	return formulary;
}