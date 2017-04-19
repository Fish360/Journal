f360.service('FishService', function($http){
	this.findFishForTrip = findFishForTrip;

	function findFishForTrip(username, tripId) {
		return $http
			.get("api/user/"+username+"/trip/"+tripId+"/fish")
			.then(function (response) {
				var fish = response.data;
				for(var f in fish) {
					fish[f].caught = new Date(fish[f].caught);
				}
				return response.data;
			});

	}
});