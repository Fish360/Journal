(function(){
    f360.controller("ReportListController", ReportListController);
    f360.controller("NewReportController", NewReportController);
    f360.controller("EditReportController", EditReportController);
    f360.controller("TimeOfYearReportController", TimeOfYearReportController);
    f360.controller("SpotsReportController", SpotsReportController);
    f360.controller("PresentationsReportController", PresentationsReportController);
    f360.controller("ReportController", ReportController);

    function ReportController ($routeParams, $scope, ReportsService) {
        $scope.username = $routeParams.username;
        $scope.reportId = $routeParams.reportId;

        function init () {
            $scope.report = ReportsService.findReportById($scope.reportId);
        }
        init();
    }

    function TimeOfYearReportController ($routeParams, $scope, ReportsService) {
        $scope.username = $routeParams.username;
        $scope.reportId = $routeParams.reportId;

        function init () {
            $scope.report = ReportsService.findReportById($scope.reportId);
        }
        init();
    }

    function SpotsReportController ($routeParams, $scope) {
        $scope.username = $routeParams.username;
        $scope.reportId = $routeParams.reportId;
    }

    function PresentationsReportController ($routeParams, $scope) {
        $scope.username = $routeParams.username;
        $scope.reportId = $routeParams.reportId;
    }

    function EditReportController ($routeParams, $scope, ReportsService, $location) {
        $scope.username = $routeParams.username;
        var reportId = $routeParams.reportId;
        $scope.updateReport = updateReport;
        $scope.deleteReport = deleteReport;

        function init () {
            ReportsService
                .findReportById(reportId)
                .then(function(response){
                    $scope.report = response.data;
                })
        }
        init();

        function deleteReport (report) {
            ReportsService
                .deleteReport (report)
                .then(function(){
                    return ReportsService.findAllReports();
                })
                .then(function(response){
                    $scope.reports = response.data;
                    $location.url ("/"+$scope.username+"/reports");
                });
        }

        function updateReport (report) {
            ReportsService
                .updateReport (report)
                .then(function(){
                    return ReportsService.findAllReports();
                })
                .then(function(response){
                    $scope.reports = response.data;
                    $location.url ("/"+$scope.username+"/reports");
                });
        }
    }

    function NewReportController ($routeParams, $scope, ReportsService, $location) {
        $scope.username = $routeParams.username;
        $scope.createReport = createReport;
        $scope.report = {
            type: "timeOfYear"
        };

        function init () {

        }
        init();

        function createReport (report) {
            ReportsService
                .createReport ($scope.username, report)
                .then(function(){
                    $location.url ("/"+$scope.username+"/reports");
                })
        }
    }

    function ReportListController ($routeParams, $scope, ReportsService) {
        $scope.username = $routeParams.username;

        function init () {
            ReportsService
                .findReportsByUsername($scope.username)
                .then(function(response){
                    $scope.reports = response.data;
                })
        }
        init();
    }
})();
