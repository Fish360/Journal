f360.controller("TripPhotosController", TripPhotosController);
f360.controller("TripPhotoController", TripPhotoController);
f360.controller("TripListController", TripListController);
f360.controller("NewTripController", NewTripController);
f360.controller("EditTripController", EditTripController);

function TripListController($scope, $routeParams, $http,SpotService)
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

}

function NewTripController($scope,
						   $routeParams,
						   $http,
						   $location,
						   SpotService,
						   WorldWeatherOnlineService)
{
	$scope.username = $routeParams.username;
	$scope.loadMarineWeather = loadMarineWeather;
	$scope.create = create;

	function init() {
		SpotService.findAll($scope.username, function (spots) {
			$scope.spots = spots;
		});
	}
	init();

	function loadMarineWeather(){
		if ($scope.newTrip.spot) {
			SpotService.findOne($scope.username, $scope.newTrip.spot, function (spot) {
				var tripTime;

				if (spot.latitude && spot.longitude && $scope.newTrip.start)
				{
					var start = $scope.newTrip.start.replace(/-/g, '/');
					if (typeof $scope.newTrip.startTime != "undefined")
					{
						tripTime = new Date(start + "T" + $scope.newTrip.startTime + ":00");
					}
					else
					{
						tripTime = new Date(start);
					}

					WorldWeatherOnlineService
						.getMarineWeather(spot.latitude, spot.longitude, tripTime)
						.then(
							function (response) {
								$scope.newTrip.weather = response.data.data.weather;
							},
							function (error) {
								console.log(error);
							}
						);
				}
			});
		}
	}

	function create() {
		$scope.newTrip.username = $scope.username
		$scope.newTrip["lastUpdated"] = new Date();
		$http.post("api/" + $scope.username + "/trip", $scope.newTrip)
		.success(function(trips)
		{
		    $location.path($scope.username + "/trip/list");
		});
	}
}

function EditTripController(WorldWeatherOnlineService,$scope, $routeParams, $http, $location,SpotService)
{
	$scope.username = $routeParams.username;
	var tripid = $routeParams.tripid;

	SpotService.findAll($scope.username, function (spots) {
		$scope.spots = spots;
		$http.get("api/" + $scope.username + "/trip/" + tripid)
			.success(function (trip) {
				$scope.editTrip = trip;
				loadMarineWeather();
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
}

function TripPhotosController($scope, $routeParams, $http, SpotService) {
	$scope.username = $routeParams.username;
	$scope.tripId = $routeParams.tripId;

	$http.get("api/" + $scope.username + "/trip/" + $scope.tripId)
		.success(function (trip) {
			$scope.trip = trip;
		});
}

function TripPhotoController($scope, $routeParams, $http, SpotService, $location) {
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
}