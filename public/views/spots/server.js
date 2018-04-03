module.exports = function(app, db, mongojs) {
	// create
    app.post("/api/:username/spots", function (req, res) {
		console.log("CREATE");
		req.body.type = "SPOT";
		console.log(req.body);
		db.spots.insert(req.body, function(err, newSpot){
			res.json(newSpot);
		});
	});
	//create new spot group
	app.post("/api/:username/spotgroups", function (req, res) {
		console.log("CREATE GROUP");
		req.body.type = "SPOTGROUP";
		console.log(req.body);
		db.spotgroups.insert(req.body, function(err, newSpotGroup){
			res.json(newSpotGroup);
		});
	});

	// find all
	app.get("/api/:username/spots", function (req, res) {
		var username = req.params.username;
		console.log("FINDALL GET /api/spots");
		db.spots.find({username:username},function(err, spots){
			res.json(spots);
		});
	});

	// find all groups
	app.get("/api/:username/spotgroups", function (req, res) {
		var username = req.params.username;
		console.log("FINDALLGROUPS GET /api/spotgroups");
		db.spotgroups.find({username:username},function(err, spotgroups){
			res.json(spotgroups);
		});
	});

	// find
	app.get("/api/:username/spots/:id", function(req, res){
		console.log("FIND GET /api/spots/" + req.params.id);
		db.spots.findOne({ _id: mongojs.ObjectId(req.params.id)}, function (err, doc) {
		    res.json(doc);
		});
	});
	// update
	app.put("/api/:username/spots/:id", function (req, res) {
	    console.log("UPDATE");
	    var newDoc = req.body;
	    delete newDoc._id;
	    db.spots.findAndModify({
	        query: { _id: mongojs.ObjectId(req.params.id) },
	        update: { $set: newDoc },
	        new: true
	    }, function (err, doc, lastErrorObject) {
	        res.json(doc);
	    });

	});
	// delete
	app.delete("/api/:username/spots/:id", function (req, res) {
	    console.log("DELETE");
	    db.spots.remove(
            {_id: mongojs.ObjectId(req.params.id)},
            true,
            function (err, doc) {
                res.json(doc);
            }
        );
	});
}
