var responseUtil = require("../utils/responseUtil.js");
module.exports = function (app, model) {
    app.get("/api/report", findAllReports);
    app.get("/api/:username/report", findReportsByUsername);
    app.get("/api/report/:reportId", findReportById);
    app.get("/api/report/:reportId/run", runReportById);
    app.post("/api/:username/report", createReport);
    app.delete("/api/report/:reportId", deleteReport);
    app.put("/api/report/:reportId", updateReport);

    function createReport(req, res) {
        var r = responseUtil(res);
        model
            .createReport(req.params.username, req.body)
            .then(r.success, r.error);
    }

    function runReportById(req, res) {
        var r = responseUtil(res);
        model
            .runReportById(req.params.reportId)
            .then(r.success, r.error);
    }

    function findAllReports(req, res) {
        var r = responseUtil(res);
        model
            .findAllReports()
            .then(r.success, r.error);
    }

    function findReportById(req, res) {
        var r = responseUtil(res);
        model
            .findReportById(req.params.reportId)
            .then(r.success, r.error);
    }

    function findReportsByUsername(req, res) {
        var r = responseUtil(res);
        model
            .findReportsByUsername(req.params.username)
            .then(r.success, r.error);
    }

    function deleteReport(req, res) {
        var r = responseUtil(res);
        model
            .deleteReport(req.params.reportId)
            .then(r.success, r.error);
    }

    function updateReport(req, res) {
        var r = responseUtil(res);
        model
            .updateReport(req.params.reportId, req.body)
            .then(r.success, r.error);
    }
}