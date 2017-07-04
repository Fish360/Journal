(function () {
    angular
        .module("f360-directives", [])
        .directive("f360TideReport", f360TideReport)
        .directive("f360TideChart", f360TideChart)
        .directive("f360MoonView", f360MoonView);

    function f360TideReport() {
        function link(scope, element) {
            console.log(scope);
        }
        return {
            link: link,
            templateUrl: 'directives/f360-directives/f360-tide-report.html'
        }
    }

    function f360TideChart(TidalService, SpotService, FishService, WorldWeatherOnlineService) {
        function link(scope, element, attributes) {

            scope.weatherIndex = 0;

            scope.scrollLeft = function () {
                // if(scope.weatherIndex > 0) {
                    scope.weatherIndex--;
                    scope.date.setDate(scope.date.getDate() - 1);
                    draw();
                // }
            };

            scope.scrollRight = function () {
                // if(scope.weatherIndex < 1) {
                    scope.weatherIndex++;
                    scope.date.setDate(scope.date.getDate() + 1);
                    draw();
                // }
            };

            scope.parseTime = function (timeString) {
                alert(timeString);
            };

            attributes.$observe('date', function(value) {
                scope.date = new Date(value.replace(/\"/g, ''));
                draw();
            });
            attributes.$observe('spot', function(value) {
                scope.spot = value;
                draw();
            });
            function draw() {
                if(scope.date && scope.spot) {
                    // scope.date = scope.date.replace(/\"/g, '');
                    SpotService.findOne(attributes.username, scope.spot, function (spot) {
                        // var fishCaughtTime;
                        if (spot.latitude && spot.longitude) {
                            // if (typeof scope.time != "undefined") {
                            //     fishCaughtTime = new Date(scope.date + "T" + scope.time + ":00");
                            // }
                            // else {
                            //     fishCaughtTime = new Date(scope.date);
                            // }
                            // var date = Math.round(fishCaughtTime.getTime() / 1000);
                            var date = Math.round(scope.date.getTime() / 1000);

                            // spot.latitude = 43.3859;
                            // spot.longitude = -70.5406;

                            // WorldWeatherOnlineService
                            //     .getMarineWeather(spot.latitude, spot.longitude, scope.date)
                            //     .then(
                            //         function (response) {
                            //             scope.weather = response.data.data.weather;
                            //
                            //             if(scope.weather) {
                            //                 var minutesInDay = 24 * 60;
                            //                 scope.sunriseMinutes  = 100 * timeStringToMinutes(scope.weather[0].astronomy[0].sunrise) / minutesInDay;
                            //                 scope.sunsetMinutes   = 100 * timeStringToMinutes(scope.weather[0].astronomy[0].sunset) / minutesInDay;
                            //                 scope.moonriseMinutes = 100 * timeStringToMinutes(scope.weather[0].astronomy[0].moonrise) / minutesInDay;
                            //                 scope.moonsetMinutes  = 100 * timeStringToMinutes(scope.weather[0].astronomy[0].moonset) / minutesInDay;
                            //             }
                            //         },
                            //         function (error) {
                            //             console.log(error);
                            //         }
                            //     );

                            TidalService.getUTCOffset(date, spot.latitude, spot.longitude, function (offset) {
                                TidalService.findTidalInfo(date, spot, function (tides) {
                                    scope.tides = tides;

                                    var heights = tides.heights;
                                    var extremes = tides.extremes;
                                    var max = 0;
                                    var min = 0;
                                    extremes.forEach(function (extreme) {
                                        if(extreme.height > max) {
                                            max = extreme.height;
                                        }
                                        if(extreme.height < min) {
                                            min = extreme.height;
                                        }
                                    });
                                    var range = Math.abs(max) + Math.abs(min);
                                    scope.max = max;
                                    scope.min = min;
                                    scope.range = range;

                                    if(scope.trip && scope.trip.weather) {
                                        var minutesInDay = 24 * 60;
                                        var astronomy = scope.trip.weather[0].astronomy[0];
                                        scope.sunriseMinutes  = 100 * timeStringToMinutes(astronomy.sunrise) / minutesInDay;
                                        scope.sunsetMinutes   = 100 * timeStringToMinutes(astronomy.sunset) / minutesInDay;
                                        scope.moonriseMinutes = 100 * timeStringToMinutes(astronomy.moonrise) / minutesInDay;
                                        scope.moonsetMinutes  = 100 * timeStringToMinutes(astronomy.moonset) / minutesInDay;
                                        FishService
                                            .findFishForTrip(scope.username, scope.trip._id)
                                            .then(function (fish) {
                                                for(var f in fish) {
                                                    fish[f].caught = new Date(fish[f].caught);
                                                    fish[f].caughtTime = new Date(fish[f].caughtTime);
                                                    fish[f].caughtMinutes = 100 * (fish[f].caught.getHours() * 60 + fish[f].caught.getMinutes()) / minutesInDay;
                                                    fish[f].caughtTimeString = fish[f].caughtTime.getHours() + ":" + fish[f].caughtTime.getMinutes();
                                                }
                                                scope.fishes = fish;
                                            });
                                    }

                                });
                            });
                        }
                    });
                }
            }
            function timeStringToMinutes(timeString) {
                var am = timeString.indexOf('AM') > -1;
                var pm = timeString.indexOf('PM') > -1;
                timeString = timeString.replace(' AM', '');
                timeString = timeString.replace(' PM', '');
                var colon = timeString.indexOf(':');
                var hours = parseInt(timeString.substring(0, colon));
                var minutes = parseInt(timeString.substring(colon+1));
                minutes = hours * 60 + minutes;
                minutes = am ? minutes : minutes + 12 * 60;
                return minutes;
            }
        }
        return {
            restrict: 'AEC',
            link: link,
            templateUrl: 'directives/f360-directives/f360-tide-chart.html'
        };
    }

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

})();