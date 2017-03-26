var app = require('../../express');
var suncalc=require('suncalc');

app.get("/api/sunmoonphase/:date/latitude/:latitude/longitude/:longitude", findSunMoonPhaseInfo);

var api = {
    findSunMoonPhase: findSunMoonPhase
};

module.exports = api;

function findSunMoonPhase(date, latitude, longitude) {
    var response = {
        sundetails  : suncalc.getTimes(date, latitude, longitude),
        moondetails : suncalc.getMoonTimes(date, latitude, longitude),
        moonphase   : suncalc.getMoonIllumination(date)
    };
    return response;
}

function findSunMoonPhaseInfo(req,res){
    var latitude=req.params.latitude;
    var longitude=req.params.longitude;
    var date=new Date(req.params.date);
    date.setDate(date.getDate() + 1);
    var response = findSunMoonPhase(date, latitude, longitude)
    return res.json(response);
}
