$(document).ready(function() {

	//show all items in grocery list when user loads/ is on the grocery page
	$.ajax({
			url: './groceries',
			success:function(result) {
				$('#allItems').html(result);
			}
		});

	$('#new').submit(addItem);
	$('#find').submit(findItem);
	$('#update').submit(updateItem);
	$('#delete').on('click', deleteItem);

	function addItem(event) {
		var item_name = $('#new input')[0].value;
		var quant = $('#new input')[1].value;
		$.ajax({
			url: './groceries',
			type: 'PUT',
			data: { name: item_name, quantity: quant },
			success: function(result) {
				console.log("Successfully added item to grocery list!");
				window.location.reload(true);
			}
		});
		event.preventDefault();
	}

	function findItem(event) {
		var item_name = $('#find input')[0].value;
		$.ajax({
			url: './groceries',
			type: 'GET',
			data: { name: item_name },
			success: function(result) {
				console.log("Successfully found item!");
				$('#founditem').html(result);
			},
			error: function(response, status) {
				$('#founditem').html('Item not found, please try another search!');
			}
		});
		event.preventDefault();
	}

	function updateItem(event) {
		var item_name = $('#update input')[0].value;
		var quant = $('#update input')[1].value;
		$.ajax({
			url: './groceries',
			type: 'POST',
			data: { filter: item_name, update: quant },
			success: function(result) {
				console.log("Successfully updated item in grocery list!");
				window.location.reload(true);
			}
		});
		event.preventDefault();
	}


	function deleteItem() {
		var item_name = $("#delete input")[0].value;
		$.ajax({
			url: './groceries',
			type: 'DELETE',
			data: { name: item_name },
			success:function(result){
				console.log("Successfully deleted item");
			}
		});
		event.preventDefault();
	}

});