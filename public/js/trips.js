
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
	$scope.username = $routeParams.username;
	$scope.create = function()
	{
		$scope.newTrip.username = $scope.username
		$http.post("api/"+$scope.username+"/trip", $scope.newTrip)
		.success(function(trips)
		{
			$location.path( $scope.username+"/trip/list" );
		});
	}
});

f360.controller("EditTripController", function($scope, $routeParams, $http, $location)
{
	$scope.username = $routeParams.username;
	var tripid = $routeParams.tripid;
	
	$http.get("api/"+$scope.username+"/trip/"+tripid)
		.success(function(trip)
		{
			$scope.editTrip = trip;
		});
	
	$scope.update = function()
	{
		$scope.editTrip.username = $scope.username;
		$http.put("api/"+$scope.username+"/trip/"+tripid, $scope.editTrip)
			.success(function(trip){
				$location.path( $scope.username+"/trip/list" );
			});
	}
	
	$scope.remove = function()
	{
		$http.delete("api/"+$scope.username+"/trip/"+tripid)
			.success(function(trip){
				$location.path( $scope.username+"/trip/list" );
			});
	}
});
