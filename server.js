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
	   update: req.body
	});
//	db.trip.update(
//		{_id:mongojs.ObjectId(req.params.tripid)},
//		req.body,
//		{multi: false},
//		function(err,trip) {
//			res.json(trip);
//	});
//	db.trip.findAndModify({
//		query: {_id:mongojs.ObjectId(req.params.tripid)},
//		update: { $set: req.body },
//		new: false
//	},	function(err,trip) {
//			res.json(trip);
//	});
});

/* Register a user
	includes new username and password
*/
app.post("/api/user", function(req, res)
{
	db.user.insert(req.body, function(err, newUser)
	{
		res.json(newUser);
	});
});

/* Find user by username
	used for registering to see if username already exists
*/
app.get("/api/user/:username", function(req, res)
{
	db.user.find({username: req.params.username}, function(err, user)
	{
		res.json(user);
	});
});

/* Find user by username and password
	used for login to check username and password
*/
app.get("/api/user/:username/:password", function(req, res)
{
	db.user.find({username: req.params.username, password: req.params.password}, function(err, user)
	{
		res.json(user);
	});
});

/*
 *	Fish
 */

app.get("/fish", function(req, res){
	db.fish.find(function(err, fishes){
		res.json(fishes);
	});
});


app.get("/fish/:id", function(req, res){
	db.fish.findOne({_id: mongojs.ObjectId(req.params.id)}, function(err, fishes){
		res.json(fishes);
	});
});

app.post("/fish", function(req, res){
	db.fish.insert(req.body, function(err, newFish){
		db.fish.find(function(err, fishes){
			res.json(fishes);
		});
	});
});

app.delete("/api/:username/fish/:id", function(req, res){
	db.fish.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, newFish){
		db.fish.find(function(err, fishes){
			res.json(fishes);
		});
	});
});

app.put("/api/:username/fish/:id", function(req, res){
	db.fish.update({_id: mongojs.ObjectId(req.params.id)}, req.body, function(err, newFish){
		db.fish.find(function(err, fishes){
			res.json(fishes);
		});
	});
});

app.listen(port, ipaddress);
