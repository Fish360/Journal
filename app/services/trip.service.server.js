module.exports = function (app, db) {

    app.post('/api/:username/trip', createTrip);
    app.get('/api/:username/trip', findAllTripsForUser);
    app.get('/api/:username/trip/:tripid', findTripById);
    app.put('/api/:username/trip/:tripid', updateTrip);
    app.delete('/api/:username/trip/:tripid', deleteTrip);

    var mongojs = require('mongojs');

    function deleteTrip(req, res)
    {
        db.trip.remove({_id:mongojs.ObjectId(req.params.tripid)},
            function(err, trip){
                res.json(trip);
            });
    }

    function updateTrip(req, res)
    {
        db.trip.findAndModify( {
            query: {_id:mongojs.ObjectId(req.params.tripid)},
            update: {
                spot:req.body.spot,
                title: req.body.title,
                start: req.body.start,
                startTime: req.body.startTime,
                end: req.body.end,
                endTime: req.body.endTime,
                notes: req.body.notes,
                type: "TRIP",
                username: req.body.username,
                lastUpdated: req.body.lastUpdated
            }
        }, function(err, trip){
            res.json(trip);
        });
    }

    function createTrip(req, res)
    {
        req.body.type = "TRIP";
        req.body.fishCount = 0;
        db.trip.insert(req.body, function (err, newTrip)
        {
            res.json(newTrip);
        });
    }

    function findTripById(req, res)
    {
        db.trip.findOne({_id: mongojs.ObjectId(req.params.tripid)}, function(err, trip)
        {
            res.json(trip);
        });
    }

    function findAllTripsForUser(req, res) {
        db.trip.find({username: req.params.username}, function(err, trips)
        {
            res.json(trips);
        });
    }
};