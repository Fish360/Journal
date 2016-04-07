(function(){
    f360.factory("SunMoonService", SunMoonService);
    function SunMoonService ($http) {
        var model = {
            findMoonPhase: findMoonPhase
        };
        return model;

        function findMoonPhase (fish,spot,callback) {
            var client_id="2jzr5OV98uTs3EWEAU2rv";
            var client_secret="ahvT093mrdmYSEkyLEVW5jdBsOvDwQKBBOHZjAp3";
            var dateParts = (fish.caught).split("-");
            var date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
            var from = moment(date).format("YYYY-MM-DD");
            var to = moment(date).add(1,'days').format("YYYY-MM-DD");
            //console.log(caughtDate.add(1,'days'));
            //console.log(to);
            if(spot) {
                var place_info = spot.city + "," + spot.state;
            }
            console.log("calling...");
            var url="http://api.aerisapi.com/sunmoon/"+place_info+"?client_id="+client_id+"&client_secret="+client_secret+"&from="+from+"&to="+to;
            console.log(url);
            $http.get(url)
                .success(function(moonphase){
                    callback(moonphase.response[0]);
                });
        }
    }
})();