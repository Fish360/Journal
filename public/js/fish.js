
f360.controller("FishListController", function($scope, $routeParams, $http)
{
	$scope.username = $routeParams.username;
	$scope.tripId = $routeParams.tripId
	$http.get("api/user/"+$scope.username+"/trip/"+$routeParams.tripId+"/fish")
	.success(function(fish)
	{
		$scope.fish = fish;
	});
});

f360.controller("NewFishController", function($scope, $routeParams, $http, $location)
{
	$scope.username = $routeParams.username;
	$scope.tripId = $routeParams.tripId;
	$scope.create = function()
	{
		$scope.newTrip.username = $scope.username;
		$scope.newTrip.trip_id = $scope.tripId;
		$http.post("api/user/"+$scope.username+"/trip/"+$scope.tripId+"/fish", $scope.newTrip)
		.success(function(trips)
		{
			$location.path( username+"/trip/"+$scope.tripId+"/fish/list" );
		});
	}
});

f360.controller("EditTripController", function($scope, $routeParams, $http, $location)
{
	var username = $routeParams.username;
	var tripid = $routeParams.tripid;
	
	$http.get("api/"+username+"/trip/"+tripid)
		.success(function(trip)
		{
			$scope.editTrip = trip;
		});
	
	$scope.update = function()
	{
		$scope.editTrip.username = username;
		$http.put("api/"+username+"/trip/"+tripid, $scope.editTrip)
			.success(function(trip){
				$location.path( username+"/trip/list" );
			});
	}
	
	$scope.delete = function()
	{
		$http.delete("api/"+username+"/trip/"+tripid)
			.success(function(trip){
				$location.path( username+"/trip/list" );
			});
	}
});
