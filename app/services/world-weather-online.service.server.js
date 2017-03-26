var app = require('../../express');

// app.get('/api/weather/marine', )

var key = "2662b0449e6940d494801430172802";
var baseUrl = "http://api.worldweatheronline.com/premium/v1/marine.ashx?callback=JSON_CALLBACK&key=API_KEY&format=json&includelocation=yes&tide=yes&tp=24&q=LATLONG&date=DATE";

var api = {
    getMarineWeather: getMarineWeather
};
module.exports = api;

function WorldWeatherOnlineService($http) {

    function getMarineWeather(lat, long, date) {
        var yyyy = date.getFullYear();
        var MM = date.getMonth() + 1;
        MM = MM < 10 ? "0"+MM : MM+"";
        var dd = date.getDate();
        dd = dd < 10 ? "0"+dd : dd+"";
        date = yyyy+"-"+MM+"-"+dd;
        var latlong = lat+","+long;
        var url = baseUrl.replace("LATLONG", latlong);
        url = url.replace("DATE", date);
        url = url.replace("API_KEY", key);
        return $http.jsonp(url);
    }
}
