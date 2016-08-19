(function(){
    f360.factory("SunMoonService", SunMoonService);
    function SunMoonService ($http) {
        var model = {
            findSunMoonPhase: findSunMoonPhase,
            findSunMoonPhase2: findSunMoonPhase2
        };
        return model;

        function findSunMoonPhase (fish,spot,callback) {
            $http.get("/api/sunmoonphase/"+fish.caught+"/latitude/"+spot.latitude+"/longitude/"+spot.longitude)
                .success(function(response){
                    callback(response);
                });
        }

        function findSunMoonPhase2 (date,latitude,longitude,callback) {
            $http.get("/api/sunmoonphase/"+date+"/latitude/"+latitude+"/longitude/"+longitude)
                .success(function(response){
                    callback(response);
                });
        }
    }
})();