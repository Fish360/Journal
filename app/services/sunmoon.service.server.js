
var suncalc=require('suncalc');
module.exports = function (app) {
    app.get("/api/sunmoonphase/:date/latitude/:latitude/longitude/:longitude", findSunMoonPhaseInfo);


    function findSunMoonPhaseInfo(req,res){
        var response={};
        var latitude=req.params.latitude;
        var longitude=req.params.longitude;
        var date=new Date(req.params.date);
        date.setDate(date.getDate() + 1);
        response.sundetails=suncalc.getTimes(date,latitude,longitude);
        response.moondetails=suncalc.getMoonTimes(date,latitude,longitude);
        response.moonphase=suncalc.getMoonIllumination(date);
        return res.json(response);
    }
}
