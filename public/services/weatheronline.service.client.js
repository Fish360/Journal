(function(){
    angular
        .module("f360")
        .factory("WorldWeatherOnlineService", WorldWeatherOnlineService);

    var api = "http://api.worldweatheronline.com/premium/v1/past-marine.ashx?key=b7dd5188ce31412fb3f220036163005&q=70,45&format=json&includelocation=yes&tide=yes&tp=24";
    var key = "c5256aff2a4f44c4917233610161306";
    var baseUrl = "http://api.worldweatheronline.com/premium/v1/past-marine.ashx?callback=JSON_CALLBACK&key=b7dd5188ce31412fb3f220036163005&format=json&includelocation=yes&tide=yes&tp=24&q=LATLONG&date=DATE";

    function WorldWeatherOnlineService($http) {
        var api = {
            getMarineWeather: getMarineWeather
        };
        return api;

        function getMarineWeather(lat, long, date) {
            // lat = "42.7497";
            // long = "70.7971";
            var yyyy = date.getFullYear();
            var MM = date.getMonth() + 1;
            MM = MM < 10 ? "0"+MM : MM+"";
            var dd = date.getDate();
            dd = dd < 10 ? "0"+dd : dd+"";
            date = yyyy+"-"+MM+"-"+dd;
            var latlong = lat+","+long;
            var url = baseUrl.replace("LATLONG", latlong);
            url = url.replace("DATE", date);
            return $http.jsonp(url);
        }
    }
})();