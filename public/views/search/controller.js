f360.controller("SearchListController", function ($scope, $routeParams, $http, SearchService)
{
	$scope.username = $routeParams.username;
	SearchService.findAll($scope.username, function(searches)
	{
		$scope.searches = searches;
	});
});

f360.controller("SearchNewController", function ($scope, $routeParams, $http, $location, SearchService, SpotService, GearService, JSONLoaderFactory)
{
	$scope.username = $routeParams.username;
	SpotService.findAll($scope.username, function (spots) {
		console.log(spots);
		$scope.spots = spots;
	});

	GearService.findAll($scope.username, function(gears)
	{
		console.log(gears);
		$scope.gears = gears;
	});

	$scope.search = {};
	$scope.search.searchType = "Fish";
	loadSpecies();

	function loadSpecies() {
		JSONLoaderFactory.readTextFile("../json/species.json", function(text){
	    	$scope.species = JSON.parse(text);
		   
		});
	}
	$scope.create = function()
	{
		if(validateSpecieSelection()){
			scientificName = ($scope.search.fish.species.originalObject === undefined) ? $scope.search.fish.species : $scope.search.fish.species.originalObject["ScientificName"];
			$scope.search["lastUpdated"] = new Date();

			for(var i=0; i<species.length; i++)
				if(species[i].scientific == scientificName)
					$scope.search.fish["commonName"] = species[i].common;

			$scope.search.fish.species = scientificName;		
		}

		if(typeof $scope.search != "undefined") {
			$scope.search.username = $scope.username;
			SearchService.create($scope.username, $scope.search, function () {
				history.back();
			});
		}
	}

	function validateSpecieSelection() {
		var isValidSpecies = ($scope.search.fish.species === undefined)? false : true;

		if(!isValidSpecies){
			return false;
		} 

		return true;
	}

});

f360.controller("SearchEditController", function ($scope, $routeParams, $http, $location, SearchService, SpotService, GearService, JSONLoaderFactory)
{
    loadSpecies();

	function loadSpecies() {
		JSONLoaderFactory.readTextFile("../json/species.json", function(text){
	    	$scope.species = JSON.parse(text);
		   
		});
	}
    $scope.username = $routeParams.username;
	SpotService.findAll($scope.username, function (spots) {
		console.log(spots);
		$scope.spots = spots;
	});

	GearService.findAll($scope.username, function(gears)
	{
		console.log(gears);
		$scope.gears = gears;
	});
	
	SearchService.findOne($scope.username, $routeParams.id, function (response) {
		$scope.search = response;
	});

    $scope.update = function () {
    	if(validateSpecieSelection()) {
			var scientificName = ($scope.search.fish.species.originalObject === undefined) ? $scope.search.fish.species : $scope.search.fish.species.originalObject["ScientificName"];
			
			for(var i=0; i<species.length; i++) {
				if(species[i].scientific === scientificName){
					$scope.search.fish["commonName"] = species[i].common;
				}
			}

			$scope.search.fish.species = scientificName;
		}
		
        SearchService.update($scope.username, $routeParams.id, $scope.search, function (response) {
//		window.history.go(-1);
		history.back();
        });
    };

    $scope.remove = function () {
        SearchService.remove($scope.username, $routeParams.id, function (response) {
//		window.history.go(-1);
		history.back();
        });
    }

    function validateSpecieSelection() {
		var isValidSpecies = ($scope.search.fish.species === undefined)? false : true;

		if(!isValidSpecies){
			return false;
		} 

		return true;
	}
});
