f360.cache = {};

f360.factory('SpotService', function($http){
	
	var create = function(spot, callback) {
		console.log(spot);
		$http.post("/api/spots", spot)
		.success(callback);
	};

	var findAll = function(username, callback) {
		$http.get("/api/spots/"+username)
		.success(callback);
	};
	
	var find = function(id, callback) {
		$http.get("/api/spots/" + id)
		.success(callback);
	};

	var update = function(spot) {
		$http.get("/api/spots/"+spot._id, spot)
		.success(callback);
	};
	
	var remove = function(id) {
		$http.delete("/api/spots/"+spot._id)
		.success(callback);
	};
		
	return {
		create : create,
		find : find,
		findAll : findAll,
		update : update,
		remove : remove
	};
});
