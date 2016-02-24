(function(){
    f360.factory("ReportsService", ReportsService);
    function ReportsService ($http) {
        var model = {
            reports: [
                {name: "Report 1"},
                {name: "Report 2"},
                {name: "Report 3"}
            ],
            createReport: createReport,
            findAllReports: findAllReports
        };
        return model;

        function createReport (report) {
            model.reports.push (report);
        }

        function findAllReports () {
            return model.reports;
        }
    }
})();