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
        $scope.report;

        function init () {
            ReportsService
                .findReportById($scope.reportId)
                .then(function(report){
                    $scope.report = report.data;
                })
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
                    if(!$scope.report.startDate || !$scope.report.endDate) {
                        return;
                    }
                    var startDateStr = $scope.report.startDate.replace(/-/g,'/');
                    var endDateStr = $scope.report.endDate.replace(/-/g,'/');
                    var startDate = new Date(startDateStr);
                    var endDate = new Date(endDateStr);
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
                        fishMap[timeKey] = 0;
                        currentDate.setMonth(currentDate.getMonth()+1);
                    }

                    var fishes = response.data;
                    var total = 0;
                    var max = -1;
                    for(var f in fishes) {
                        var fish = fishes[f];
                        fish.caught = fish.caught.replace(/-/g, '/');
                        total++;
                        var fishIndex = fish.caught.substring(0, 7).replace('/','');
                        var monthIndex = fishIndex.substring(4, 6);
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
                })
        }
        init();
    }

    function SpotsReportController ($routeParams, $scope, ReportsService) {
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
                .then(function(fishes){
                    var spotMap = {};
                    fishes = fishes.data;
                    $scope.fishes = fishes;
                    var max = -1;
                    for(var f in fishes) {
                        var fish = fishes[f];
                        var spot = fish.spot;
                        if(spotMap[spot]) {
                            spotMap[spot]++;
                        } else {
                            spotMap[spot] = 1;
                        }
                        if(spotMap[spot] > max) {
                            max = spotMap[spot];
                        }
                    }
                    $scope.spotMap = spotMap;
                    $scope.max = max;
                }, function(err){
                    console.log(err);
                });
        }
        init();
    }

    function PresentationsReportController ($routeParams, $scope, ReportsService) {
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
                .then(function(fishes){
                    var presentationMap = {};
                    fishes = fishes.data;
                    $scope.fishes = fishes;
                    var max = -1;
                    for(var f in fishes) {
                        var fish = fishes[f];
                        var presentation = fish.presentation;
                        var gear = fish.gear;
                        if(gear) {
                            if(presentationMap[gear]) {
                                presentationMap[gear]++;
                            } else {
                                presentationMap[gear] = 1;
                            }
                            if(presentationMap[gear] > max) {
                                max = presentationMap[gear];
                            }
                        }
                    }
                    $scope.presentationMap = presentationMap;
                    $scope.max = max;
                }, function(err){
                    console.log(err);
                });
        }
        init();
    }

    function EditReportController ($routeParams, $scope, ReportsService, $location, JSONLoaderFactory) {
        $scope.username = $routeParams.username;
        var reportId = $routeParams.reportId;
        $scope.updateReport = updateReport;
        $scope.deleteReport = deleteReport;
        loadSpecies();

        function loadSpecies() {
            JSONLoaderFactory.readTextFile("../json/species.json", function(text){
                $scope.species = JSON.parse(text);
              
            });
        }

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

            if(validateSpecieSelection(report)) {
                var scientificName = (report.species.originalObject === undefined) ? report.species : report.species.originalObject["ScientificName"];
                for(var i=0; i<species.length; i++) {
                    if(species[i].scientific === scientificName){
                        report["commonName"] = species[i].common;
                    }
                }
                report.species = scientificName;
            }

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

        function validateSpecieSelection(report) {
            var isValidSpecies = (report.species === undefined)? false : true;

            if(!isValidSpecies){
            return false;
            } 

            return true;
            }
        }

    function NewReportController ($routeParams, $scope, ReportsService, $location, JSONLoaderFactory) {
        $scope.username = $routeParams.username;
        $scope.createReport = createReport;
        $scope.checkAndcreate=checkAndCreate;
        $scope.report = {
            type: "timeOfYear"
        };

        loadSpecies();

        function loadSpecies() {
            JSONLoaderFactory.readTextFile("../json/species.json", function(text){
                $scope.species = JSON.parse(text);
              
            });
        }


        function init () {

        }
        init();

        function checkAndCreate(report){
            ReportsService
                .findReportsByUsername($scope.username)
                .then(function(response){
                    var resultSet = response.data;
                    console.log(resultSet);
                    if(resultSet.length>=10){
                      $location.url("/"+$scope.username+"/reports");
                        alert("You have exceeded the limit. Kindly upgrade to Pro");

                    }
                    else{
                        createReport(report);
                    }

                });

        }

        function createReport (report) {

            if(validateSpecieSelection(report)) {
                    scientificName = (report.species.originalObject === undefined) ? report.species : report.species.originalObject["ScientificName"];
                for(var i=0; i<species.length; i++) {
                    if(species[i].scientific === scientificName){
                        report["commonName"] = species[i].common;
                    }
                }
                report.species = scientificName;
            }
            
            ReportsService
                .createReport ($scope.username, report)
                .then(function(){
                    $location.url("/"+$scope.username+"/reports");
                })
        }



        function validateSpecieSelection(report) {
            var isValidSpecies = (report.species === undefined)? false : true;

            if(!isValidSpecies){
            return false;
            } 

            return true;
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
