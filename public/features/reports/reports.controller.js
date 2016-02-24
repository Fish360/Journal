(function(){
    f360.controller("ReportListController", ReportListController);
    f360.controller("NewReportController", NewReportController);
    f360.controller("EditReportController", EditReportController);

    function EditReportController ($routeParams, $scope, ReportsService, $location) {
        $scope.username = $routeParams.username;
        var reportId = $routeParams.reportId;
        $scope.updateReport = updateReport;
        $scope.deleteReport = deleteReport;

        function init () {
            $scope.report = ReportsService.findReportById(reportId);
        }
        init();

        function deleteReport (report) {
            ReportsService.deleteReport (report);
            $scope.reports = ReportsService.findAllReports();
            $location.url ("/"+$scope.username+"/reports");
        }

        function updateReport (report) {
            ReportsService.updateReport (report);
            $scope.reports = ReportsService.findAllReports();
            $location.url ("/"+$scope.username+"/reports");
        }
    }

    function NewReportController ($routeParams, $scope, ReportsService, $location) {
        $scope.username = $routeParams.username;
        $scope.createReport = createReport;

        function init () {

        }
        init();

        function createReport (report) {
            ReportsService.createReport (report);
            $scope.reports = ReportsService.findAllReports();
            $location.url ("/"+$scope.username+"/reports");
        }
    }

    function ReportListController ($routeParams, $scope, ReportsService) {
        $scope.username = $routeParams.username;

        function init () {
            $scope.reports = ReportsService.findAllReports();
        }
        init();
    }
})();
