f360.cache = {};

f360.factory('PresentationsService', function($http){
	
	var create = function(username, doc, callback) {
	    $http.post("/api/"+username+"/presentations", doc)
		.success(callback);
	};

	var findAll = function(username, callback) {
	    $http.get("/api/"+username+"/presentations")
		.success(callback);
	};
	
	var findOne = function (username, id, callback) {
		$http.get("/api/"+username+"/presentations/" + id)
		.success(callback);
	};

	var update = function(username, id, doc, callback) {
		$http.put("/api/"+username+"/presentations/"+doc._id, doc)
		.success(callback);
	};
	
	var remove = function(username, id, callback) {
		$http.delete("/api/"+username+"/presentations/"+id)
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
