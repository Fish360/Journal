// set up ======================================================================
var braintree = require("braintree");
var generatePassword = require('password-generator');
var mongojs = require('mongojs');
var app       = require('./express');
var express   = app.express;
var port  	  = process.env.PORT || 3000;
var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
var multer = require("multer");
var fs = require('fs');
var done = false;




//var crypto= require('crypto');
//var bcrypt= require('bcrypt');
//var q= require('q');

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
		user: process.env.F360_GMAIL_USERNAME,
		pass: process.env.F360_GMAIL_PASSWORD
    }
});

var gateway = braintree.connect({
	environment: braintree.Environment.Production,
	merchantId: "msffcs8dcd3wch6v",//"tcjtq7fcjbttnfb5",
	publicKey: "7zf5swwb8tcrbhgh",//"3yfhgcysvp6dzxw8",
	privateKey: "1f0afa0854f544008ae8277348c1104a"//"c4c214a0904450885fae523afdfb47a9"
});

app.configure(function () {
    app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
    app.use(express.logger('dev')); 						// log every request to the console
    app.use(express.bodyParser({ uploadDir: './public/uploads' })); 							// pull information from html in POST
    app.use(express.json()); 							// pull information from html in POST
    app.use(express.urlencoded());
    app.use(express.methodOverride()); 						// simulate DELETE and PUT
});

/*
app.post('/:entity/photo', function (req, res) {
    var entity = req.params.entity;
    var entityId = req.body.id;
    var username = req.body.username;
    var path = req.files.userPhoto.path;
    if (path.indexOf("\\") > -1)
        path = path.split("\\");
    else
        path = path.split("/");
    fileName = path[path.length - 1];
    db[entity].findOne({ _id: mongojs.ObjectId(entityId) }, function (err, doc) {
        if (typeof doc.images == "undefined") {
            doc.images = [];
        }
        doc.images.push(fileName);
        db[entity].save(doc, function () {
            res.redirect("/#/" + username + "/" + entity + "/" + entityId + "/photos");
        });
    });
});

*/

var spots = require('./public/views/spots/server.js');
var presentations = require('./public/views/presentations/server.js');
var gear = require('./public/views/gear/server.js');
var fish = require('./public/views/spots/server.js');
var search = require('./public/views/search/server.js');
var searchResults = require('./public/views/searchResults/server.js');
var weatheronlineService = require('./app/services/world-weather-online.service.server');

var connection_string = '127.0.0.1:27017/f360';

if(process.env.MONGODB_URI) {
	connection_string = process.env.MONGODB_URI;
}

var db = mongojs(connection_string, ['user', 'trip', 'fish', 'spots', 'gear', 'presentations', 'search', 'report']);
var userModel=require("./app/models/user.model.server.js")(db);
var mandrill  = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('EW3Z7X-JJDSZwb1DigccCA');
var email     = require('./modules/email/email.js')(app, mandrill_client, db, generatePassword);

presentations(app, db, mongojs);
spots(app, db, mongojs);
gear(app, db, mongojs);
search(app, db, mongojs);
searchResults(app, db, mongojs);

app.get('/api/browser', function (req, res) {
    var r = require('ua-parser').parse(req.headers['user-agent']);
    var family = r.device.family;
    res.send(family);
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
			db.spots.find({username: req.params.username}, function(err, spots) {
				if(typeof spots != "undefined" && spots != null) {
					for(var i=0; i<spots.length; i++) {
						events.push(spots[i]);
					}
				}
				db.gear.find({username: req.params.username}, function(err, gear) {
					if(typeof gear != "undefined" && gear != null) {
						for(var i=0; i<gear.length; i++) {
							events.push(gear[i]);
						}
					}
					res.json(events);
				});
			});
		});
	});
});

/*
 *	Trips
 */

// Remove picture

app.delete('/api/:username/spots/:spotId/photos/:photoIndex', function (req, res) {
    var spotId = req.params.spotId;
    db.spots.findOne({ _id: mongojs.ObjectId(spotId) }, function (err, spot) {
        spot.images.splice(req.params.photoIndex, 1);
        db.spots.save(spot, function (err, spot) {
            res.send(err);
        });
    });
});

app.delete('/api/:username/trip/:tripId/photos/:photoIndex', function (req, res) {
    var tripId = req.params.tripId;
    db.trip.findOne({ _id: mongojs.ObjectId(tripId) }, function (err, trip) {
        trip.images.splice(req.params.photoIndex, 1);
        db.trip.save(trip, function (err, trip) {
            res.send(err);
        });
    });
});

