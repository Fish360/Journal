var mongojs = require("mongojs");
module.exports = function (app, db) {

    app.post("/api/user", registerUser);
    app.put("/api/user/:username", updateProfile);
    app.get("/api/admin/user", findAllUsers);
    app.get("/api/admin/user/:userId", findUserById);
    app.get("/api/user/:username", findUserByUsername);
    app.get("/api/user/:username/:password", findUserByCredentials);
    app.post("/api/user/:username/preferences", findUserPreferences);
    app.get("/api/user/:username/preferences/defaultspecies", findUserDefaultSpecies);
    app.get("/api/user/:username/preferences/units", findUserPreferredUnits);

    function findUserByCredentials(req, res)
    {
        var password = req.params.password;

        db.user.find(
            {username: req.params.username},
            function(err, users) {
                if(err) {
                    res.send(err);
                }
                var user = users[0];
                if(user.password == password) {
                    res.json(user);
                } else {
                    res.send(null);
                }
                // userModel.comparePassword(req.params.password, user)
                // 	.then(function(response){
                // 		if(response){
                // 			res.json(response);
                // 		}
                // 		else{
                // 			res.send(null);
                // 		}
                // 	},
                // 		function(err){
                // 			res.send(err);
                // 		});
                // }
                // else{
                // 	res.send(null);
                // }
            });
    }

    function findUserByUsername(req, res)
    {
        db.user.find({username: req.params.username}, function(err, user)
        {
            res.json(user);
        });
    }

    function findUserById(req, res)
    {
        db.user.find({_id: mongojs.ObjectId(req.params.userId)},{username: 1, firstName: 1, lastName: 1}, function(err, users)
        {
            res.json(users[0]);
        });
    }

    function findAllUsers(req, res)
    {
        db.user.find({},{username: 1, firstName: 1, lastName: 1}, function(err, users)
        {
            res.json(users);
        });
    }

    function updateProfile(req, res) {
        var username = req.params.username;
        var update = {

        };
        if (!req.body.species) {
            update = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                dateOfBirth: req.body.dateOfBirth,
                units: req.body.units,
                shareAggregate: req.body.shareAggregate
            };
        } else {
            update = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                dateOfBirth: req.body.dateOfBirth,
                units: req.body.units,
                species: req.body.species,
                commonName: req.body.commonName,
                shareAggregate: req.body.shareAggregate
            };
        }

        if (req.body.password) {
            // userModel.get_encrypted_hash(req.body.password)
            // 	.then(function (response) {
            // 			update.password = response;
            // 			updateUserDetails();
            // 		});
            update.password = req.body.password;
            updateUserDetails();
        }
        else{
            updateUserDetails();
        }

        function updateUserDetails(){
            db.user.findAndModify({
                query: {username: req.params.username},
                update: {
                    $set: update
                },
                new: false
            }, function (err, doc, lastErrorObject) {
            });

            db.user.find({username: req.params.username}, function (err, user) {
                res.json(user);
            });
        }
    }

    function registerUser(req, res)
    {
        db.user.find({email: req.body.email}, function(err, user)
        {
            if(user.length === 0) {
                var user = req.body;

                db.user.insert(user, function(err, newUser)
                {
                    if(err) {
                        res.status(400).send(err);
                    } else {
                        res.json(newUser);
                    }
                });
                // userModel.get_encrypted_hash(user.password)
                // 	.then(
                // 		function(response) {
                // 			user.password = response;
                // 			user.password2 = response;
                // 			db.user.insert(user, function(err, newUser)
                // 			{
                // 				res.json(newUser);
                // 			});
                // 		},
                // 		function(err){
                // 			res.json({
                // 				success: false,
                // 				error: 'Unable to register user.' });
                // 		}
                // 	);
            } else {
                res.json({
                    success: false,
                    error: 'email exist' });
            }
        });
    }



    // app.post("/api/forgotPassword/:username", function (req, res) {
//    db.user.find({username: req.params.username}, function(err, user)
// 	{
// 		if(user[0].email){
// 			transporter.sendMail({
// 	        to: user[0].email,
// 	        subject: 'Fish 360 App password ',
// 	        html: 'Hi '+ user[0].username +', <br> <br>  Your Password is : ' + user[0].password + ' <br> <br> Regards, <br> Fish360'
// 	      });
// 		}
// 	});
//    res.send("email");
// });

    function findUserPreferredUnits(req, res)
    {
        db.user.find({username: req.params.username}, function(err, user)
        {
            res.json(user[0].units);
        });
    }

    function findUserDefaultSpecies(req, res)
    {
        db.user.find({username: req.params.username}, function(err, user)
        {
            res.json({ species : user[0].species, commonName: user[0].commonName});
        });
    }

    function findUserPreferences(req, res)
    {
        db.user.findAndModify({
            query: {username: req.params.username},
            update: {$set : {preferences: req.body	}},
            new: false}, function(err, doc, lastErrorObject)
        {
        });
    }

};