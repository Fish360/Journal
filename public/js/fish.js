f360.controller("FishPhotosController", function ($scope, $routeParams, $http, SpotService) {
    $scope.username = $routeParams.username;
    $scope.tripId = $routeParams.tripId;
    $scope.fishId = $routeParams.fishId;

    $http.get("api/user/" + $scope.username + "/trip/" + $scope.tripId + "/fish/" + $scope.fishId)
	.success(function (fish) {
	    $scope.fish = fish;
	});
});

f360.controller("FishPhotoController", function ($scope, $routeParams, $http, SpotService, $location) {
    $scope.username = $routeParams.username;
    $scope.tripId = $routeParams.tripId;
    $scope.fishId = $routeParams.fishId;
    $scope.photoIndex = $routeParams.photoIndex;

    $http.get("api/user/" + $scope.username + "/trip/" + $scope.tripId + "/fish/" + $scope.fishId)
	.success(function (fish) {
	    $scope.photo = fish.images[$scope.photoIndex];
	});

    $scope.removePhoto = function () {
        $http.delete("api/" + $scope.username + "/trip/" + $scope.tripId + "/fish/" + $scope.fishId + "/photos/" + $scope.photoIndex)
        .success(function (trip) {
            $location.path("/" + $scope.username + "/trip/" + $scope.tripId + "/fish/" + $scope.fishId  + "/photos");
        });
    }
});

f360.controller("FishHomeListController", function ($scope, $routeParams, $http)
{
	$scope.username = $routeParams.username;
	$scope.tripId = $routeParams.username;
	$http.get("api/allFish/"+$scope.username)
		.success(function(fish)
		{
			$scope.fish = fish;
		});
});

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

f360.controller("NewFishController", function ($scope, $routeParams, $http, $location, SpotService, GearService, PresentationsService)
{
	$scope.speciess = species;
	$scope.username = $routeParams.username;
	$scope.tripId = $routeParams.tripId;
	
	SpotService.findAll($scope.username, function (spots) {
		$scope.spots = spots;
	});

	GearService.findAll($scope.username, function(gears)
	{
		$scope.gears = gears;
	});
	
	PresentationsService.findAll($scope.username, function(presentations)
	{
		$scope.presentations = presentations;
	});
	
	$scope.create = function()
	{
		var url = "api/user/"+$scope.username+"/trip/"+$scope.tripId+"/fish";
//		console.log(url);
		$scope.newFish["lastUpdated"] = new Date();
		
		for(var i=0; i<species.length; i++)
			if(species[i].scientific == $scope.newFish.species)
				$scope.newFish["commonName"] = species[i].common;
		
		$http.post(url, $scope.newFish)
			.success(function(trips)
			{
				var preferences = {
					species : $scope.newFish.species
				};

//				var user = localStorage.getItem("user");
//				if(user != null && user != "" && user != "null") {
//					user = JSON.parse(user);
//					user.preferences = preferences;
//				}
//				localStorage.setItem("user", JSON.stringify(user));
//				url = "api/user/"+$scope.username+"/preferences";
//				$http.post(url, preferences);
//				$location.path( $scope.username+"/trip/"+$scope.tripId+"/fish/list" );
				
//				$location.replace(); // <----
				
				window.history.go(-1);
//				history.back();
			});
	}

	$scope.newFish = {};
	$scope.newFish.species = "";
	var user = localStorage.getItem("user");
	if(user != null && user != "") {
	    user = JSON.parse(user);
//		$scope.newFish.species = user.preferences.species;
	}

//	SpotService.findAll($scope.username, function (response) {
//	    $scope.newFish.spots = response;
//	});

});

f360.controller("EditFishController", function ($scope, $routeParams, $http, $location, SpotService, GearService, PresentationsService)
{

	$scope.speciess = species;

	$scope.username = $routeParams.username;
	$scope.tripId = $routeParams.tripId;
	$scope.fishId = $routeParams.fishId;

	SpotService.findAll($scope.username, function (spots) {
		$scope.spots = spots;
		GearService.findAll($scope.username, function(gears)
		{
			$scope.gears = gears;
			PresentationsService.findAll($scope.username, function(presentations)
			{
				$scope.presentations = presentations;
				$http.get("api/user/" + $scope.username + "/trip/" + $scope.tripId + "/fish/" + $scope.fishId)
				.success(function(fish)
				{
					$scope.editFish = fish;
//					f360Number($scope);
				});
			});
		});
	});
	
	$scope.update = function()
	{
//		console.log("UPDATE");
		for(var i=0; i<species.length; i++)
			if(species[i].scientific == $scope.editFish.species)
				$scope.editFish["commonName"] = species[i].common;

//		console.log($scope.editFish);

//		$scope.editFish.weight = $scope.editFish.weight.replace
		//$scope.editFish.weight += "";
/*		$scope.editFish.weight *= 10.0;
		$scope.editFish.length *= 10.0;
		$scope.editFish.girth *= 10.0;
		$scope.editFish.waterDepth *= 10.0;
		$scope.editFish.waterTemperature *= 10.0;
		$scope.editFish.waterClarity *= 10.0;
*/		
		$scope.editFish["lastUpdated"] = new Date();
		$http.put("api/user/"+$scope.username+"/trip/"+$scope.tripId+"/fish/"+$scope.fishId, $scope.editFish)
			.success(function(fish){
				var preferences = {
					species : $scope.editFish.species
				};

				var user = localStorage.getItem("user");
				if(user != null && user != "") {
					user = JSON.parse(user);
					user.preferences = preferences;
				}
				localStorage.setItem("user", JSON.stringify(user));

				url = "api/user/"+$scope.username+"/preferences";
				$http.post(url, preferences);

//				$location.path( $scope.username+"/trip/"+$scope.tripId+"/fish/list" );
				
				window.history.go(-1);

			});
	}
	
	$scope.remove = function()
	{
		var removeConfirm = confirm("Are you sure you want to remove this fish?");
		if(removeConfirm) {
		$http.delete("api/user/"+$scope.username+"/trip/"+$scope.tripId+"/fish/"+$scope.fishId)
			.success(function(fish){
//				window.history.back();
//				$location.path( $scope.username+"/trip/"+$scope.tripId+"/fish/list" );
				window.history.go(-2);
			});
		} else {
			return false;
		}
	}
});
