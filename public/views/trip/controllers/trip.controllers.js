(function () {
	angular
		.module('f360')
		.controller("TripPhotosController", TripPhotosController)
		.controller("TripPhotoController", TripPhotoController)
		.controller("TripListController", TripListController)
		.controller("NewTripController", NewTripController)
		.controller("EditTripController", EditTripController);

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
				$scope.trip= {};
			});
		}
		init();

		function loadMarineWeather(){
			if ($scope.trip.spot) {
				SpotService.findOne($scope.username, $scope.trip.spot, function (spot) {
					var tripTime;

					if (spot.latitude && spot.longitude && $scope.trip.start)
					{

						tripTime = new Date($scope.trip.start);
						WorldWeatherOnlineService
							.getMarineWeather(spot.latitude, spot.longitude, tripTime)
							.then(
								function (response) {
									$scope.trip.weather = response.data.data.weather;
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
			$scope.trip.username = $scope.username
			$scope.trip["lastUpdated"] = new Date();
			$http.post("api/" + $scope.username + "/trip", $scope.trip)
			.success(function(trips)
			{
				$location.path($scope.username + "/trip/list");
			});
		}
	}

	function EditTripController(WorldWeatherOnlineService,$scope, $routeParams, $http, $location,SpotService,SunMoonService, TidalService)
	{
		$scope.username = $routeParams.username;
		var tripid = $routeParams.tripid;

		SpotService.findAll($scope.username, function (spots) {
			$scope.spots = spots;
			$http.get("api/" + $scope.username + "/trip/" + tripid)
				.success(function (trip) {
					trip.start = new Date(trip.start);
					trip.end   = new Date(trip.end);
					trip.startTime = new Date(trip.startTime);
					trip.endTime = new Date(trip.endTime);
					$scope.trip = trip;
					loadMarineWeather();
				});
		});

		combineDateAndTime = function(date, time) {
			timeString = time.getHours() + ':' + time.getMinutes() + ':00';

			var year = date.getFullYear();
			var month = date.getMonth() + 1; // Jan is 0, dec is 11
			var day = date.getDate();
			var dateString = '' + year + '-' + month + '-' + day;
			var combined = new Date(dateString + ' ' + timeString);

			return combined;
		};

		$scope.loadMarineWeather = loadMarineWeather;



		function loadMarineWeather(){
			if ($scope.trip.spot) {

				SpotService.findOne($scope.username, $scope.trip.spot, function (spot) {
					var tripTime;
					if (spot.latitude && spot.longitude) {
						if ($scope.trip.startTime != undefined) {
							tripTime = combineDateAndTime($scope.trip.start, $scope.trip.startTime);
						}
						else {
							tripTime = new Date($scope.trip.start);

						}

                        // var date = Math.round(tripTime.getTime() / 1000);   //added the date for the trip..

						if(!$scope.trip.weather) {
							WorldWeatherOnlineService
								.getMarineWeather(spot.latitude, spot.longitude, tripTime)
								.then(
									function (response) {
										$scope.trip.weather = response.data.data.weather;
									},
									function (error) {
										console.log(error);
									}
								);
						}
						TidalService.getUTCOffset(tripTime, spot.latitude, spot.longitude, function (offset) {
							if(offset.status !== "INVALID_REQUEST") {
								SunMoonService.findSunMoonPhase2(tripTime, spot.latitude, spot.longitude, function (response) {
									var phase = response.moonphase.phase;
									$scope.trip.moonPhase = (phase < 0.25) ? "New Moon" : (phase < 0.5) ? "First Quarter"
										: (phase < 0.75) ? "Full Moon" : "Last Quarter";
								});
							}
						});
					}}
				);}}

		$scope.update = function()
		{
			$scope.trip.username = $scope.username;
			$scope.trip["lastUpdated"] = new Date();
			$http.put("api/"+$scope.username+"/trip/"+tripid, $scope.trip)
				.success(function(trip){
					$location.path( $scope.username+"/trip/list" );
				});
		};

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
})();
