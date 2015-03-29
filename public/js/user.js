
f360.controller("ForgotPasswordController",
function ($scope, $routeParams, $http, $location) {
    $scope.sendPassword = function (username) {
        $http.get("/api/forgotPassword/"+$scope.username)
        .success(function () {
            alert("If the email exists in our records, then you will receive a password at that email. You can then change your password from your profile.");
            $location.path("/");
        });
    }
});

f360.controller("ProfileController", function($scope, $routeParams, $http, $location)
{
	console.log("ProfileController");
	$scope.username = $routeParams.username;
	console.log($scope.username);
	$scope.updateProfile = function() {
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
		$scope.user = user[0];
		$scope.user.password = "";
		$scope.user.password2 = "";
		console.log(user);
	})
	.error(function(err) {
		console.log("Failed");
		console.log(err);
	});
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
			if(user.length == 0)
				$scope.message = "Username and/or password does not exist. Try again";
			else {
//				$location.path( $scope.username+"/trip/list" );
				$location.path( $scope.username+"/home" );
				localStorage.setItem("user", JSON.stringify(user[0]));
			}
		});
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

f360.controller("RegisterController", function($scope, $routeParams, $http, $location)
{
    $scope.newUser = {
        plan: ""
    };

	$scope.message = "";
	$scope.register = function() {
	    $scope.message = "";
	    if (!$scope.newUser.plan)
	    {
	        alert("Please choose a plan");
	        return;
	    }
		if($scope.newUser.password == $scope.newUser.password2)
		{
			// search for the user to see if it already exists
			$http.get("/api/user/"+$scope.newUser.username)
			.success(function(newUser) {
				// if user does not exist, create it new
				if(newUser.length == 0) {
					$http.post("/api/user", $scope.newUser)
					.success(function(newUser){
						if(newUser == null)
						    alert("Unable to register user");
    					else
							$location.path( $scope.newUser.username+"/home" );
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
