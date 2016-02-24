(function(){
    f360.controller("ReportsListController", ReportsListController);

    function ReportsListController ($routeParams, $scope, ReportsService) {
        $scope.username = $routeParams.username;

        function init () {
            $scope.reports = ReportsService.findAllReports();
        }
        init();
    }
})();
