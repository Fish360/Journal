var app = require('../../express');
var http = require('http');
var q = require('q');

app.get('/api/weather/marine', getMarineWeatherWebService);

var key = "2662b0449e6940d494801430172802";
var baseUrl = "http://api.worldweatheronline.com/premium/v1/marine.ashx?key=API_KEY&format=json&includelocation=yes&tide=yes&tp=24&q=LATLONG&date=DATE";
var basePath = "/premium/v1/marine.ashx?key=API_KEY&format=json&includelocation=yes&tide=TIDE&tp=24&q=LATLONG&date=DATE";

var api = {
    getMarineWeather: getMarineWeather
};
module.exports = api;

function getMarineWeatherWebService(req, res) {
    var latitude = req.query.latitude;
    var longitude = req.query.longitude;
    var date = new Date(req.query.date);
    var tide = req.query.tide;

    getMarineWeather(latitude, longitude, date, tide)
        .then(function (response) {
            res.json(response);
        });
}

function getMarineWeather(lat, long, date, tide) {
    var yyyy = date.getFullYear();
    var MM = date.getMonth() + 1;
    MM = MM < 10 ? "0"+MM : MM+"";
    var dd = date.getDate();
    dd = dd < 10 ? "0"+dd : dd+"";
    date = yyyy+"-"+MM+"-"+dd;
    var latlong = lat+","+long;
    var path = basePath.replace("LATLONG", latlong);
    path = path.replace("DATE", date);
    path = path.replace("API_KEY", key);
    path = path.replace("TIDE", tide);
    var host = 'http://api.worldweatheronline.com';

    var url = host + path;
    console.log(url);

    var deferred = q.defer();
    http.get({
        host: 'api.worldweatheronline.com',
        path: path
    }, function(response) {
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
            var parsed = JSON.parse(body);
            deferred.resolve(parsed);
            // res.json(parsed);
        });
    });
    return deferred.promise;
    //
    // return $http.jsonp(url);
}
