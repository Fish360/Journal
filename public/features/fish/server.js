module.exports = function(app, db) {
	// create
	app.post("/api/fish", function(req, res){
		console.log("CREATE");
		req.body.type = "FISH";
		console.log(req.body);
		db.fish.insert(req.body, function(err, doc){
			res.json(doc);
		});
	});
	// find all
	app.get("/api/fish/:username", function(req, res){
		var username = req.params.username;
		console.log("FINDALL GET /api/fish");
		db.fish.find({username:username},function(err, docs){
			res.json(docs);
		});
	});
	// find
	app.get("/api/fish/:username/:id", function(req, res){
		console.log("FIND GET /api/fish/" + req.params.id);
	});
	// update
	app.put("/api/fish/:id", function(req, res){
		console.log("UPDATE");
	});
	// delete
	app.delete("/api/fish/:id", function(req, res){
		console.log("DELETE");
	});
}
