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

f360.controller("FishHomeListController", function ($scope, $routeParams, $http, UserPreferenceService)
{
	$scope.username = $routeParams.username;
	$scope.tripId = $routeParams.tripId;
	$http.get("api/allFish/"+$scope.username)
		.success(function(fish)
		{
			$scope.fish = fish;
		})
		.then(function(){
		if($scope.fish.length !== 0) {
			UserPreferenceService.findOne($scope.username, function(units){
				var unitsPreferences = units.trim() !== "" ? units : "standard";
				$scope.lengthUnits = unitsPreferences.replace(/['"]+/g, '') === 'Metric' ? "cm" : "in";
				$scope.weightUnits = unitsPreferences.replace(/['"]+/g, '') === 'Metric' ? "kg" : "lbs";
			});
		}
	});
});

f360.controller("FishListController", function($scope, $routeParams, $http, UserPreferenceService)
{
	$scope.username = $routeParams.username;
	$scope.tripId = $routeParams.tripId;
	$http.get("api/user/"+$scope.username+"/trip/"+$routeParams.tripId+"/fish")
	.success(function(fish)
	{
		$scope.fish = fish;
	})
	.then(function(){
		if($scope.fish.length !== 0) {
			UserPreferenceService.findOne($scope.username, function(units){
				var unitsPreferences = units.trim() !== "" ? units : "standard";
				$scope.lengthUnits = unitsPreferences.replace(/['"]+/g, '') === 'Metric' ? "cm" : "in";
				$scope.weightUnits = unitsPreferences.replace(/['"]+/g, '') === 'Metric' ? "kg" : "lbs";
			});
		}
	});
});

f360.controller("NewFishController", function (TidalService, $scope, $routeParams, $http, $location, SunMoonService, SpotService, GearService, TripService, PresentationsService, JSONLoaderFactory, UserPreferenceService)
{
	$scope.speciess = species;
	$scope.username = $routeParams.username;
	$scope.tripId = $routeParams.tripId;

	UserPreferenceService.findOneDefaultSpecies($scope.username, function(defaultSpecies){
		$scope.defaultSpecies = defaultSpecies;
		$scope.newFish.species = defaultSpecies.species;
		$scope.newFish["commonName"] = defaultSpecies.commonName;

	});

	loadSpecies();

	function loadSpecies() {
		JSONLoaderFactory.readTextFile("../json/species.json", function(text){
	    	$scope.species = JSON.parse(text);
		   
		});
	}

	TripService.findOne($scope.username, $scope.tripId, function(trip){
		if(trip.start !== undefined) {
			var dateParts = (trip.start).split("-");
			var date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
			var tripDate = moment(date).format("YYYY-MM-DD");
			console.log("trip start and end");
			console.log(trip.start);
			console.log(trip.end);
			$scope.newFish.minDate=trip.start.toString();
			console.log($scope.newFish.minDate);

			$scope.newFish.maxDate= trip.end.toString();
			console.log($scope.newFish.maxDate);

			if(tripDate>=trip.start && tripDate<=trip.end)
			{
				$scope.newFish.caught = tripDate;
			}
			else{
				alert("Fish Caught date must be within Trip Date range");
			}


		}
	});

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
		if(!validateSpecieSelection()){
			return;
		}

		var url = "api/user/"+$scope.username+"/trip/"+$scope.tripId+"/fish";

		$scope.newFish["lastUpdated"] = new Date();
		if($scope.newFish.species.originalObject !== undefined) {
		var	scientificName = ($scope.newFish.species.originalObject === undefined) ? $scope.newFish.species : $scope.newFish.species.originalObject["ScientificName"];

		for(var i=0; i<species.length; i++)
			if(species[i].scientific == scientificName)
				$scope.newFish["commonName"] = species[i].common;

		$scope.newFish.species = scientificName;
		}

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
	if(user && user != "undefined") {
	    user = JSON.parse(user);
//		$scope.newFish.species = user.preferences.species;
	}

//	SpotService.findAll($scope.username, function (response) {
//	    $scope.newFish.spots = response;
//	});

	function validateFishDates(){
		var caughtDate=$scope.newFish.caught;
		console.log(caughtDate);
		var trip = TripService.findOne($scope.username,$scope.tripId,function(trip){
			if(trip.start<=caughtDate && trip.end >= caughtDate){
				return true;
			}
			else{
				alert("Fish Caught date must be within trip range");
				//$location.url("/"+$scope.username+"/trip/"+$scope.tripId+"/fish/new");
				return false;
			}
		});
		//console.log(trip);
		//return true;
	}

	function validateSpecieSelection() {
		var isValidSpecies = ($scope.newFish.species === undefined)? false : true;
		if(!isValidSpecies){
			alert("Please enter valid specie");
			return false;
		}
		var isValidSelectionOfSpecies = ($scope.newFish.species.originalObject === undefined && $scope.newFish.commonName === undefined)? false : true;
		if(!isValidSelectionOfSpecies){
			alert("Please enter valid specie");
			return false;
		}

		return true;
	}

	$scope.loadMoonPhase = function(){
		if ($scope.newFish.spot) {
			SpotService.findOne($scope.username, $scope.newFish.spot, function (spot) {
				var fishCaughtTime;
				if (spot.latitude && spot.longitude) {
					if ($scope.newFish.caughtTime != undefined) {
						fishCaughtTime = new Date($scope.newFish.caught + "T" + $scope.newFish.caughtTime + ":00");
					}
					else {
						fishCaughtTime = new Date($scope.newFish.caught);
					}
					var date = Math.round(fishCaughtTime.getTime() / 1000);
					TidalService.getUTCOffset(date, spot.latitude, spot.longitude, function (offset) {
						SunMoonService.findSunMoonPhase($scope.newFish, spot, function (response) {
							var phase = response.moonphase.phase;
							$scope.newFish.moonphase = (phase < 0.25) ? "New Moon" : (phase < 0.5) ? "First Quarter"
								: (phase < 0.75) ? "Full Moon" : "Last Quarter";
							$scope.newFish.sunriseTime = moment(response.sundetails.sunrise).tz(offset.timeZoneId).format("HH:mm");
							$scope.newFish.moonriseTime = moment(response.moondetails.rise).tz(offset.timeZoneId).format("HH:mm");
							$scope.newFish.sunsetTime = moment(response.sundetails.sunset).tz(offset.timeZoneId).format("HH:mm");
							$scope.newFish.moonsetTime = moment(response.moondetails.set).tz(offset.timeZoneId).format("HH:mm");
						});
						date=date-offset.dstOffset-offset.rawOffset;
						TidalService.findTidalInfo(date, spot, function (tideInfo) {
							var max = -1000;

							$scope.peaks = f360.peakeSorter(tideInfo.heights);
							// for (var i = 1; i < tideInfo.heights.length - 1; ++i) {
							// 	if (tideInfo.heights[i-1].height < tideInfo.heights[i].height && tideInfo.heights[i].height > tideInfo.heights[i+1].height) {
							// 		tideInfo.heights[i].type = "High";
							// 		$scope.peaks.push(tideInfo.heights[i])
							// 	}
							// 	if (tideInfo.heights[i-1].height > tideInfo.heights[i].height && tideInfo.heights[i].height < tideInfo.heights[i+1].height) {
							// 		tideInfo.heights[i].type = "Low";
							// 		$scope.peaks.push(tideInfo.heights[i])
							// 	}
							// }
                            //
							// $scope.peaks.sort(function(a, b) {
							// 	return parseFloat(b.date) - parseFloat(a.date);
							// });
							$scope.max = max;
							$scope.tideInfo = tideInfo;
							$scope.newFish.tideInfo = tideInfo;
							$scope.newFish.tideheight = tideInfo.heights[0].height;
							date = tideInfo.heights[0].date;
							$scope.newFish.tidetime = moment(date).tz(offset.timeZoneId).format("HH:mm");
							if (tideInfo.extremes != null) {
								$scope.newFish.ExtremeTideType = tideInfo.extremes[0].type;
								date = tideInfo.extremes[0].date;
								$scope.newFish.ExtremeTideTime = moment(date).tz(offset.timeZoneId).format("HH:mm");
								$scope.newFish.ExtremeTideHeight = tideInfo.extremes[0].height;
							}
						});
					});
				}
			});
		}
	}
});

f360.peakeSorter = function(heights) {
	var peaks = [];
	for (var i = 1; i < heights.length - 1; ++i) {
		if (heights[i-1].height < heights[i].height && heights[i].height > heights[i+1].height) {
			heights[i].type = "High";
			peaks.push(heights[i])
		}
		if (heights[i-1].height > heights[i].height && heights[i].height < heights[i+1].height) {
			heights[i].type = "Low";
			peaks.push(heights[i])
		}
	}
	peaks.sort(function(a, b) {
		return parseFloat(b.date) - parseFloat(a.date);
	});
	return peaks;
}

f360.controller("EditFishController", function (WorldWeatherOnlineService, TidalService, $scope, $routeParams, $http, $location, SpotService, GearService, PresentationsService, JSONLoaderFactory,TripService,SunMoonService)
{
	//$(".f360-number").numeric({ decimal : ".",  negative : false, scale: 3 });

	$scope.username = $routeParams.username;
	$scope.tripId = $routeParams.tripId;
	$scope.fishId = $routeParams.fishId;
	loadSpecies();

	function loadSpecies() {
		JSONLoaderFactory.readTextFile("../json/species.json", function(text){
	    	$scope.species = JSON.parse(text);
		   
		});
	}

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
					loadMoonPhase();
				}).then(function(){
					if($scope.editFish.caught === undefined)
					   $scope.setTripCaughtDate();
				});
			});
		});
	});
	
	$scope.setTripCaughtDate = function() {
		TripService.findOne($scope.username, $scope.tripId, function(trip){
			if(trip.start !== undefined) {
				var dateParts = (trip.start).split("-");
				var date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
				var tripDate = moment(date).format("YYYY-MM-DD");
                if(tripDate>=trip.start && tripDate<=trip.end)
				{
					$scope.editFish.caught = tripDate;
				}
				else{
					alert("Fish Caught date must be within Trip Date range");
				}
			}
		});
	}

	$scope.update = function()
	{
		if(!validateSpecieSelection()) {
			return;
		}

		var scientificName = ($scope.editFish.species.originalObject === undefined) ? $scope.editFish.species : $scope.editFish.species.originalObject["ScientificName"];
		
		for(var i=0; i<species.length; i++) {
			if(species[i].scientific === scientificName){
				$scope.editFish["commonName"] = species[i].common;
			}
		}
		
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
		$scope.editFish.species = scientificName;
		$scope.editFish["lastUpdated"] = new Date();
		$http.put("api/user/"+$scope.username+"/trip/"+$scope.tripId+"/fish/"+$scope.fishId, $scope.editFish)
			.success(function(fish){
				var preferences = {
					species : $scope.editFish.species
				};
				
				var user = localStorage.getItem("user");
				if(user && user != "undefined") {
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

	$scope.loadMoonPhase = loadMoonPhase;

	function loadMoonPhase(){
		if ($scope.editFish.spot) {
			SpotService.findOne($scope.username, $scope.editFish.spot, function (spot) {
				var fishCaughtTime;
				if (spot.latitude && spot.longitude) {
					if ($scope.editFish.caughtTime != undefined) {
						fishCaughtTime = new Date($scope.editFish.caught + "T" + $scope.editFish.caughtTime + ":00");
					}
					else {
						fishCaughtTime = new Date($scope.editFish.caught);
					}
					var date = Math.round(fishCaughtTime.getTime() / 1000);

					WorldWeatherOnlineService
						.getMarineWeather(spot.latitude, spot.longitude, fishCaughtTime)
						.then(
							function(response) {
								$scope.weather = response.data.data.weather;
							},
							function(error) {
								console.log(error);
							}
						);

					TidalService.getUTCOffset(date, spot.latitude, spot.longitude, function (offset) {
						SunMoonService.findSunMoonPhase($scope.editFish, spot, function (response) {
							var phase = response.moonphase.phase;
							$scope.editFish.moonphase = (phase < 0.25) ? "New Moon" : (phase < 0.5) ? "First Quarter"
								: (phase < 0.75) ? "Full Moon" : "Last Quarter";
							$scope.editFish.sunriseTime = moment(response.sundetails.sunrise).tz(offset.timeZoneId).format("HH:mm");
							$scope.editFish.moonriseTime = moment(response.moondetails.rise).tz(offset.timeZoneId).format("HH:mm");
							$scope.editFish.sunsetTime = moment(response.sundetails.sunset).tz(offset.timeZoneId).format("HH:mm");
							$scope.editFish.moonsetTime = moment(response.moondetails.set).tz(offset.timeZoneId).format("HH:mm");
						});
						date=date-offset.dstOffset-offset.rawOffset;
						TidalService.findTidalInfo(date, spot, function (tideInfo) {

							$scope.peaks = f360.peakeSorter(tideInfo.heights);

							$scope.editFish.tideInfo = tideInfo;
							$scope.editFish.tideheight = tideInfo.heights[0].height;
							date = tideInfo.heights[0].date;
							$scope.editFish.tidetime = moment(date).tz(offset.timeZoneId).format("HH:mm");
							if (tideInfo.extremes != null) {
								$scope.editFish.ExtremeTideType = tideInfo.extremes[0].type;
								date = tideInfo.extremes[0].date;
								$scope.editFish.ExtremeTideTime = moment(date).tz(offset.timeZoneId).format("HH:mm");
								$scope.editFish.ExtremeTideHeight = tideInfo.extremes[0].height;
							}
						});
					});
				}
			});
		}
	}

	function validateSpecieSelection() {
		var isValidSpecies = ($scope.editFish.species === undefined)? false : true;

		if(!isValidSpecies){
			alert("Please enter valid specie");
			return false;
		} 

		return true;
	}
});

