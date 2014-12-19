module.exports = function(app, db, mongojs) {
	// find
	app.get("/api/:username/searchResults/:searchId", function(req, res){
		db.search.findOne({ _id: mongojs.ObjectId(req.params.searchId)}, function (err, search) {
			console.log(search);
			var query = {};
			if(search.searchType == "Fish")
			{
				query.username = req.params.username;

				if(search.fish.moonphase) {
					query.moonphase = search.fish.moonphase;
				}
				if(search.fish.spot) {
					query.spot = search.fish.spot;
				}
				if(search.fish.presentation) {
					query.presentation = search.fish.presentation;
				}
				if(search.fish.girthComparator != '') {
					if(search.fish.girthComparator == 'Less Than') {
						query.girth = {$lte : search.fish.girthValue};
					} else if(search.fish.girthComparator == 'Equal To') {
						query.girth = search.fish.girthValue;
					} else if(search.fish.girthComparator == 'Greater Than') {
						query.girth = {$gte : search.fish.girthValue};
					}
				}
				if(search.fish.lengthComparator != '') {
					if(search.fish.lengthComparator == 'Less Than') {
						query.length = {$lte : search.fish.lengthValue};
					} else if(search.fish.lengthComparator == 'Equal To') {
						query.length = search.fish.lengthValue;
					} else if(search.fish.lengthComparator == 'Greater Than') {
						query.length = {$gte : search.fish.lengthValue};
					}
				}
				if(search.fish.weightComparator != '') {
					if(search.fish.weightComparator == 'Less Than') {
						query.weight = {$lte : search.fish.weightValue};
					} else if(search.fish.weightComparator == 'Equal To') {
						query.weight = search.fish.weightValue;
					} else if(search.fish.weightComparator == 'Greater Than') {
						query.weight = {$gte : search.fish.weightValue};
					}
				}
				if(search.fish.species) {
					query.species = search.fish.species;
				}

				console.log(query);
				
				db.fish.find(query, function(err, fish){
					console.log(fish);
					res.json(fish);
				});
			}
			else if(search.searchType == "Trips")
			{
				if(search.trips.title) {
					query.title = {$regex: search.trips.title};
				}
				if(search.trips.fromDate && search.trips.toDate) {
					query.start = {$gte : search.trips.fromDate, $lte : search.trips.toDate};
					query.end = {$lte : search.trips.toDate};
				} else if(search.trips.fromDate) {
					query.start = {$gte : search.trips.fromDate};
				} else if(search.trips.toDate) {
					query.end = {$lte : search.trips.toDate};
				}
				console.log(query);
				db.trip.find(query, function(err, trips){
					console.log(trips);
					res.json(trips);
				});
			}
		});
	});
}
