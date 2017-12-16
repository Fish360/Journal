(function(){
    angular
        .module("f360")
        .factory("WorldWeatherOnlineService", WorldWeatherOnlineService);

    // var api = "http://api.worldweatheronline.com/premium/v1/past-marine.ashx?key=b7dd5188ce31412fb3f220036163005&q=70,45&format=json&includelocation=yes&tide=yes&tp=24";
    // var key = "c5256aff2a4f44c4917233610161306";
    // var key = "14c2d659cd53449ea01234024161308";
    var key = "2662b0449e6940d494801430172802";
    // var baseUrl = "http://api.worldweatheronline.com/premium/v1/past-marine.ashx?callback=JSON_CALLBACK&key=API_KEY&format=json&includelocation=yes&tide=yes&tp=24&q=LATLONG&date=DATE";
    var baseUrl = "https://api.worldweatheronline.com/premium/v1/marine.ashx?callback=JSON_CALLBACK&key=API_KEY&format=json&includelocation=yes&tide=yes&tp=24&q=LATLONG&date=DATE";

    function WorldWeatherOnlineService($http) {
        var api = {
            getMarineWeather: getMarineWeather
        };
        return api;

        function getMarineWeather(lat, long, date) {
            console.log(date);
            var d = date.toISOString().slice(0,10);
            console.log(d);
            var latlong = lat+","+long;
            var url = baseUrl.replace("LATLONG", latlong);
            url = url.replace("DATE", d);
            url = url.replace("API_KEY", key);
            return $http.jsonp(url);
        }

        function dateToMarinWeatherDateString(date) {
            console.log(date)
            return date.toISOString().slice(0,10);
        }
    }
})();