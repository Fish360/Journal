
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
	console.log("NewFishController");
	$scope.username = $routeParams.username;
	$scope.tripId = $routeParams.tripId;
	$scope.create = function()
	{
		console.log("NewFishController.create()");
		$scope.newTrip.trip_id = $scope.tripId;
		console.log($routeParams.username);
		console.log($routeParams.tripId);
		var url = "api/user/"+$scope.username+"/trip/"+$scope.tripId+"/fish";
		console.log(url);
		$http.post(url)
		.success(function(trips)
		{
			console.log("NewFishController.create() post callback");
			$location.path( username+"/trip/"+$scope.tripId+"/fish/list" );
		});
	}
});
