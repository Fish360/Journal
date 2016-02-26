(function(){
    f360.controller("ReportListController", ReportListController);
    f360.controller("NewReportController", NewReportController);
    f360.controller("EditReportController", EditReportController);
    f360.controller("TimeOfYearReportController", TimeOfYearReportController);
    f360.controller("SpotsReportController", SpotsReportController);
    f360.controller("PresentationsReportController", PresentationsReportController);
    f360.controller("ReportController", ReportController);

    var monthNames = {
        '01': 'JAN', '02': 'FEB', '03': 'MAR',
        '04': 'APR', '05': 'MAY', '06': 'JUN',
        '07': 'JUL', '08': 'AUG', '09': 'SEP',
        '10': 'OCT', '11': 'NOV', '11': 'DEC'
    };

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
        $scope.report;

        function init () {
            ReportsService
                .findReportById($scope.reportId)
                .then(function(report){
                    $scope.report = report.data;
                    return ReportsService.runReportById($scope.reportId);
                })
                .then(function(response){
                    var startDateStr = $scope.report.startDate.replace(/-/g,'/');
                    var endDateStr = $scope.report.endDate.replace(/-/g,'/');
                    var startDate = new Date(startDateStr);
                    var endDate = new Date(endDateStr);
                    //console.log([startDateStr, endDateStr]);
                    //console.log([startDate, endDate]);
                    //console.log([startDate.getMonth(), endDate.getMonth()]);
                    var timeline = [];
                    var currentDate = startDate;
                    var timelineCounter = 0;
                    var fishMap = {};
                    while(currentDate <= endDate) {
                        timeline[timelineCounter++] = new Date(currentDate);
                        var month = currentDate.getMonth() + 1;
                        var year  = currentDate.getFullYear();
                        if(month < 10) {
                            month = "0"+month;
                        }
                        var timeKey = year+""+month;
                        //console.log(timeKey);
                        fishMap[timeKey] = 0;
                        currentDate.setMonth(currentDate.getMonth()+1);
                    }
                    //console.log(fishMap);
                    //console.log(timeline);

                    var fishes = response.data;
                    //$scope.report = fishes;
                    var total = 0;
                    var max = -1;
                    for(var f in fishes) {
                        var fish = fishes[f];
                        fish.caught = fish.caught.replace(/-/g, '/');
                        total++;
                        var fishIndex = fish.caught.substring(0, 7).replace('/','');
                        var monthIndex = fishIndex.substring(4, 6);
                        //console.log(fishIndex);
                        //console.log(monthIndex);
                        if(fishMap[fishIndex]) {
                            fishMap[fishIndex]++;
                        } else {
                            fishMap[fishIndex] = 1;
                        }
                        if(fishMap[fishIndex] > max) {
                            max = fishMap[fishIndex];
                        }
                    }
                    $scope.data = fishMap;
                    $scope.total = total;
                    $scope.max = max;
                    console.log(fishMap);
                })
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
