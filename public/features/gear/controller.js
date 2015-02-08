f360.controller("GearPhotosController", function ($scope, $routeParams, $http, GearService) {
    $scope.username = $routeParams.username;
    $scope.gearId = $routeParams.gearId;

    console.log($scope.username);
    console.log($scope.gearId);

    GearService.findOne($scope.username, $scope.gearId, function (response) {
        $scope.gear = response;
    });
});

f360.controller("GearPhotoController", function ($scope, $routeParams, $http, GearService, $location) {
    $scope.username = $routeParams.username;
    $scope.gearId = $routeParams.gearId;
    $scope.photoIndex = $routeParams.photoIndex;

    GearService.findOne($scope.username, $scope.gearId, function (response) {
        $scope.gear = response;
        $scope.photo = $scope.gear.images[$scope.photoIndex];
    });

    $scope.removePhoto = function () {
        GearService.remove($scope.username, $scope.gearId, function () {
            $location.path("/" + $scope.username + "/gear/" + $scope.gearId + "/photos");
        });
    }
});

f360.controller("GearListController", function ($scope, $routeParams, $http, GearService)
{
	$scope.username = $routeParams.username;
	GearService.findAll($scope.username, function(gears)
	{
		$scope.gears = gears;
	});
	$scope.presentationType = "Rod";
});

f360.controller("GearNewController", function ($scope, $routeParams, $http, $location, GearService)
{
	$scope.username = $routeParams.username;
	$scope.create = function()
	{
		if(typeof $scope.gear != "undefined") {
		    $scope.gear.username = $scope.username;
		    console.log("[1]");
		    console.log($scope.gear);
		    GearService.create($scope.username, $scope.gear, function (response) {
			    console.log("[10]");
			    console.log(response);
				history.back();
			});
		}
	}
	$scope.speciess = species;
});

f360.controller("GearEditController", function ($scope, $routeParams, $http, $location, GearService)
{
    $scope.username = $routeParams.username;
    $scope.gearId = $routeParams.id;
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
