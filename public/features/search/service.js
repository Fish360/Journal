f360.cache = {};

f360.factory('SearchService', function($http){
	
	var create = function(username, doc, callback) {
	    $http.post("/api/"+username+"/search", doc)
		.success(callback);
	};

	var findAll = function(username, callback) {
	    $http.get("/api/"+username+"/search")
		.success(callback);
	};
	
	var findOne = function (username, id, callback) {
		$http.get("/api/"+username+"/search/" + id)
		.success(callback);
	};

	var update = function(username, id, doc, callback) {
		$http.put("/api/"+username+"/search/"+doc._id, doc)
		.success(callback);
	};
	
	var remove = function(username, id, callback) {
		$http.delete("/api/"+username+"/search/"+id)
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
