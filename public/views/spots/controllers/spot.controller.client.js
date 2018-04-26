f360.controller("SpotPhotosController", function ($scope, $routeParams, $http, SpotService) {
    $scope.username = $routeParams.username;
    $scope.spotId = $routeParams.spotId;

    $http.get("api/" + $scope.username + "/spots/" + $scope.spotId)
    .success(function (spot) {
        $scope.spot = spot;
    });

});

f360.controller("SpotPhotoController", function ($scope, $routeParams, $http, SpotService, $location) {
    $scope.username = $routeParams.username;
    $scope.spotId = $routeParams.spotId;
    $scope.photoIndex = $routeParams.photoIndex;

    $http.get("api/" + $scope.username + "/spots/" + $scope.spotId)
    .success(function (spot) {
        $scope.photo = spot.images[$scope.photoIndex];
	});

    $scope.removePhoto = function () {
        $http.delete("api/" + $scope.username + "/spots/" + $scope.spotId + "/photos/" + $scope.photoIndex)
        .success(function (spot) {
            $location.path("/" + $scope.username + "/spots/" + $scope.spotId + "/photos");
        });
    }

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

f360.controller("SpotNewController", function ($scope, $routeParams, $http, $location, SpotService, GeolocationService, LocationService, JSONLoaderFactory, UserPreferenceService, SpeciesService)
{
	$scope.username = $routeParams.username;
	$scope.newSpot = {};

	var datascientifname = [];
	var datacommonname = [];
	$scope.newSpotGroup = {};
	$scope.choicevaluegroup = false;
	var addedspecies = [];
	loadSpecies();

	function loadSpecies() {
		JSONLoaderFactory.readTextFile("../json/species.json", function(text){
	    	$scope.species = JSON.parse(text);
		   
		});
	}


	function gettingnames() {
        var data = $scope.addedspecies;
		$scope.newSpot.speciesObjects = data;
		for(var k=0;k<data.length;k++){
			datascientifname.push(data[k].originalObject["ScientificName"]);
			datacommonname.push(data[k].originalObject["CommonName"]);
		}

	}


	UserPreferenceService.findOneDefaultSpecies($scope.username, function(defaultSpecies){
		$scope.defaultSpecies = defaultSpecies;
		$scope.newSpot.species = defaultSpecies.species;
		$scope.newSpot["commonName"] = defaultSpecies.commonName;
	});

	$scope.create = function()
	{
		//commenting for now to check multiple species functionality
		/*if(validateSpecieSelection()){
			if($scope.newSpot.species.originalObject !== undefined) {
			var scientificName = ($scope.newSpot.species.originalObject === undefined) ? $scope.newSpot.species : $scope.newSpot.species.originalObject["ScientificName"];
			$scope.newSpot["lastUpdated"] = new Date();

			for(var i=0; i<species.length; i++)
				if(species[i].scientific == scientificName)
					$scope.newSpot["commonName"] = species[i].common;

			$scope.newSpot.species = scientificName;

			}	
		}*/


		//adding new code
		gettingnames();
		$scope.newSpot["commonName"] = datacommonname;
		$scope.newSpot.species = datascientifname;
        //ending new code

		if(typeof $scope.newSpot != "undefined") {
			$scope.newSpot.username = $scope.username;
			$scope.newSpot["lastUpdated"] = new Date();
			SpotService.create($scope.username, $scope.newSpot, function () {
				console.log("rew");
				history.back();
			});
		}
	}

$scope.getCurrentLocationDetails = function () {
    GeolocationService.getCurrentPosition().then(function(geoposition){
        $scope.newSpot.latitude = geoposition.coords.latitude;
        $scope.newSpot.longitude = geoposition.coords.longitude;

      	LocationService.getZipCodeFromLogLat(geoposition.coords, function (response) {
	        $scope.newSpot.street = response.address.neighbourhood;
	        $scope.newSpot.city = response.address.city;
	        $scope.newSpot.state = response.address.state;
	        $scope.newSpot.zip = response.address.postcode;
	        $scope.newSpot.country = response.address.country_code.toUpperCase();    
        });
    })
};


	$scope.speciess = species;

	function validateSpecieSelection() {
		var isValidSpecies = ($scope.newSpot.species === undefined)? false : true;

		if(!isValidSpecies){
			return false;
		} 

		return true;
	}

	function findSpotGroups() {
		SpotService.findAllGroups($scope.username, function (spotgroups) {
			$scope.spotgroups = spotgroups;

		});
	}
	findSpotGroups();


	$scope.createnewgroup = function () {
		$scope.choicevaluegroup = true;
	}

	$scope.addnewgroup = function () {
		if(typeof $scope.newSpotGroup != "undefined") {
			$scope.newSpotGroup.username = $scope.username;

			SpotService.createGroup($scope.username, $scope.newSpotGroup, function () {
				console.log("new spot group created");
				$scope.choicevaluegroup = false;
			});
		}
		findSpotGroups();
	}


	$scope.add = function add(specie) {
		if(addedspecies.indexOf(specie) == -1){
			addedspecies.push(specie);
			$scope.$broadcast('angucomplete-alt:clearInput');
		}
		else{
			window.alert("You have already added this species. Please change your selection");
		}
	}

	$scope.deletespecie = function deletespecie(specie) {
		addedspecies.splice(addedspecies.indexOf(specie),1);

	}

	$scope.addedspecies =addedspecies;


});


f360.controller("SpotEditController", function ($scope, $routeParams, $http, $location, SpotService,JSONLoaderFactory, SpeciesService)
{
    $scope.username = $routeParams.username;
	var datascientifname = [];
	var datacommonname = [];
	var addedspecies = [];
	$scope.newSpotGroup = {};
	$scope.choicevaluegroup = false;
    loadSpecies();

	function loadSpecies() {
		JSONLoaderFactory.readTextFile("../json/species.json", function(text){
	    	$scope.species = JSON.parse(text);
		   
		});
	}

    SpotService.findOne($scope.username, $routeParams.id, function (response) {
        $scope.spot = response;
		$scope.addedspecies = $scope.spot.speciesObjects;

//        console.log(response);
    });




	function gettingnames() {
		var data = $scope.addedspecies;
		$scope.spot.speciesObjects = data;
		for(var k=0;k<data.length;k++){
			datascientifname.push(data[k].originalObject["ScientificName"]);
			datacommonname.push(data[k].originalObject["CommonName"]);
		}

	}

	

	

    $scope.update = function () {

		//commenting for now to check multiple species functionality
    	/*if(validateSpecieSelection()) {
			var scientificName = ($scope.spot.species.originalObject === undefined) ? $scope.spot.species : $scope.spot.species.originalObject["ScientificName"];
			
			for(var i=0; i<species.length; i++) {
				if(species[i].scientific === scientificName){
					$scope.spot["commonName"] = species[i].common;
				}
			}

			$scope.spot.species = scientificName;
		}*/

		//adding new code
		gettingnames();
		$scope.spot["commonName"] = datacommonname;
		$scope.spot.species = datascientifname;
		//ending new code


        console.log($scope.spot);
		$scope.spot["lastUpdated"] = new Date();
		SpotService.update($scope.username, $routeParams.id, $scope.spot, function (response) {
            window.history.go(-1);
        });
    };

    $scope.remove = function () {
        SpotService.remove($scope.username, $routeParams.id, function (response) {
            window.history.go(-1);
        });
    }

    function validateSpecieSelection() {
		var isValidSpecies = ($scope.spot.species === undefined)? false : true;

		if(!isValidSpecies){
			return false;
		} 

		return true;
	}


	function findSpotGroups() {
		SpotService.findAllGroups($scope.username, function (spotgroups) {
			$scope.spotgroups = spotgroups;

		});
	}
	findSpotGroups();

	$scope.createnewgroup = function () {
		$scope.choicevaluegroup = true;
	}

	$scope.addnewgroup = function () {
		if(typeof $scope.newSpotGroup != "undefined") {
			$scope.newSpotGroup.username = $scope.username;

			SpotService.createGroup($scope.username, $scope.newSpotGroup, function () {
				console.log("new spot group created");
				$scope.choicevaluegroup = false;
			});
		}
		findSpotGroups();
	}

	$scope.add = function add(specie) {
		if($scope.addedspecies.indexOf(specie) == -1){
			$scope.addedspecies.push(specie);
			$scope.$broadcast('angucomplete-alt:clearInput');
		}
		else{
			window.alert("You have already added this species. Please change your selection");
		}
	}

	$scope.deletespecie = function deletespecie(specie) {
		$scope.addedspecies.splice($scope.addedspecies.indexOf(specie),1);

	}

	$scope.addedspecies =addedspecies;



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
