module.exports = function(app, db, mongojs) {
	// create
	app.post("/api/:username/search", function (req, res) {
		db.search.insert(req.body, function(err, doc){
			res.json(doc);
		});
	});
	// find all
	app.get("/api/:username/search", function (req, res) {
		var username = req.params.username;
		db.search.find({username:username},function(err, docs){
			res.json(docs);
		});
	});
	// find
	app.get("/api/:username/search/:id", function(req, res){
		db.search.findOne({ _id: mongojs.ObjectId(req.params.id)}, function (err, doc) {
		    res.json(doc);
		});
	});
	// update
	app.put("/api/:username/search/:id", function (req, res) {
	    var newDoc = req.body;
	    delete newDoc._id;
	    db.search.findAndModify({
	        query: { _id: mongojs.ObjectId(req.params.id) },
	        update: { $set: newDoc },
	        new: true
	    }, function (err, doc, lastErrorObject) {
	        res.json(doc);
	    });

	});
	// delete
	app.delete("/api/:username/search/:id", function (req, res) {
	    db.search.remove(
            {_id: mongojs.ObjectId(req.params.id)},
            true,
            function (err, doc) {
                res.json(doc);
            }
        );
	});
}
