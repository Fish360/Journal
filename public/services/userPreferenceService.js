f360.factory('UserPreferenceService', function($http){

	var findOne = function (username, callback) {
		$http.get("/api/user/"+username+"/preferences/units")
		.success(callback);
	};
	
	var findOneDefaultSpecies = function (username, callback) {
		$http.get("/api/user/"+username+"/preferences/defaultspecies")
		.success(callback);
	};

	return {
		findOne: findOne,
		findOneDefaultSpecies: findOneDefaultSpecies
	};
});