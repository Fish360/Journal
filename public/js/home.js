
f360.controller("HomeController", function($scope, $routeParams, $http)
{
	console.log("Home Controller");
	$scope.username = $routeParams.username;
	$http.get("api/"+$routeParams.username+"/events")
		.success(function(events){
			$scope.events = events;
		});
});
