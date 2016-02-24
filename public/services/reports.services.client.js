(function(){
    f360.factory("ReportsService", ReportsService);
    function ReportsService ($http) {
        var model = {
            reports: [
                {title: "Report 1"},
                {title: "Report 2"},
                {title: "Report 3"}
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