
f360.controller("HomeController", function($scope, $routeParams, $http, $filter)
{
	console.log("Home Controller");
	$scope.username = $routeParams.username;
	$http.get("api/"+$routeParams.username+"/events")
		.success(function(events){
			for(var e in events) {
//				events[e].lastUpdated = $filter('date')(events[e].lastUpdated, 'yyyy-MM-ddThh:mm:ss+hh:mm');
				events[e].lastUpdated = new Date(events[e].lastUpdated);
			}
			$scope.events = events;
//			$location.path( $scope.username+"/home" );
		});
});
