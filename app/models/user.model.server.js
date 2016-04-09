var q = require("q");
var bcrypt=require("bcrypt");
var mongojs = require("mongojs");
module.exports = function(db) {
    var api = {
        get_encrypted_hash: get_encrypted_hash,
        comparePassword:comparePassword
    };
    return api;
    function get_encrypted_hash(password){
        var deferred=q.defer();
        var SALT_FACTOR=10;
        bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
            if (err){
                deferred.reject(err);
            }
            else {
                bcrypt.hash(password, salt, function (err, hash) {
                    if (err) {
                        deferred.reject(err);
                    }
                    else {
                        deferred.resolve(hash);
                    }
                });
            }
        });
        return deferred.promise;
    }

    function comparePassword(login_password,user) {
        var deferred= q.defer();
        bcrypt.compare(login_password, user[0].password, function (err, doesMatch) {
            if (doesMatch) {
                deferred.resolve(user);
            } else {
                deferred.reject(null);
            }
        });
        return deferred.promise;
    }

}