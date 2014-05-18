
f360.controller("TripListController", function($scope, $routeParams, $http)
{
	$scope.username = $routeParams.username;
	$http.get("api/"+$scope.username+"/trip")
	.success(function(trips)
	{
		$scope.trips = trips;
	});
});

f360.controller("NewTripController", function($scope, $routeParams, $http, $location)
{
	var username = $routeParams.username;
	$scope.create = function()
	{
//		$scope.newTrip.username = username
		$http.post("api/"+username+"/trip", $scope.newTrip)
		.success(function(trips)
		{
			$location.path( username+"/trip/list" );
		});
	}
});
