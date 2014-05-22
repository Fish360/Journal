
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
		console.log($routeParams.username);
		console.log($routeParams.tripId);
		var url = "api/user/"+$scope.username+"/trip/"+$scope.tripId+"/fish";
		console.log(url);
		$http.post(url, $scope.newFish)
		.success(function(trips)
		{
			console.log("NewFishController.create() post callback");
			$location.path( username+"/trip/"+$scope.tripId+"/fish/list" );
		});
	}
});

f360.controller("EditFishController", function($scope, $routeParams, $http, $location)
{
	var $scope.username = $routeParams.username;
	var $scope.tripId = $routeParams.tripId;
	var $scope.fishId = $routeParams.fishId;
	
	$http.get("api/user/"+$scope.username+"/trip/"+$scope.tripId+"/fish/"+$scope.fishId)
		.success(function(fish)
		{
			$scope.editFish = fish;
		});
	
	$scope.update = function()
	{
		$http.put("api/user/"+$scope.username+"/trip/"+$scope.tripId+"/fish/"+$scope.fishId, $scope.editFish)
			.success(function(fish){
				$location.path( $scope.username+"/trip/"+$scope.tripId+"/fish/list" );
			});
	}
	
	$scope.remove = function()
	{
		$http.delete("api/user/"+$scope.username+"/trip/"+$scope.tripId+"/fish/"+$scope.fishId)
			.success(function(fish){
//				window.history.back();
				$location.path( $scope.username+"/trip/"+$scope.tripId+"/fish/list" );
			});
	}
});
