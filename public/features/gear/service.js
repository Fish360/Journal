f360.cache = {};

f360.factory('GearService', function($http){
	
	var create = function(username, doc, callback) {
	    $http.post("/api/"+username+"/gear", doc)
		.success(callback);
	};

	var findAll = function(username, callback) {
	    $http.get("/api/"+username+"/gear")
		.success(callback);
	};
	
	var findOne = function (username, id, callback) {
		$http.get("/api/"+username+"/gear/" + id)
		.success(callback);
	};

	var update = function(username, id, doc, callback) {
		$http.put("/api/"+username+"/gear/"+doc._id, doc)
		.success(callback);
	};
	
	var remove = function(username, id, callback) {
		$http.delete("/api/"+username+"/gear/"+id)
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
