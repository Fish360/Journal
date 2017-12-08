const app = require('../../express');

var passport = require('passport');
var backup = require('mongodb-backup');
var restore = require('mongodb-restore');
var fs = require('fs');
var multer = require('multer');
var upload = multer({dest: 'uploads/'});

var auth = authorized;
var userModel = require("../models/user/user.model.server.js");

//TODO: connection string based on environment
var databases = {
    'LOCAL': 'mongodb://127.0.0.1:27017/f360',
    'DEV': 'mongodb://127.0.0.1:27017/f360',
    'DEMO': 'mongodb://127.0.0.1:27017/f360',
    'QA': 'mongodb://127.0.0.1:27017/f360',
    'PROD': 'mongodb://127.0.0.1:27017/f360'
};

app.get('/api/database/backup/:environment', backupDatabase);
app.post('/api/database/restore/:environment/fileUpload', upload.single('file'), fileUploadDatabase)
app.get('/api/database/migrate/:from/:to', migrateDatabase);

function backupDatabase(req, res) {
    var environment = req.params.environment;
    var connectionString = databases[environment];

    var filename = 'backup' + environment + '-' + Date.now() + '.tar';
    res.setHeader('Content-Disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-Type', 'application/x-tar'); // force header for tar download

    backup({
        uri: connectionString,
        // stream: res, // send stream into client response
        root: 'backups/',
        tar: filename,
        // parser: 'json',
        callback: function (err) {
            if (err) {
                res.sendStatus(400);
            } else {
                res.download('backups/' + filename);
            }
        }
    });
}

function fileUploadDatabase(req, res) {
    var environment = req.params.environment;
    var connectionString = databases[environment];

    restore({
        uri: connectionString,
        root: 'uploads/',
        tar: req.file.filename,
        // parser: 'json',
        drop: true,
        callback: function (err) {
            if (err) {
                res.sendStatus(400);
            } else {
                res.sendStatus(200);
            }
        }
    });
}

function migrateDatabase(req, res) {
    var from = req.params.from;
    var to = req.params.to;
    var fromConnectionString = databases[from];
    var toConnectionString = databases[to];
    var filename = 'backup' + from + '-' + Date.now() + '.tar';

    backup({
        uri: fromConnectionString,
        // stream: res, // send stream into client response
        root: 'backups/',
        tar: filename,
        // parser: 'json',
        callback: function (err) {
            if (err) {
                res.sendStatus(400);
            } else {
                restore({
                    uri: toConnectionString,
                    root: 'backups/',
                    tar: filename,
                    // parser: 'json',
                    drop: true,
                    callback: function (err) {
                        if (err) {
                            res.sendStatus(400);
                        } else {
                            res.sendStatus(200);
                        }
                    }
                })
            }
        }
    });
}


