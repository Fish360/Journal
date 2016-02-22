
f360.controller("HomeController", function($scope, $routeParams, $http, UserPreferenceService)
{
	console.log("Home Controller");
	$scope.username = $routeParams.username;
	$http.get("api/"+$routeParams.username+"/events")
		.success(function(events){
			for(var e in events) {
				events[e].lastUpdated = new Date(events[e].lastUpdated);
			}
			$scope.events = events;
		})
		.then(function(){
			if($scope.events.length !== 0) {
				UserPreferenceService.findOne($scope.username, function(user){
					var units = user[0].units ? user[0].units : "standard";
					$scope.lengthUnits = units === "standard" ? "in" : "cm";
					$scope.weightUnits = units === "standard" ? "lbs" : "kg";
				});
			}
		});
});
