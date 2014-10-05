f360.controller("GearListController", function ($scope, $routeParams, $http, GearService)
{
	$scope.username = $routeParams.username;
	GearService.findAll($scope.username, function(gears)
	{
	    $scope.gears = gears;
	});
});

f360.controller("GearNewController", function ($scope, $routeParams, $http, $location, GearService)
{
	$scope.username = $routeParams.username;
	$scope.create = function()
	{
		if(typeof $scope.gear != "undefined") {
			$scope.gear.username = $scope.username;
			GearService.create($scope.username, $scope.gear, function () {
				history.back();
			});
		}
	}
	$scope.speciess = species;
});

f360.controller("GearEditController", function ($scope, $routeParams, $http, $location, GearService)
{
    $scope.username = $routeParams.username;
    GearService.findOne($scope.username, $routeParams.id, function (response) {
        $scope.gear = response;
    });

    $scope.update = function () {
        GearService.update($scope.username, $routeParams.id, $scope.gear, function (response) {
            window.history.go(-1);
        });
    };

    $scope.remove = function () {
        GearService.remove($scope.username, $routeParams.id, function (response) {
            window.history.go(-1);
        });
    }
});
