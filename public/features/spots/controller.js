f360.controller("SpotPhotosController", function ($scope, $routeParams, $http, SpotService) {
    $scope.username = $routeParams.username;
});

f360.controller("SpotPhotoController", function ($scope, $routeParams, $http, SpotService) {
    $scope.username = $routeParams.username;
    $scope.photoId = $routeParams.id;
});

f360.controller("SpotHomeListController", function ($scope, $routeParams, $http, SpotService)
{
	console.log("SpotHomeListController " + SpotService);
	/*
	$scope.username = $routeParams.username;
	$scope.tripId = $routeParams.username;
	$http.get("api/allFish/"+$scope.username)
		.success(function(fish)
		{
			$scope.fish = fish;
		});
	*/
});

f360.controller("SpotListController", function ($scope, $routeParams, $http, SpotService)
{
	$scope.username = $routeParams.username;
	SpotService.findAll($scope.username, function(spots)
	{
	    $scope.spots = spots;
	});
});

f360.controller("SpotNewController", function ($scope, $routeParams, $http, $location, SpotService)
{
	$scope.username = $routeParams.username;
	$scope.create = function()
	{
		if(typeof $scope.newSpot != "undefined") {
			$scope.newSpot.username = $scope.username;
			SpotService.create($scope.username, $scope.newSpot, function () {
				console.log("rew");
				history.back();
			});
		}
	}
	$scope.speciess = species;
});

f360.controller("SpotEditController", function ($scope, $routeParams, $http, $location, SpotService)
{
    $scope.username = $routeParams.username;
    SpotService.findOne($scope.username, $routeParams.id, function (response) {
        $scope.spot = response;
//        console.log(response);
    });

    $scope.update = function () {
        console.log($scope.spot);
        SpotService.update($scope.username, $routeParams.id, $scope.spot, function (response) {
            window.history.go(-1);
        });
    };

    $scope.remove = function () {
        SpotService.remove($scope.username, $routeParams.id, function (response) {
            window.history.go(-1);
        });
    }

//    console.log("SpotEditController" + SpotService);
	/*
	$scope.speciess = species;

	$scope.username = $routeParams.username;
	$scope.tripId = $routeParams.tripId;
	$scope.fishId = $routeParams.fishId;
	*/
/*
	$scope.editFish = {};
	$scope.editFish.species = "";
	var user = localStorage.getItem("user");
	if(user != null && user != "") {
		user = JSON.parse(user);
		$scope.editFish.species = user.preferences.species;
	}
*/
	/*
	$http.get("api/user/"+$scope.username+"/trip/"+$scope.tripId+"/fish/"+$scope.fishId)
		.success(function(fish)
		{
			$scope.editFish = fish;
//			$scope.editFish.species = {name: fish.species};
		});
	
	$scope.update = function()
	{
		for(var i=0; i<species.length; i++)
			if(species[i].scientific == $scope.editFish.species)
				$scope.editFish["commonName"] = species[i].common;

//		$scope.editFish.commonName = "Test Common Name";
		
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
				
				window.history.go(-2);

			});
	}
	
	$scope.remove = function()
	{
		$http.delete("api/user/"+$scope.username+"/trip/"+$scope.tripId+"/fish/"+$scope.fishId)
			.success(function(fish){
//				window.history.back();
//				$location.path( $scope.username+"/trip/"+$scope.tripId+"/fish/list" );
				window.history.go(-2);
			});
	}
	*/
});
