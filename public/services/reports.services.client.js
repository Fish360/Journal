(function(){
    f360.factory("ReportsService", ReportsService);
    function ReportsService ($http) {
        var model = {
            reports: [
                {_id: "123asd", name: "Report 1", type: "timeOfYear"},
                {_id: "234asd", name: "Report 2", type: "spots"},
                {_id: "345asd", name: "Report 3", type: "presentations"}
            ],
            createReport: createReport,
            findAllReports: findAllReports,
            findReportById: findReportById,
            deleteReport: deleteReport,
            updateReport: updateReport
        };
        return model;

        function deleteReport (report) {
            var report = findReportById(report._id);
            var index = model.reports.indexOf(report);
            model.reports.splice (index, 1);
        }

        function createReport (report) {
            var now = new Date().getTime();
            report._id = "_id_"+now;
            model.reports.push (report);
        }

        function findAllReports () {
            return model.reports;
        }

        function findReportById (reportId) {
            for (var r in model.reports) {
                if (model.reports[r]._id === reportId) {
                    return model.reports[r];
                }
            }
            return null;
        }

        function updateReport (report) {
            var report = findReportById(report._id);
            var index = model.reports.indexOf(report);
            model.reports[index] = report;
        }
    }
})();