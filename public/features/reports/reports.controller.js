(function(){
    f360.controller("ReportListController", ReportListController);
    f360.controller("NewReportController", NewReportController);

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
