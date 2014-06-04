
f360.controller("LoginController", function($scope, $routeParams, $http, $location)
{
	$scope.message = "";
	$scope.username = "user1";
	console.log("LoginController");
	$scope.login = function() {
		$scope.message = "";
		$http.get("/api/user/"+$scope.username+"/"+$scope.password)
		.success(function(user){
			if(user.length == 0)
				$scope.message = "Username and/or password does not exist. Try again";
			else
				$location.path( $scope.username+"/trip/list" );
		});
	}
});

f360.controller("TermsController", function($scope, $routeParams, $http, $location)
{
	console.log("TermsController");
}
f360.controller("RegisterController", function($scope, $routeParams, $http, $location)
{
	$scope.message = "";
	$scope.register = function() {
		$scope.message = "";
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
							$scope.message = "Unable to register user";
						else
							$location.path( $scope.newUser.username+"/trip/list" );
					});
				}
				else
				{
					$scope.message = "User already exists";
				}
			});
		}
		else
		{
			$scope.message = "Passwords must match. Try again";
		}
	}
});
