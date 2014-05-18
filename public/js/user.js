
f360.controller("LoginController", function($scope, $routeParams, $http)
{
	$scope.username = "user1";
	console.log("LoginController");
	$scope.login = function() {
		$scope.message = "";
		$http.get("/api/user/"+$scope.username+"/"+$scope.password)
		.success(function(user){
			if(user == null)
				$scope.message = "Username and/or password does not exist. Try again";
		});
	}
});

f360.controller("RegisterController", function($scope, $routeParams, $http, $location)
{
	console.log("RegisterController");
	$scope.register = function() {
		$scope.message = "";
		if($scope.newUser.password == $scope.newUser.password2)
		{
			$http.post("/api/user", $scope.newUser)
			.success(function(newUser){
				if(user == null)
					$scope.message = "Unable to register user";
				else
					$location.path( "/:username/trip/list" );
			});
		}
		else
		{
			$scope.message = "Username and/or password does not exist. Try again";
		}
	}
});
