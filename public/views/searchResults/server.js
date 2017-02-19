module.exports = function(app, db, mongojs) {
	// find
	app.get("/api/:username/searchResults/:searchId", function(req, res){
	    db.search.findOne({ _id: mongojs.ObjectId(req.params.searchId)}, function (err, search) {
	        console.log(search);
	        var query = {};
	        query.username = req.params.username;
	        if(search.searchType == "Reels")
	        {
	            query.gearType = "Reel";
	            if (search.reels) {
	                if (search.reels.name) {
	                    query.name = { $regex: search.reels.name };
	                }
	                if (search.reels.manufacturer) {
	                    query.manufacturer = { $regex: search.reels.manufacturer };
	                }
	                if (search.reels.model) {
	                    query.model = { $regex: search.reels.model };
	                }
	                if (search.reels.weight) {
	                    query.weight = search.reels.weight;
	                }
	                if (search.reels.gearRatio) {
	                    query.gearRatio = search.reels.gearRatio;
	                }
	                if (search.reels.lineCapacity) {
	                    query.lineCapacity = search.reels.lineCapacity;
	                }
	                if (search.reels.maxDrag) {
	                    query.maxDrag = search.reels.maxDrag;
	                }
	            }
	            db.gear.find(query, function (err, gear) {
	                console.log(gear);
	                res.json(gear);
	            });
	        }
	        else if(search.searchType == "Rods")
	        {
	            query.gearType = "Rod";
	            if(search.rods)
	            {
	                if (search.rods.name) {
	                    query.name = { $regex: search.rods.name };
	                }
	                if (search.rods.manufacturer) {
	                    query.manufacturer = { $regex: search.rods.manufacturer };
	                }
	                if (search.rods.model) {
	                    query.model = { $regex: search.rods.model };
	                }
	                if (search.rods.length) {
	                    query.length = search.rods.length;
	                }
	                if (search.rods.action) {
	                    query.action = { $regex: search.rods.action };
	                }
	                if (search.rods.power) {
	                    query.power = { $regex: search.rods.power };
	                }
	                if (search.rods.pieces) {
	                    query.pieces = { $regex: search.rods.pieces };
	                }
	            }
	            db.gear.find(query, function (err, gear) {
	                console.log(gear);
	                res.json(gear);
	            });
	        }
	        else if(search.searchType == "Lines")
	        {
	            query.gearType = "Line";
	            if (search.lines) {
	                if (search.lines.name) {
	                    query.name = { $regex: search.lines.name };
	                }
	                if (search.lines.manufacturer) {
	                    query.manufacturer = { $regex: search.lines.manufacturer };
	                }
	                if (search.lines.model) {
	                    query.model = { $regex: search.lines.model };
	                }
	                if (search.lines.strength) {
	                    query.strength = search.lines.strength;
	                }
	                if (search.lines.color) {
	                    query.color = search.lines.color;
	                }
                }
	        }
	        else if (search.searchType == "Leaders") {
	            query.gearType = "Leader";
	            if (search.leaders) {
	                if (search.leaders.name) {
	                    query.name = { $regex: search.leaders.name };
	                }
	                if (search.leaders.line) {
	                    query.line = { $regex: search.leaders.line };
	                }
	            }
	            db.gear.find(query, function (err, gear) {
	                console.log(gear);
	                res.json(gear);
	            });
	        }
	        else if (search.searchType == "Presentations") {
	            query.gearType = "Presentation";
	     //       query.presentation = {};
	            if (search.presentations) {
	                if (search.presentations.name) {
	                    query.name = { $regex: search.presentations.name };
	                }
	                if (search.presentations.type) {
	                    query["presentation.presentationType"] = search.presentations.type;
	                }
	                if (search.presentations.description) {
	                    query["presentation.description"] = { $regex: search.presentations.description };
	                }
	                if (search.presentations.pattern) {
	                    query["presentation.pattern"] = { $regex: search.presentations.pattern };
	                }
	                if (search.presentations.color) {
	                    query["presentation.color"] = { $regex: search.presentations.color };
	                }
	                if (search.presentations.manufacturer) {
	                    query["presentation.manufacturer"] = { $regex: search.presentations.manufacturer };
	                }
	                if (search.presentations.model) {
	                    query["presentation.model"] = { $regex: search.presentations.model };
	                }
	                if (search.presentations.length) {
	                    query["presentation.length"] = { $regex: search.presentations.length };
	                }
	                if (search.presentations.weight) {
	                    query["presentation.weight"] = { $regex: search.presentations.weight };
	                }
	                if (search.presentations.notes) {
	                    query["presentation.notes"] = { $regex: search.presentations.notes };
	                }
                }
	            console.log(query);
	            db.gear.find(query, function (err, gear) {
	                console.log(gear);
	                res.json(gear);
	            });
	        }
	        else if (search.searchType == "Spots")
			{
			    if (typeof search.spots != "undefined")
			    {
				    if(search.spots.zip) {
					    query.zip = search.spots.zip;
				    }
				    if(search.spots.name) {
					    query.name = {$regex: search.spots.name};
				    }
				    if(search.spots.street) {
					    query.street = {$regex: search.spots.street};
				    }
				    if(search.spots.city) {
					    query.city = {$regex: search.spots.city};
				    }
				    if(search.spots.state) {
					    query.state = {$regex: search.spots.state};
				    }
				    if(search.spots.country) {
					    query.country = {$regex: search.spots.country};
				    }
				    if(search.spots.water) {
					    query.water = {$regex: search.spots.water};
				    }
			    }
			    db.spots.find(query, function (err, spots) {
					console.log(spots);
					res.json(spots);
				});
			}
			else if(search.searchType == "Fish")
			{
			    if (typeof search.fish != "undefined")
			    {
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
			    }
				console.log(query);
				
				db.fish.find(query, function(err, fish){
					console.log(fish);
					res.json(fish);
				});
			}
			else if(search.searchType == "Trips")
			{
			    if (typeof search.trips != "undefined")
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
