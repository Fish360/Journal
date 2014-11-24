f360.controller("SearchListController", function ($scope, $routeParams, $http, SearchService)
{
	$scope.username = $routeParams.username;
	SearchService.findAll($scope.username, function(searches)
	{
		$scope.searches = searches;
	});
});

f360.controller("SearchNewController", function ($scope, $routeParams, $http, $location, SearchService, SpotService, GearService)
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
	$scope.speciess = species;
	$scope.create = function()
	{
		if(typeof $scope.search != "undefined") {
			$scope.search.username = $scope.username;
			
			SearchService.create($scope.username, $scope.search, function () {
				history.back();
			});
		}
	}
});

f360.controller("SearchEditController", function ($scope, $routeParams, $http, $location, SearchService, SpotService, GearService)
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
	
	SearchService.findOne($scope.username, $routeParams.id, function (response) {
		$scope.search = response;
	});

    $scope.update = function () {
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
});
