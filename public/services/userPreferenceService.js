f360.factory('UserPreferenceService', function($http){

	var findOne = function (username, callback) {
		$http.get("/api/user/"+username)
		.success(callback);
	};
		
	return {
		findOne: findOne
	};
});