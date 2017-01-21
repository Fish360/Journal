
f360.controller("ForgotPasswordController",
function ($scope, $routeParams, $http, $location) {
    $scope.sendPassword = function (username) {
        $http.post("/api/forgotPassword/"+$scope.username)
        .success(function () {
            alert("If the email exists in our records, then you will receive your password at that email.");
            $location.path("/");
        });
    }
});

f360.controller("ProfileController", function($scope, $routeParams, $http, $location, JSONLoaderFactory)
{
	console.log("ProfileController");
	$scope.username = $routeParams.username;
	console.log($scope.username);
	$scope.speciess = species;

	loadSpecies();

	function loadSpecies() {
		JSONLoaderFactory.readTextFile("../json/species.json", function(text){
	    	$scope.species = JSON.parse(text);
		   
		});
	}

	$scope.updateProfile = function() {
		
		if(validateSpecieSelection()) {
			var scientificName = ($scope.user.species.originalObject === undefined) ? $scope.user.species : $scope.user.species.originalObject["ScientificName"];
			
			for(var i=0; i<species.length; i++) {
				if(species[i].scientific === scientificName){
					$scope.user["commonName"] = species[i].common;
				}
			}
			$scope.user.species = scientificName;
		}

		console.log($scope.user);
		if(	$scope.user.password != $scope.user.password2 ||
			typeof $scope.user.password == "undefined") {
			
			alert("Passwords must match. Please try again.");
				
		} else {
		    if (!$scope.user.password && !$scope.user.password2)
		    {
		        delete $scope.user.password;
		        delete $scope.user.password2;
		    }
			$http.put("/api/user/"+$scope.username, $scope.user)
			.success(function (newUser) {
			    $location.path($scope.username+"/home");
			});
		}
	}
	var url = "/api/user/"+$scope.username;
	console.log(url);
	$http.get(url)
	.success(function(user) {
		console.log("***************");
		console.log(user);
		$scope.user = user[0];
		$scope.user.password = "";
		$scope.user.password2 = "";
		console.log(user);
	})
	.error(function(err) {
		console.log("Failed");
		console.log(err);
	});

	function validateSpecieSelection() {
		var isValidSpecies = ($scope.user.species === undefined)? false : true;
		console.log(isValidSpecies);
		if(!isValidSpecies){
			alert("Please enter valid specie");
			return false;
		}
		return true;
	}
});

f360.controller("LoginController", function($scope, $routeParams, $http, $location)
{
	$scope.message = "";
	$scope.username = "";
	console.log("LoginController");
	$scope.login = function() {
		$scope.message = "";
		$http.get("/api/user/"+$scope.username+"/"+$scope.password)
		.success(function(user){
			alert(user.username);
			if(!user) {
				alert('user not found');
				$scope.message = "Username and/or password does not exist. Try again";
			}
			else {
//				$location.path( $scope.username+"/trip/list" );
				alert('going home');
				$location.path( $scope.username+"/home" );
				localStorage.setItem("user", JSON.stringify(user[0]));
				var encryptedPassword = $scope.password;//CryptoJS.AES.encrypt($scope.password, "password");
				localStorage.setItem("username", $scope.username);
				localStorage.setItem("password", encryptedPassword);
			}
		});
	};

	var username = localStorage.getItem("username");
	var encryptedPassword = localStorage.getItem("password");
	if(encryptedPassword !== null) {
		// var decryptedPassword = CryptoJS.AES.decrypt(encryptedPassword, "password");
		// var password = decryptedPassword.toString(CryptoJS.enc.Utf8);
		var password = encryptedPassword;
	    if (username !== null && password !== null) {
	    	$scope.username = username;
	    	$scope.password = password;
	        $scope.login();
	    }
    }
});

f360.controller("TermsController", function($scope, $routeParams, $http, $location)
{
	console.log("TermsController");
	$scope.iAccept = function()
	{
		console.log($scope.accept);
		if($scope.accept)
		{
			location.href = "http://localhost:8080/#/register";
		}
	}
});

f360.controller("UpgradeController", function($scope, $routeParams, $http) {
	var username = $routeParams.username;
	//alert("UPGRADE CONTROLLER !!!!!!!!!!!!!!!!!!!!! " + username);
	$http.get("/api/user/" + username)
		.success(function (user) {
			$scope.user = user[0];
			console.log($scope.user);
		});
});

f360.controller("RegisterController", function($scope, $routeParams, $http, $location)
{
    $scope.newUser = {
        plan: ""
    };

	$scope.message = "";
	$scope.register = function() {
		$scope.newUser.plan = "ANGLER";
	    $scope.message = "";
	  //  if (!$scope.newUser.plan)
	  //  {
	  //      alert("Please choose a plan");
	  //      return;
	  //  }
		if($scope.newUser.password == $scope.newUser.password2)
		{
			// search for the user to see if it already exists
			$http.get("/api/user/"+$scope.newUser.username)
			.success(function(newUser) {
				// if user does not exist, create it new
				if(newUser.length == 0) {
					$http.post("/api/user", $scope.newUser)
					.success(function(newUser){
						if(newUser == null) {
							    alert("Unable to register user");
							}
							else  if(newUser.error === 'email exist') {
								  alert("Email exist please use different email ID");
							} 
	    					else {
								$location.path( $scope.newUser.username+"/home" );
							}
					});
				}
				else
				{
				    alert("User already exists");
				}
			});
		}
		else
		{
		    alert("Passwords must match. Try again");
		}
	}
});
