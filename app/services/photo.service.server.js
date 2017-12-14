module.exports = function (app, db) {

    var mongojs = require('mongojs');
    var cloudinary = require('cloudinary');

    var fs = require('fs');
    cloudinary.config({
        cloud_name: 'hthwldovr',
        api_key: '334989942584451',
        api_secret: '3gYNmailNoNkDbBQSWD7tLj_f7k'
    });


  //  var fs = require('fs');


    var localDataDir = process.env.OPENSHIFT_DATA_DIR || "../data";
    var ncp = require('ncp').ncp;
    ncp(localDataDir, __dirname + "/../../public/uploads", function (err) {
        if (err) {
            return console.error(err);
        }
    });

    function savePhoto(entityName, entityId, req, callback)
    {
        ncp(__dirname + '/../../public/uploads', localDataDir, function (err) {
            if (err) {
                return console.error(err);
            }
        });

        var path = req.files.userPhoto.path;
        var imagePage = path;

        if (path.indexOf("\\") > -1)
            path = path.split("\\");
        else
            path = path.split("/");
        fileName = path[path.length - 1];
        var thm = 'thm_' + fileName;
        console.log("===");
        console.log(entityName);
        console.log(entityId);
        console.log(db);
        db[entityName].findOne({ _id: mongojs.ObjectId(entityId) }, function (err, doc) {
            if (typeof doc.images == "undefined") {
                doc.images = [];
            }
            doc.images.push(fileName);
            db[entityName].save(doc, function () {

                var r = require('ua-parser').parse(req.headers['user-agent']);
                var family = r.device.family;
                var rotate = 0;

                if (family == 'iPhone') {
                    rotate = 180;
                }

                require('lwip').open(imagePage, function (err, image) {
                    image.batch()
                        .scale(0.25)
                        .rotate(rotate, 'white')
                        .writeFile(__dirname + '/public/uploads/' + thm, function (err) {
                            ncp(__dirname + '/public/uploads', localDataDir, function (err) {
                                if (err) {
                                    return console.error(err);
                                }
                            });
                            callback();
                        });
                });
            });
        });
    }

    app.post('/profile/photo', function (req, res) {
        var username = req.body.username;
        var userId = req.body.userId;

        // savePhoto("user", userId, req, function () {
        //     res.redirect("/#/" + username + "/profile");
        // });
        
        cloudinary.v2.uploader.upload(req.files.userPhoto.path,
            function(error, result){
                console.log(result)
                db.user.update({username: username},
                    {imageLink : result.public_id})
            });
        

        res.redirect("/#/" + username + "/profile");

    });

    app.post('/trip/photo', function (req, res) {
        var tripId = req.body.tripId;
        var username = req.body.username;
        savePhoto("trip", tripId, req, function () {
            res.redirect("/#/" + username + "/trip/" + tripId + "/photos");
        });
    });

    app.post('/fish/photo', function (req, res) {
        var username = req.body.username;
        var tripId = req.body.tripId;
        var fishId = req.body.fishId;
        savePhoto("fish", fishId, req, function () {
            res.redirect("/#/" + username + "/trip/" + tripId + "/fish/" + fishId + "/photos");
        });
    });

    app.post('/gear/photo', function (req, res) {
        var gearId = req.body.gearId;
        var username = req.body.username;
        savePhoto("gear", gearId, req, function () {
            res.redirect("/#/" + username + "/gear/" + gearId + "/photos");
        })
    });

    app.post('/spots/photo', function (req, res) {
        var spotId = req.body.spotId;
        var username = req.body.username;
        savePhoto("spots", spotId, req, function () {
            res.redirect("/#/" + username + "/spots/" + spotId + "/photos");
        })
    });

};