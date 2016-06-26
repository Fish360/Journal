var q = require("q");
var promiseUtil = require("../utils/promiseUtil");
var mongojs = require("mongojs");
module.exports = function(db) {
    var api = {
        createReport: createReport,
        findAllReports: findAllReports,
        findReportById: findReportById,
        findReportsByUsername: findReportsByUsername,
        runReportById: runReportById,
        deleteReport: deleteReport,
        updateReport: updateReport
    };
    return api;

    function runReportById(reportId) {
        var p = promiseUtil();
        var deferred = p.defer();
        db.report.findOne({_id: mongojs.ObjectId(reportId)}, function(err, report){
            var username = report.username;
            var startDate = report.startDate;
            var endDate = report.endDate;
            console.log("**********start date*************");
            console.log(report.startDate+"start date");
            console.log(report.endDate+"end date");
            var species = report.species;
            var commonName=report.commonName;
            var spot=report.spot;

            db.fish.find({
                username: username,
                species:species,
                commonName:commonName,
                caught  : {$gte: startDate},
                caught  : {$lte: endDate}
            }, p.handle);
            //if(report.type === 'timeOfYear') {
            //    db.fish.find({
            //        username: username,
            //        caught  : {$gte: startDate},
            //        caught  : {$lte: endDate}
            //    }, p.handle);
            //} else if(report.type === 'spots') {
            //
            //} else if(report.type === 'presentation') {
            //
            //}
        });
        return deferred.promise;
    }

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