f360.cache = {};

f360.factory('SpotService', function($http){
	
	var create = function(username, spot, callback) {
	    console.log(spot);
		$http.post("/api/"+username+"/spots", spot)
		.success(callback);
	};

	var findAll = function(username, callback) {
	    $http.get("/api/"+username+"/spots")
		.success(callback);
	};
	
	var findOne = function (username, id, callback) {
		$http.get("/api/"+username+"/spots/" + id)
		.success(callback);
	};

	var update = function(username, id, spot, callback) {
		$http.put("/api/"+username+"/spots/"+spot._id, spot)
		.success(callback);
	};
	
	var remove = function(username, id, callback) {
		$http.delete("/api/"+username+"/spots/"+id)
		.success(callback);
	};
		
	return {
		create : create,
		findOne: findOne,
		findAll : findAll,
		update : update,
		remove : remove
	};
});
