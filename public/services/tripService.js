f360.factory('TripService', function($http){

	var findOne = function (username, tripid, callback) {
		$http.get("/api/"+username+"/trip/"+tripid)
		.success(callback);
	};
		
	return {
		findOne: findOne
	};
});