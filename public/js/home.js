
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
			UserPreferenceService.findOne($scope.username, function(units){
				var unitsPreferences = units.trim() !== "" ? units : "standard";
				$scope.lengthUnits = unitsPreferences.replace(/['"]+/g, '') === 'Metric' ? "cm" : "in";
				$scope.weightUnits = unitsPreferences.replace(/['"]+/g, '') === 'Metric' ? "kg" : "lbs";
			});
		}
	});
});
