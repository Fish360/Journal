module.exports = function() {
    var q = require("q");
    var deferred = null;
    var api = {
        defer: defer,
        handle: handle
    };
    return api;

    function defer() {
        deferred = q.defer();
        return deferred;
    }

    function handle(err, doc) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(doc);
        }
    }
}