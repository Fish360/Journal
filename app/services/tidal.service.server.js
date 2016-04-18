var http = require('http');
var tzwhere = require('tzwhere')
tzwhere.init();
module.exports = function (app) {
    //app.get("/api/tides/location/:location/from/:from/to/:to", findTidalInfo);
    app.get("/api/tides/latitude/:latitude/longitude/:longitude/date/:date", findTidalInfo);
    app.get("/api/tz/latitude/:latitude/longitude/:longitude", findUTCOffset);


    function findTidalInfo(req,res){
        var response={};
        //var location=req.params.location;
        //console.log(location.latitude);
        //var from=req.params.from;
        //var to=req.params.to;
        //console.log(from);
        //console.log(to);
        var date=req.params.date;
        //var client_id="2jzr5OV98uTs3EWEAU2rv";
        //var client_secret="ahvT093mrdmYSEkyLEVW5jdBsOvDwQKBBOHZjAp3";
        var client_secret="87b3a520-67a2-4774-a40b-bee811fa0421";
        //var url="http://api.aerisapi.com/tides/"+location+"?client_id="+client_id+"&client_secret="+client_secret+"&from="+from+"&to="+to;
        //var url="/tides/"+location+"?client_id="+client_id+"&client_secret="+client_secret+"&from="+from+"&to="+to;
        var url="/api?heights&extremes&lat="+req.params.latitude+"&lon="+req.params.longitude+"&key="+client_secret+"&start="+date+"&length=43200";

        console.log(url);
        //http.get(url)
        //    .success(function(tideInfo){
        //        console.log(tideInfo);
        //        //callback(moonphase.response[0]);
        //    });
        http.get({
            host: 'www.worldtides.info',
            path: url
        }, function(response) {
            // Continuously update stream with data
            var body = '';
            response.on('data', function(d) {
                body += d;
            });
            response.on('end', function() {

                // Data reception is done, do whatever with it!
                var parsed = JSON.parse(body);
                res.json(parsed);
            });
        });
        //console.log(date);
        //var dateParts = date.split("-");
        //date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
        //var from = moment(date).format("YYYY-MM-DD");
        //var to = moment(date).add(1,'days').format("YYYY-MM-DD");
        //console.log(from);
        //console.log(to);
        //date.setDate(date.getDate() + 1);
        //response.sundetails=suncalc.getTimes(date,latitude,longitude);
        //response.moondetails=suncalc.getMoonTimes(date,latitude,longitude);
        //response.moonphase=suncalc.getMoonIllumination(date);
        //return res.json(response);
    }

    function findUTCOffset(req,res){
        var lat=req.params.latitude;
        var long=req.params.longitude;
        res.json(tzwhere.tzOffsetAt(lat,long)/1000);
    }
}