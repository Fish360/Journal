module.exports = function (app, db, mongojs) {

	// create
    app.post("/api/:username/gear", function (req, res) {
        console.log("[3]");
        console.log(req);
        console.log("[4]");
        console.log(req.body);
        console.log("[5]");
		req.body.type = "GEAR";
		console.log(req.body);
		db.gear.insert(req.body, function (err, doc) {
		    console.log("[6]");
		    console.log(doc);
		    res.json(doc);
		});
	});
	// find all
	app.get("/api/:username/gear", function (req, res) {
		var username = req.params.username;
		console.log("FINDALL GET /api/gear");
		db.gear.find({username:username},function(err, docs){
			res.json(docs);
		});
	});
	// find
	app.get("/api/:username/gear/:id", function(req, res){
		console.log("FIND GET /api/gear/" + req.params.id);
		db.gear.findOne({ _id: mongojs.ObjectId(req.params.id)}, function (err, doc) {
		    res.json(doc);
		});
	});
	// update
	app.put("/api/:username/gear/:id", function (req, res) {
	    console.log("UPDATE");
	    console.log(req.body);
	    var newDoc = req.body;
	    delete newDoc._id;
	    db.gear.findAndModify({
	        query: { _id: mongojs.ObjectId(req.params.id) },
	        update: { $set: newDoc },
	        new: true
	    }, function (err, doc, lastErrorObject) {
	        res.json(doc);
	    });

	});
	// delete
	app.delete("/api/:username/gear/:id", function (req, res) {
	    console.log("DELETE");
	    db.gear.remove(
            {_id: mongojs.ObjectId(req.params.id)},
            true,
            function (err, doc) {
                res.json(doc);
            }
        );
	});
}
