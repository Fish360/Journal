// set up ======================================================================
var mongojs   = require('mongojs');
var express   = require('express');
var app       = express(); 								// create our app w/ express
var port  	  = process.env.OPENSHIFT_NODEJS_PORT || 8080; 				// set the port
var ipaddress = process.env.OPENSHIFT_NODEJS_IP;

var connection_string = '127.0.0.1:27017/f360';

if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
	connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
	process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
	process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
	process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
	process.env.OPENSHIFT_APP_NAME;
}

var db = mongojs(connection_string, ['user', 'trip', 'fish']);

app.configure(function() {
	app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
	app.use(express.logger('dev')); 						// log every request to the console
	app.use(express.bodyParser()); 							// pull information from html in POST
	app.use(express.methodOverride()); 						// simulate DELETE and PUT
});

app.get('/api/:username/events', function(req, res)
{
	db.trip.find({username: req.params.username}, function(err, trips)
	{
		var events = trips;
		db.fish.find({username: req.params.username}, function(err, fish) {
			if(typeof fish != "undefined" && fish != null) {
				for(var i=0; i<fish.length; i++) {
					events.push(fish[i]);
				}
			}
			res.json(events);
		});
	});
});

/*
 *	Trips
 */

// Get all trips for username
app.get('/api/:username/trip', function(req, res)
{
	db.trip.find({username: req.params.username}, function(err, trips)
	{
		res.json(trips);
	});
});

// Get a specific trip for a username
app.get('/api/:username/trip/:tripid', function(req, res)
{
	db.trip.findOne({_id: mongojs.ObjectId(req.params.tripid)}, function(err, trip)
	{
		res.json(trip);
	});
});

// Create a new trip for username
app.post('/api/:username/trip', function(req, res)
{
	req.body.type = "TRIP";
	db.trip.insert(req.body, function(err, newTrip)
	{
		res.json(newTrip);
	});
});

// Update trip
app.put('/api/:username/trip/:tripid', function(req, res)
{
	db.trip.findAndModify( {
	   query: {_id:mongojs.ObjectId(req.params.tripid)},
	   update: {
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
});

// Delete trip
app.delete('/api/:username/trip/:tripid', function(req, res)
{
	db.trip.remove({_id:mongojs.ObjectId(req.params.tripid)},
	function(err, trip){
		res.json(trip);
	});
});

/*
 * User
 */

// Register a user includes new username and password
app.post("/api/user", function(req, res)
{
	db.user.insert(req.body, function(err, newUser)
	{
		res.json(newUser);
	});
});

// Find user by username used for registering to see if username already exists
app.get("/api/user/:username", function(req, res)
{
	db.user.find({username: req.params.username}, function(err, user)
	{
		res.json(user);
	});
});

// Find user by username and password used for login to check username and password
app.get("/api/user/:username/:password", function(req, res)
{
	db.user.find({username: req.params.username, password: req.params.password}, function(err, user)
	{
		res.json(user);
	});
});

app.post("/api/user/:username/preferences", function(req, res)
{
	console.log("Preferences");

	db.user.findAndModify({
		query: {username: req.params.username},
		update: {$set : {preferences: req.body	}},
		new: false}, function(err, doc, lastErrorObject)
	{
		console.log(err);
		console.log(doc);
		console.log(lastErrorObject);
	});
});
// update profile
app.put("/api/user/:username", function(req, res)
{
	console.log(req.body);
	delete req.body._id;
	db.user.update({username: req.params.username}, req.body, function(err, doc)
	{
		console.log(err);
		console.log(doc);
	});
});

/*
 *	Fish
 */
// Get all fish for a given trip ID
app.get("/api/user/:username/trip/:tripid/fish", function(req, res)
{
	db.fish.find({trip_id: mongojs.ObjectId(req.params.tripid)}, function(err, fishes)
	{
		res.json(fishes);
	});
});
// Get all fish for a user
app.get("/api/allFish/:username", function(req, res)
{
	console.log("Get all fish for user " + req.params.username);
	db.fish.find({username: req.params.username}, function(err, fish)
	{
		res.json(fish);
	});
});
// Create a new Fish
app.post("/api/user/:username/trip/:tripid/fish", function(req, res)
{
	var newFish = req.body;
	newFish.type = "FISH";
	var username = req.params.username;
	newFish.trip_id = mongojs.ObjectId(req.params.tripid);
	newFish.username = username;
	db.fish.insert(newFish, function(err, newFish)
	{
		res.json(newFish);
	});
});
// Get a particular fish
app.get("/api/user/:username/trip/:tripid/fish/:fishid", function(req, res){
	db.fish.findOne({_id: mongojs.ObjectId(req.params.fishid)}, function(err, fishes){
		res.json(fishes);
	});
});
// Delete a particular fish
app.delete("/api/user/:username/trip/:tripid/fish/:fishid", function(req, res){
	db.fish.remove({_id: mongojs.ObjectId(req.params.fishid)}, function(err, newFish){
		db.fish.find(function(err, fishes){
			res.json(fishes);
		});
	});
});
// Update a fish
app.put("/api/user/:username/trip/:tripId/fish/:id", function(req, res){
	console.log(req.params.id);
	console.log(req.body);
	delete req.body._id;
	req.body.trip_id = mongojs.ObjectId(req.params.tripId);
	req.body.type = "FISH";
	req.body.username = req.params.username;

	db.fish.update({_id: mongojs.ObjectId(req.params.id)}, req.body, function(err, newFish){
		console.log("err:");
		console.log(err);
		console.log("newFish:");
		console.log(newFish);
		db.fish.find(function(err, fishes){
			res.json(fishes);
		});
	});
});

app.listen(port, ipaddress);
