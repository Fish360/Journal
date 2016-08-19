(function () {
    angular
        .module("f360-directives", [])
        .directive("f360TideChart", f360TideChart)
        .directive("f360MoonView", f360MoonView);

    function f360MoonView(SunMoonService, SpotService) {
        attributes.$observe('date', function(value) {
            scope.date = value;
            draw();
        });
        attributes.$observe('spot', function(value) {
            scope.spot = value;
            draw();
        });
        function draw() {
        }
    }

    function f360TideChart(TidalService, SpotService) {
        function link(scope, element, attributes) {
            attributes.$observe('date', function(value) {
                scope.date = value;
                draw();
            });
            attributes.$observe('spot', function(value) {
                scope.spot = value;
                draw();
            });
            function draw() {
                if(scope.date && scope.spot) {
                    SpotService.findOne(attributes.username, scope.spot, function (spot) {
                        var fishCaughtTime;
                        if (spot.latitude && spot.longitude) {
                            if (typeof scope.time != "undefined") {
                                fishCaughtTime = new Date(scope.date + "T" + scope.time + ":00");
                            }
                            else {
                                fishCaughtTime = new Date(scope.date);
                            }
                            var date = Math.round(fishCaughtTime.getTime() / 1000);
                            TidalService.getUTCOffset(date, spot.latitude, spot.longitude, function (offset) {
                                TidalService.findTidalInfo(date, spot, function (tides) {
                                    scope.tides = tides;
                                });
                            });
                        }
                    });
                }
            }
        }
        return {
            restrict: 'AEC',
            link: link,
            templateUrl: 'directives/f360-directives/f360-tide-chart.html'
        };
    }
})();