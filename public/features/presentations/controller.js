f360.controller("PresentationsListController", function ($scope, $routeParams, $http, PresentationsService)
{
	$scope.username = $routeParams.username;
	PresentationsService.findAll($scope.username, function(presentations)
	{
	    $scope.presentations = presentations;
	});
});

f360.controller("PresentationsNewController", function ($scope, $routeParams, $http, $location, PresentationsService)
{
	$scope.username = $routeParams.username;
	$scope.create = function()
	{
		if(typeof $scope.presentation != "undefined") {
			$scope.presentation.username = $scope.username;
			PresentationsService.create($scope.username, $scope.presentation, function () {
				history.back();
			});
		}
	}
	$scope.speciess = species;
});

f360.controller("PresentationsEditController", function ($scope, $routeParams, $http, $location, PresentationsService)
{
    $scope.username = $routeParams.username;
    PresentationsService.findOne($scope.username, $routeParams.id, function (response) {
        $scope.presentation = response;
    });

    $scope.update = function () {
        PresentationsService.update($scope.username, $routeParams.id, $scope.presentation, function (response) {
            window.history.go(-1);
        });
    };

    $scope.remove = function () {
        PresentationsService.remove($scope.username, $routeParams.id, function (response) {
            window.history.go(-1);
        });
    }
});
