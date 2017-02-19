f360.controller("SearchResultsListController", function ($scope, $routeParams, $http, SearchResultsService)
{
	$scope.username = $routeParams.username;
	$scope.searchId = $routeParams.searchId;
	console.log(SearchResultsService);
	SearchResultsService.search($scope.username, $scope.searchId, function(results)
	{
		$scope.searchResults = results;
	});
});
