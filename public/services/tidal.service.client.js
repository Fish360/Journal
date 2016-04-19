(function(){
    f360.factory("TidalService", TidalService);
    function TidalService ($http) {
        var model = {
            findTidalInfo: findTidalInfo,
            getUTCOffset:getUTCOffset
        };
        return model;

        function findTidalInfo (date,location,callback) {
            var location_info={};
            //location_info=location.city+","+location.state;
            location_info.latitude=location.latitude;
            location_info.longitude=location.longitude;
            //var dateParts = fish.caught.split("-");
            //date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
            //var from = moment(date).format("YYYY-MM-DD");
            //var to = moment(date).add(1,'days').format("YYYY-MM-DD");
            //console.log(from);
            //console.log(to);
            console.log("location info");
            console.log(location_info);
            //var date=Math.round(fishcaughtTime.getTime()/ 1000);
            //$http.get("/api/tides/location/"+location_info+"/from/"+from+"/to/"+to)
            $http.get("/api/tides/latitude/"+location.latitude+"/longitude/"+location.longitude+"/date/"+date)
                .success(function(response){
                    console.log("response from tidal service");
                    console.log(response);
                    callback(response);
                });
        }

        function getUTCOffset(date,lat,long,callback){
            $http.get("/api/tz/date/"+date+"/latitude/"+lat+"/longitude/"+long)
                .success(function(offset){
                    console.log("timezone offset for latlong");
                    console.log(offset);
                    callback(offset);
                });
        }
    }
})();