f360.controller("TripPhotosController", function ($scope, $routeParams, $http, SpotService) {
    $scope.username = $routeParams.username;
    $scope.tripId = $routeParams.tripId;

    $http.get("api/" + $scope.username + "/trip/" + $scope.tripId)
	.success(function (trip) {
		$scope.trip = trip;
	});
});

f360.controller("TripPhotoController", function ($scope, $routeParams, $http, SpotService, $location) {
    $scope.username = $routeParams.username;
    $scope.tripId = $routeParams.tripId;
    $scope.photoIndex = $routeParams.photoIndex;

    $http.get("api/" + $scope.username + "/trip/" + $scope.tripId)
	.success(function (trip) {
	    $scope.photo = trip.images[$scope.photoIndex];
	});

    $scope.removePhoto = function () {
        $http.delete("api/" + $scope.username + "/trip/" + $scope.tripId + "/photos/" + $scope.photoIndex)
        .success(function (trip) {
			var url = $location.url();
			if(url.indexOf("photosFromHome") > -1) {
				$location.path("/" + $scope.username + "/trip/" + $scope.tripId + "/photosFromHome");
			} else {
				$location.path("/" + $scope.username + "/trip/" + $scope.tripId + "/photos");
			}
        });
    }
});


f360.controller("TripListController", function($scope, $routeParams, $http,SpotService)
{
	setTimeout(function(){
		document.body.scrollTop = document.documentElement.scrollTop = -1000;
	}, 100);


	$scope.username = $routeParams.username;

	$http.get("api/"+$scope.username+"/trip")
	.success(function(trips)
	{
		$scope.trips = trips;
	});

});

f360.controller("NewTripController", function($scope, $routeParams, $http, $location, SpotService)
{
	$scope.username = $routeParams.username;

	SpotService.findAll($scope.username, function (spots) {
		$scope.spots = spots;
	});

	$scope.create = function()
	{
		$scope.newTrip.username = $scope.username
		$scope.newTrip["lastUpdated"] = new Date();
		console.log("[1]");
		console.log($scope.newTrip);
		$http.post("api/" + $scope.username + "/trip", $scope.newTrip)
		.success(function(trips)
		{
		    console.log("[5]");
		    console.log(trips);
		    $location.path($scope.username + "/trip/list");
		});
	}
});

f360.controller("EditTripController", function(WorldWeatherOnlineService,$scope, $routeParams, $http, $location,SpotService)
{
	$scope.username = $routeParams.username;
	var tripid = $routeParams.tripid;

	SpotService.findAll($scope.username, function (spots) {
		$scope.spots = spots;
		console.log("spots are" + $scope.spots);
		$http.get("api/" + $scope.username + "/trip/" + tripid)
			.success(function (trip) {
				$scope.editTrip = trip;
				loadMarineWeather();
				console.log(trip)
			});
	});

	$scope.loadMarineWeather = loadMarineWeather;

	function loadMarineWeather(){
		console.log("called loadMarineWeather");
		if ($scope.editTrip.spot) {
			console.log($scope.username+"username is");
			console.log($scope.editTrip.spot+"spot id is");

			SpotService.findOne($scope.username, $scope.editTrip.spot, function (spot) {
				var tripTime;
				console.log(spot.latitude+"this is latitude");
				if (spot.latitude && spot.longitude) {
					if ($scope.editTrip.startTime != undefined) {
						tripTime = new Date($scope.editTrip.start + "T" + $scope.editTrip.startTime + ":00");
					}
					else {

						tripTime = new Date($scope.editTrip.start);
					}

					if(!$scope.editTrip.weather) {
						WorldWeatherOnlineService
							.getMarineWeather(spot.latitude, spot.longitude, tripTime)
							.then(
								function (response) {
									console.log("weathericon"+response.data.data.weather[0].weatherIconUrl);
									$scope.editTrip.weather = response.data.data.weather;
								},
								function (error) {
									console.log(error);
								}
							);
					}}}
			);}}
	
	$scope.update = function()
	{
		console.log("could not find  spot"+$scope.editTrip.spot);
		$scope.editTrip.username = $scope.username;
		$scope.editTrip["lastUpdated"] = new Date();
		$http.put("api/"+$scope.username+"/trip/"+tripid, $scope.editTrip)
			.success(function(trip){
				$location.path( $scope.username+"/trip/list" );
			});
	}
	
	$scope.remove = function()
	{
		var removeConfirm = confirm("Are you sure you want to remove this trip?");
		if(removeConfirm) {
		$http.delete("api/"+$scope.username+"/trip/"+tripid)
			.success(function(trip){
				$location.path( $scope.username+"/trip/list" );
			});
		} else {
			return false;
		}
	}
});
