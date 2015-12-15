$(document).ready(function() {

//------------------------------GROCERY LIST CRUD FUNCTIONALITY-------------------------------------------

	//show all items in grocery list when user loads / is on the grocery page
	$.ajax({
			url: './groceries',
			success:function(result) {
				$('#allItems').html(result);
			}
		});

	//CRUD functionality for grocery lists
	$('#new').submit(addItem);
	$('#find').on('click', findItem);
	$('#update').submit(updateItem);
	$('input[type="button"]').on('click', deleteItem);

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
		var item_name = $('#custom-search-input input')[0].value;
		$.ajax({
			url: './groceries',
			type: 'GET',
			data: { name: item_name },
			success: function(result) {
				console.log("Successfully found item!");
				$('#founditem').html(result);
			},
			error: function(response, status) {
				$('#founditem').html('<p>Item not found, please try another search!</p>');
			}
		});
		event.preventDefault();
	}

	function updateItem(event) {
		console.log("update Item called");
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
		//go through 'td' elements to find name of item in the row
		var item_name = $(this).closest('tr td').prev('td').prev('td').prev('td').text();
		//remove any line breaks from item_name
		item_name = item_name.replace(/\s{2,}/g, '');
		item_name = item_name.replace(/\t/g, '');
		item_name = item_name.replace(/(\r\n|\n|\r)/g,"");
		$.ajax({
			url: './groceries',
			type: 'DELETE',
			data: { name: item_name },
			success:function(result){
				console.log("Successfully deleted item");
				window.location.reload(true);
			}
		});
		event.preventDefault();
	}

//-----------------------------USER LOGIN AND REGISTRATION CR FUNCTIONALITY----------------------------------------

	//CR functionality for users
	$('#login').submit(login_user); //read logged in user
	$('#register').submit(new_user); //create new user

	function login_user(event) {
		var user_name = $('#login input')[0].value;
		var user_password = $('#login input')[1].value;
		$.ajax({
			url: './users',
			type: 'GET',
			data: { username: user_name, password: user_password },
			success: function(result) {
				if (result.length == 0) {
					$('#error').html("<p>Incorrect username or password. Please try again!</p>");
				}
				console.log("Successfully found user!");
				window.location.reload(true);
			},
			error: function(response, status) {
				alert("Incorrect username or password. Please try again!");
			}
		});
		event.preventDefault();
	}

	function new_user(event) {
		var first_name = $('#register input')[0].value;
		var last_name = $('#register input')[1].value;
		var user_email = $('#register input')[2].value;
		var user_name = $('#register input')[3].value;
		var user_password = $('#register input')[4].value;
		$.ajax({
			url: './users',
			type: 'PUT',
			data: { firstname: first_name, lastname: last_name, email: user_email, 
				username: user_name, password: user_password },
			success: function(result) {
				$('#error').html("<p>Congrats! You've been added to our system. Enter your login information below to get started.</p>");
				console.log("Successfully added user to system!");
			}
		});
		event.preventDefault();
	}

//------------------------------YUMMLY API CALL-------------------------------------------

	//API Call: Search for recipes using 3 leftover ingredients submitted by users
	$('#leftovers').submit(getLeftoverRecipes);

	//Perform GET recipe functions for finding recipe IDs, then SEARCH recipe function to get ingredients
	function getLeftoverRecipes(event) {
		var ingredient_1 = $('#leftovers input')[0].value;
		var ingredient_2 = $('#leftovers input')[1].value;
		var ingredient_3 = $('#leftovers input')[2].value;
		//clear search inputs
		$('#leftovers input')[0].value = "";
		$('#leftovers input')[1].value = "";
		$('#leftovers input')[2].value = "";

		//below information received from API documentation
		//following example pattern of: http://api.yummly.com/v1/api/recipes?_app_id=YOUR_ID&_app_key=YOUR_APP_KEY
		try{
			$.ajax({ 
			url: 'http://api.yummly.com/v1/api/recipes?', 
            type: 'GET',
            data: {
            	"_app_id": "bb50ec71",
            	"_app_key": "dd855000279fc5780e8a0e9ae507d0e7",
            	"allowedIngredient[]": [ingredient_1, ingredient_2, ingredient_3]
            }, 
            success: function(result) {
            	$('#leftover_results').empty();
            	console.log('successfully called ajax for recipe search!');
            	if (result.matches.length == 0) {
            		$('#leftover_results').append("<p>Sorry we could not find any recipes with those ingredients. Please try another search!</p>");
            	}
            	else {
            		searchRecipes(result.matches); //calls function to search for recipes using result IDs
            	}
            	console.log(result);
            },
            error: function(response){
                console.log(response);                
            },
            dataType: "jsonp",
            crossDomain: true
        	});
			return false;
		} catch (e) {console.log(e.description);}

	}

	function searchRecipes(data) {
		$.each(data, function() {
			var food = this;
			//GET the ID of each matched recipe, and perform another API request to search for specific ingredients
			//below information received from API documentation
			//following example pattern of: http://api.yummly.com/v1/api/recipe/recipe-id?_app_id=YOUR_ID&_app_key=YOUR_APP_KEY
			try{
				$.ajax({ 
				url: 'http://api.yummly.com/v1/api/recipe/'+food.id+'?', 
	            type: 'GET',
	            data: {
	            	"_app_id": "bb50ec71",
	            	"_app_key": "dd855000279fc5780e8a0e9ae507d0e7"
	            }, 
	            success: function(result) {
	            	console.log('successfully called ajax for ingredient search!');
	            	showIngredients(result);
	            	console.log(result);
	            },
	            error: function(response){
	                console.log(response);                
	            },
	            dataType: "jsonp",
	            crossDomain: true
	        	});
				//return false;
			} catch (e) {console.log(e.description);}
		});
	}

	function showIngredients(data) {
		var result = "";
		//create left col with Recipe name and picture
		result += "<div class='row'><div class='col-md-6'><h3><a href='"+data.source.sourceRecipeUrl+"' target='_blank'>"+data.name+"</a></h3>";
		result += "<img class='img-responsive' src='"+data.images[0].hostedLargeUrl+"'></div>";
		//create right col with Recipe information and ingredients
		result += "<div class='col-md-6' id='recipePic'><h4><span class='glyphicon glyphicon-user'></span> "+data.numberOfServings+" servings</h4><h4><span class='glyphicon glyphicon-time'></span> "+data.totalTime+"</h4><h4><span class='glyphicon glyphicon-star-empty'></span> "+data.rating+" stars</h4>";
		result += "<h4>Ingredients:</h4><ul>"
		//List out ingredients
		$.each(data.ingredientLines, function() {
			ingredient = this;
			result += "<li>"+ingredient+"</li>"
		});
		result += "</ul></div>";
		$('#leftover_results').append(result);
	}

});