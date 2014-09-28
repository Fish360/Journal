module.exports = function(app, db) {
	// create
	app.post("/api/spots", function(req, res){
		console.log("CREATE");
		req.body.type = "SPOT";
		console.log(req.body);
		db.spots.insert(req.body, function(err, newSpot){
			res.json(newSpot);
		});
	});
	// find all
	app.get("/api/spots/:username", function(req, res){
		var username = req.params.username;
		console.log("FINDALL GET /api/spots");
		db.spots.find({username:username},function(err, spots){
			res.json(spots);
		});
	});
	// find
	app.get("/api/spots/:username/:id", function(req, res){
		console.log("FIND GET /api/spots/" + req.params.id);
	});
	// update
	app.put("/api/spots/:id", function(req, res){
		console.log("UPDATE");
	});
	// delete
	app.delete("/api/spots/:id", function(req, res){
		console.log("DELETE");
	});
}
