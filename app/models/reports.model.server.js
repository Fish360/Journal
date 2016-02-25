var q = require("q");
var promiseUtil = require("../utils/promiseUtil");
module.exports = function(db) {
    var api = {
        createReport: createReport,
        findAllReports: findAllReports,
        findReportById: findReportById,
        findReportsByUsername: findReportsByUsername,
        deleteReport: deleteReport,
        updateReport: updateReport
    };
    return api;

    function createReport(username, report) {
        var p = promiseUtil();
        var deferred = p.defer();
        report.username = username;
        db.report.save(report, p.handle);
        return deferred.promise;
    }

    function findAllReports() {
        var p = promiseUtil();
        var deferred = p.defer();
        db.report.find(p.handle);
        return deferred.promise;
    }

    function findReportById(reportId) {
        var p = promiseUtil();
        var deferred = p.defer();
        db.report.findOne({_id: mongojs.ObjectId(reportId)}, p.handle);
        return deferred.promise;
    }

    function findReportsByUsername(username) {
        var p = promiseUtil();
        var deferred = p.defer();
        db.report.find({username: username}, p.handle);
        return deferred.promise;
    }

    function deleteReport(reportId) {
        var p = promiseUtil();
        var deferred = p.defer();
        db.report.remove({_id: mongojs.ObjectId(reportId)}, p.handle);
        return deferred.promise;
    }

    function updateReport(reportId, report) {
        delete report._id;
        var p = promiseUtil();
        var deferred = p.defer();
        db.report.findAndModify({
            query: {_id: mongojs.ObjectId(reportId)},
            update:{$set:report}
        }, p.handle);
        return deferred.promise;
    }
}