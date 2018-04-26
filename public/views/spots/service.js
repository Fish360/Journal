f360.cache = {};

f360.factory('SpotService', function($http){
	
	var create = function(username, spot, callback) {
	    console.log(spot);
		$http.post("/api/"+username+"/spots", spot)
		.success(callback);
	};

	var createGroup = function(username, spotgroup, callback) {
		console.log(spotgroup);
		$http.post("/api/"+username+"/spotgroups", spotgroup)
			.success(callback);
	};

	var findAll = function(username, callback) {
	    $http.get("/api/"+username+"/spots")
		.success(callback);
	};

	var findAllGroups = function(username, callback) {
		$http.get("/api/"+username+"/spotgroups")
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
		createGroup:createGroup,
		findOne: findOne,
		findAll : findAll,
		findAllGroups : findAllGroups,
		update : update,
		remove : remove
	};
});


f360.factory("LocationService", function ($http)
{
  var getZipCodeFromLogLat = function (coords, callback) {
      $http.get("http://nominatim.openstreetmap.org/reverse?format=json&lat=" + coords.latitude + "&lon=" + coords.longitude + "&addressdetails=1&callback=JSON_CALLBACK")
      .success(callback)
  };

  return {
 	getZipCodeFromLogLat: getZipCodeFromLogLat
  };
});


f360.factory('GeolocationService', ['$q', '$window', function ($q, $window) {

    'use strict';

    function getCurrentPosition() {
        var deferred = $q.defer();

        if (!$window.navigator.geolocation) {
            deferred.reject('Geolocation not supported.');
        } else {
            $window.navigator.geolocation.getCurrentPosition(
                function (position) {
                    deferred.resolve(position);
                },
                function (err) {
                    deferred.reject(err);
                });
        }

        return deferred.promise;
    }

    return {
        getCurrentPosition: getCurrentPosition
    };
}]);