app.delete('/api/:username/trip/:tripId/fish/:fishId/photos/:photoIndex', function (req, res) {
    var fishId = req.params.fishId;
    db.fish.findOne({ _id: mongojs.ObjectId(fishId) }, function (err, fish) {
        fish.images.splice(req.params.photoIndex, 1);
        db.fish.save(fish, function (err, fish) {
            res.send(err);
        });
    });
});

require("./app/services/trip.service.server")(app, db);
require("./app/services/user.service.server")(app, db);
require('./app/services/photo.service.server')(app, db);

app.post("/api/:username/trip/:tripId/fish/:fishId/share", function (req, res) {
	var mailObject = req.body;


	transporter.sendMail({
		to:mailObject.email,
		subject:mailObject.subject,
		html: 'Hi '+ mailObject.username +', <br> <br>  Congratulations on catching ' + mailObject.species +
		'. Please find below the details of your catch <br> <br> Species Name :'+mailObject.species
		+'<br> <br> Common Name : '+ mailObject.common_name +'<br> <br> Length : '+ mailObject.length
		+'<br> <br> Images: <br>'+ mailObject.imgfile+'<br>'
	});
	res.send("email");
});


/*
 *	Fish
 */
// Get all fish for a given trip ID
app.get("/api/user/:username/trip/:tripid/fish", function(req, res)
{
	if(req.params.tripid === "undefined") {
        res.json([]);
	} else {
        db.fish.find({trip_id: mongojs.ObjectId(req.params.tripid)}, function(err, fishes)
        {
            res.json(fishes);
        });
	}
});
// Get all fish for a user
app.get("/api/allFish/:username", function(req, res)
{
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
	    db.trip.findAndModify({
	        query: { _id: mongojs.ObjectId(req.params.tripid) },
	        update: {
	            $inc: {fishCount : 1}
	        }
	    }, function (err, trip) {
	        res.json(newFish);
	    });
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
	    db.fish.find(function (err, fishes) {
	        db.trip.findAndModify({
	            query: { _id: mongojs.ObjectId(req.params.tripid) },
	            update: {
	                $inc: { fishCount: -1 }
	            }
	        }, function (err, trip) {
	            res.json(fishes);
	        });
		});
	});
});
// Update a fish
app.put("/api/user/:username/trip/:tripId/fish/:id", function(req, res){
	delete req.body._id;
	req.body.trip_id = mongojs.ObjectId(req.params.tripId);
	req.body.type = "FISH";
	req.body.username = req.params.username;

	db.fish.update({_id: mongojs.ObjectId(req.params.id)}, req.body, function(err, newFish){
		db.fish.find(function(err, fishes){
			res.json(fishes);
		});
	});
});


app.post("/checkout", checkout);
app.get("/client_token", getClientToken);

function getClientToken (req, res) {
	gateway.clientToken.generate({}, function (err, response) {
		res.send(response.clientToken);
	});
}

function checkout(req, res) {
	var nonceFromTheClient = req.body.payment_method_nonce;
	var customer = req.body;
	var username = customer.username;

	gateway.customer.create({
		firstName: customer.firstName,
		lastName: customer.lastName,
		email: customer.email,
		//,paymentMethodNonce: nonceFromTheClient
	}, function (err, result) {
		var customer = result.customer;

		gateway.paymentMethod.create({
			customerId: customer.id,
			paymentMethodNonce: nonceFromTheClient
		}, function (err, result) {
			var paypalAccount = result.paypalAccount;
			var paymentMethod = result.paymentMethod;

			gateway.subscription.create({
				paymentMethodToken: paymentMethod.token,
				planId: "fish360proangler",//"cs5610planId"
			}, function (err, result) {
				db.user.findAndModify({
					query: {username: customer.username},
					update: {$set: {plan: 'PRO ANGLER'}}
				}, function(err, doc, lastErrorObject){
					res.redirect("/#/"+username+"/profile");

				});

				//db.user.findAndModify({
				//	query: {username: customer.username},
				//	update: {$set : {preferences: req.body	}},
				//	new: false}, function(err, doc, lastErrorObject)
				//{
				//	console.log(err);
				//	console.log(doc);
				//	console.log(lastErrorObject);
				//});

//				res.send(result);

			});
		});
	});

	//gateway.transaction.sale({
	//    amount: '10.00',
	//    paymentMethodNonce: nonceFromTheClient,
	//}, function (err, result) {
    //
	//});

	//var body = req.body;
	//res.json(body);
}

app.get('/api/pwd', function(req, res){
	res.send(__dirname);
});

app.get('/api/datadir', function(req, res){
	res.send(process.env.OPENSHIFT_DATA_DIR);
});

require("./app/app.js")(app, db);

app.listen(port, ipaddress);

