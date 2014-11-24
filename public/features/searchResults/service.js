f360.cache = {};

f360.factory('SearchResultsService', function($http){
	
	var search = function (username, searchId, callback) {
		console.log('SearchResultsService');
		console.log(searchId);
		$http.get("/api/"+username+"/searchResults/" + searchId)
		.success(callback);
	};
		
	return {
		search : search
	};
});
