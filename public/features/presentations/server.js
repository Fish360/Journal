module.exports = function(app, db, mongojs) {
	// create
	app.post("/api/:username/presentations", function (req, res) {
		console.log("CREATE");
		req.body.type = "PRESENTATION";
		console.log(req.body);
		db.presentations.insert(req.body, function(err, doc){
			res.json(doc);
		});
	});
	// find all
	app.get("/api/:username/presentations", function (req, res) {
		var username = req.params.username;
		console.log("FINDALL GET /api/presentations");
		db.presentations.find({username:username},function(err, docs){
			res.json(docs);
		});
	});
	// find
	app.get("/api/:username/presentations/:id", function(req, res){
		console.log("FIND GET /api/presentations/" + req.params.id);
		db.presentations.findOne({ _id: mongojs.ObjectId(req.params.id)}, function (err, doc) {
		    res.json(doc);
		});
	});
	// update
	app.put("/api/:username/presentations/:id", function (req, res) {
	    console.log("UPDATE");
	    var newDoc = req.body;
	    delete newDoc._id;
	    db.presentations.findAndModify({
	        query: { _id: mongojs.ObjectId(req.params.id) },
	        update: { $set: newDoc },
	        new: true
	    }, function (err, doc, lastErrorObject) {
	        res.json(doc);
	    });

	});
	// delete
	app.delete("/api/:username/presentations/:id", function (req, res) {
	    console.log("DELETE");
	    db.presentations.remove(
            {_id: mongojs.ObjectId(req.params.id)},
            true,
            function (err, doc) {
                res.json(doc);
            }
        );
	});
}
