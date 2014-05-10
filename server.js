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

var db = mongojs(connection_string, ['trip', 'fish']);

app.configure(function() {
	app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
	app.use(express.logger('dev')); 						// log every request to the console
	app.use(express.bodyParser()); 							// pull information from html in POST
	app.use(express.methodOverride()); 						// simulate DELETE and PUT
});

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

app.delete("/fish/:id", function(req, res){
	db.fish.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, newFish){
		db.fish.find(function(err, fishes){
			res.json(fishes);
		});
	});
});

app.put("/fish/:id", function(req, res){
	db.fish.update({_id: mongojs.ObjectId(req.params.id)}, req.body, function(err, newFish){
		db.fish.find(function(err, fishes){
			res.json(fishes);
		});
	});
});

app.listen(port, ipaddress);
