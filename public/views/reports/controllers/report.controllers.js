(function(){
    f360.controller("ReportListController", ReportListController);
    f360.controller("NewReportController", NewReportController);
    f360.controller("EditReportController", EditReportController);
    f360.controller("TimeOfYearReportController", TimeOfYearReportController);
    f360.controller("SpotsReportController", SpotsReportController);
    f360.controller("PresentationsReportController", PresentationsReportController);
    f360.controller("MoonPhaseReportController", MoonPhaseReportController);
    f360.controller("ConditionReportController", ConditionReportController);
    f360.controller("ReportController", ReportController);

    var monthNames = {
        '01': 'JAN', '02': 'FEB', '03': 'MAR',
        '04': 'APR', '05': 'MAY', '06': 'JUN',
        '07': 'JUL', '08': 'AUG', '09': 'SEP',
        '10': 'OCT', '11': 'NOV', '12': 'DEC'
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
                    console.log("watch start"+$scope.report.startDate )
                    console.log("watch end"+$scope.report.endDate )
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
                        console.log(month);
                        if(month < 10) {
                            month = "0"+month;
                        }
                        var year  = currentDate.getFullYear();
                        var monthinwords=monthNames[month];
                        var timeKey = monthinwords+","+year;

                        fishMap[timeKey] = 0;
                        currentDate.setMonth(currentDate.getMonth()+1);
                    }
                    var fishes = response.data;
                    console.log(response+"here goes");
                    var total = 0;
                    var max = -1;


                    for(var fishIndex in fishMap){
                        console.log(fishIndex);

                    }
                    for(var f in fishes) {
                        // if(f.caught>$scope.report.startDate &&
                        // f.caught<$scope.report.endDate)
                        // {
                        var fish = fishes[f];
                        console.log(fish);
                        fish.caught = fish.caught.replace(/-/g, '/');
                        total++;

                        var monthIndex = fish.caught.substring(0, 7).replace('/','').substring(4, 6);
                        var fishIndex=monthNames[monthIndex]+","+fish.caught.substring(0, 5).replace('/','');


                        if(fishMap[fishIndex]>=0) {
                            fishMap[fishIndex]++;
                        }

                    }
                    $scope.data = fishMap;
                    $scope.total = total;
                    $scope.max = max;

                    google.charts.setOnLoadCallback(drawChart);
                    function drawChart() {


                        var data=new google.visualization.DataTable();

                        data.addColumn('string', 'Month');
                        data.addColumn('number', 'Fish Caught');



                        for(var fishIndex in fishMap){
                            data.addRow([fishIndex,fishMap[fishIndex]]);
                        }


                        var options = {
                            chart: {
                                title: 'Time Of Year Report',
                                subtitle: 'TimeOfYear vs FishCount',


                            },
                            bars: 'horizontal' ,// Required for Material Bar Charts.
                            colors: ['#C10D19']
                        };
                        var chart = new google.charts.Bar(document.getElementById('toyholder'));

                        chart.draw(data, options);
                    }
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
                        var spot = fish.spotName;
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

    function MoonPhaseReportController ($routeParams, $scope, ReportsService) {
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
                    console.log("fishes:");
                    console.log(fishes);
                    var MoonPhaseMap = {};
                    var max = -1;
                    fishes = fishes.data;
                    $scope.fishes = fishes;
                    for(var f in fishes) {
                        var fish = fishes[f];
                        var moonphase = fish.moonphase;
                        if(moonphase) {
                            if(MoonPhaseMap[moonphase]) {
                                    MoonPhaseMap[moonphase]++;
                            } else {
                                MoonPhaseMap[moonphase] = 1;
                            }
                            if(MoonPhaseMap[moonphase] > max) {
                                max = MoonPhaseMap[moonphase];
                            }
                        }
                    }
                    $scope.MoonPhaseMap = MoonPhaseMap;




                    google.charts.setOnLoadCallback(drawChart);
                    // function drawChart() {
                    //     /*var data = google.visualization.arrayToDataTable([
                    //         ["MoonPhase", "FishCount", { role: "style" } ],
                    //         ["Copper", 8.94, "#b87333"],
                    //         ["Silver", 10.49, "silver"],
                    //         ["Gold", 19.30, "gold"],
                    //         ["Platinum", 21.45, "color: #e5e4e2"]
                    //     ]);*/
                    //     console.log($scope.MoonPhaseMap);
                    //     var data=new google.visualization.DataTable();
                    //     console.log("iterating");
                    //     data.addColumn('string', 'Moon Phase');
                    //     data.addColumn('number', 'Fish Count');
                    //     data.addColumn({type: 'string', role: 'style'});
                    //
                    //     for(var phase in $scope.MoonPhaseMap){
                    //         data.addRow([phase,$scope.MoonPhaseMap[phase],'color: #C10D19']);
                    //     }
                    //     console.log(data);
                    //     var view = new google.visualization.DataView(data);
                    //
                    //     var options = {
                    //         title: "Moon Phase vs Fish Count",
                    //         bar: {groupWidth: "50%"},
                    //         height:500,
                    //         'hAxis': {'textStyle': {'fontSize': 11}},
                    //         'vAxis': {'textStyle': {'fontSize': 7}},
                    //         legend: { position: 'top', maxLines: 5 },
                    //         color:["#C10D19"]
                    //
                    //
                    //     };
                    //     var chart = new google.visualization.BarChart(document.getElementById("barchart_values"));
                    //     chart.draw(view, options);
                    // }

                    google.charts.setOnLoadCallback(drawChart);
                    function drawChart() {


                        var data=new google.visualization.DataTable();

                        data.addColumn('string', 'Moon Phase');
                        data.addColumn('number', 'Fish Caught');



                        for(var phase in $scope.MoonPhaseMap){
                            data.addRow([phase,$scope.MoonPhaseMap[phase]]);
                        }


                        var options = {
                            chart: {
                                title: 'MoonPhase Report',
                                subtitle: 'MoonPhase vs FishCount',


                            },

                            bars: 'horizontal' ,// Required for Material Bar Charts.
                            colors: ['#C10D19']
                        };
                        var chart = new google.charts.Bar(document.getElementById('barchart_values'));

                        chart.draw(data, options);
                    }
                }, function(err){
                    console.log(err);
                });
        }
        init();
    }
    function ConditionReportController($routeParams, $scope, ReportsService) {

        
        $scope.username = $routeParams.username;
        $scope.reportId = $routeParams.reportId;
        var report= $scope.report;

        function init () {
            ReportsService
                .findReportById($scope.reportId)
                .then(function(report){
                    $scope.report = report.data;
                   // console.log("mintempfromui",$scope.report.minWaterTemp);
                    return ReportsService.runReportById($scope.reportId);
                })
                .then(function(fishes){
                    var startDateStr = $scope.report.startDate.replace(/-/g,'/');
                    var endDateStr = $scope.report.endDate.replace(/-/g,'/');
                    var startDate = new Date(startDateStr);
                    var endDate = new Date(endDateStr);
                    var timeline = [];
                    var currentDate = startDate;
                    var timelineCounter = 0;
                    var fishMap = {};

                    var conditionMap={};
                    while(currentDate <= endDate) {
                        timeline[timelineCounter++] = new Date(currentDate);
                        var month = currentDate.getMonth() + 1;
                        var year  = currentDate.getFullYear();
                        if(month < 10) {
                            month = "0"+month;
                        }

                        var monthinwords=monthNames[month];
                        var timeKey = monthinwords+","+year;
                        fishMap[timeKey] = 0;
                        currentDate.setMonth(currentDate.getMonth()+1);
                    }

                    var fishes = fishes.data;
                    console.log("fishes:");
                    console.log(fishes);
                    var total = 0;
                    var max = -1;
                    for(var f in fishes) {
                        var minWaterTemp=$scope.report.minWaterTemp;
                        var maxWaterTemp=$scope.report.maxWaterTemp;
                        var minAirTemp=$scope.report.minAirTemp;
                        var maxAirTemp=$scope.report.maxAirTemp;
                        var minPressure=$scope.report.minPressure;
                        var maxPressure=$scope.report.maxPressure;
                        var minWind=$scope.report.minWind;
                        var maxWind=$scope.report.maxWind;
                        var  sky=$scope.report.sky;

                        var fish = fishes[f];
                        console.log(fish);
                        fish.caught = fish.caught.replace(/-/g, '/');
                        var monthIndex = fish.caught.substring(0, 7).replace('/','').substring(4, 6);
                        var fishIndex=monthNames[monthIndex]+","+fish.caught.substring(0, 5).replace('/','');

                        if(fishMap[fishIndex]>=0) {
                            fishMap[fishIndex]++;
                        }
                        if (fish.weather)

                        {
                            var fishPressure=parseInt(fish.weather[0].hourly[0].pressure);
                            var fishSky=fish.weather[0].hourly[0].weatherDesc[0].value.toUpperCase();
                            var fishWaterTemp=parseInt(fish.weather[0].hourly[0].waterTemp_F);
                            var fishAirTemp=parseInt(fish.weather[0].maxtempF);
                            var fishWind=parseInt(fish.weather[0].hourly[0].windspeedMiles);

                            console.log(fishPressure+"pressure")
                            console.log(fishSky+"sky")
                            console.log(fishWaterTemp+"water")
                            console.log(fishAirTemp+"air")
                            console.log(fishWind+"wind")
                            console.log(maxPressure+" max pressure from report")
                            console.log(minPressure+"pressure from report")


                            if (!minWaterTemp){minWaterTemp=fishWaterTemp -1;}
                            if (!maxWaterTemp) {maxWaterTemp=fishWaterTemp +1;}
                            if (!maxWind) {maxWind=fishWind+1}
                            if (!minWind) {minWind=fishWind-1;}
                            if (!maxPressure) {maxPressure=fishPressure+1}
                            if (!minPressure) {minPressure=fishPressure-1}
                            if (!minAirTemp) {minAirTemp=fishAirTemp-1;}
                            if (!maxAirTemp) {maxAirTemp=fishAirTemp+1}

                            console.log(maxPressure+" max pressure from report")
                            console.log(minPressure+"pressure from report")
                           if (!sky) {sky=fishSky;}
                            if(fishPressure < maxPressure
                            &&  fishPressure > minPressure
                               && fishAirTemp < maxAirTemp
                                    && fishAirTemp > minAirTemp
                                      && fishWaterTemp < maxWaterTemp
                                         &&fishWaterTemp > minWaterTemp
                                          && fishWind < maxWind
                                           && fishWind > minWind
                                            && fishSky===sky.toUpperCase())
                            {
                                console.log("here");
                                if(conditionMap[fishIndex]) {
                                    conditionMap[fishIndex]++;
                                }else {
                                    conditionMap[fishIndex] = 1
                                }
                            }
                        }
                    }

                    google.charts.setOnLoadCallback(drawChart);
                    function drawChart() {


                        var data=new google.visualization.DataTable();

                        data.addColumn('string', 'Month');
                        data.addColumn('number', 'Fish Caught');
                        for(var fishIndex in fishMap){
                            data.addRow([fishIndex,conditionMap[fishIndex]]);
                        }

                        var options = {
                            chart: {
                                title: 'Condition Report',
                                subtitle: 'Condition vs FishCount',
                                

                            },
                            bars: 'horizontal' ,// Required for Material Bar Charts.
                            colors: ['#C10D19']
                        };
                        var chart = new google.charts.Bar(document.getElementById('barchart_condition_values'));

                        chart.draw(data, options);
                    }


                }, function(err){
                    console.log(err);
                });
        }
        init();
    }


    function EditReportController ($routeParams, $scope, ReportsService, $location, JSONLoaderFactory,SpotService) {
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
            SpotService.findAll($scope.username, function (spots) {
                $scope.spots = spots;
                ReportsService
                    .findReportById(reportId)
                    .then(function (response) {
                        $scope.report = response.data;
                    })
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

    function NewReportController ($routeParams, $scope, ReportsService, SpotService, $location, JSONLoaderFactory) {
        $scope.username = $routeParams.username;
        $scope.createReport = createReport;
        $scope.checkAndcreate=checkAndCreate;
        $scope.report = {
            type: "timeOfYear"
        };

        function init () {
            loadSpecies();
            loadSpots();
        }
        init();

        function loadSpecies() {
            JSONLoaderFactory.readTextFile("../json/species.json", function(text){
                $scope.species = JSON.parse(text);
              
            });
        }
        
        function loadSpots() {
            SpotService.findAll($scope.username, function (spots) {
                $scope.spots = spots;
            });
        }

        function checkAndCreate(report){
            ReportsService
                .findReportsByUsername($scope.username)
                .then(function(response){
                    var resultSet = response.data;
                    // console.log(resultSet);
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

    function ReportListController ($routeParams, $scope, $location, ReportsService) {
        $scope.username = $routeParams.username;

        function init () {
            ReportsService
                .findReportsByUsername($scope.username)
                .then(function(response){
                    $scope.reports = response.data;
                })
        }
        init();

        $scope.addNewReport = function addNewReport(){
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
                        $location.url("/"+$scope.username+"/reports/new");
                    }

                });
        }
    }
})();
