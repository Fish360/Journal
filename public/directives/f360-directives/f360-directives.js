(function () {
    angular
        .module("f360-directives", [])
        .directive("f360TideChart", f360TideChart);

    function f360TideChart() {
        function link(scope, element, attr) {
            console.log(scope);
            var tides = scope.tides;
            scope.max = Math.max(Math.abs(tides.extremes[0].height), Math.abs(tides.extremes[1].height));
        }
        return {
            restrict: 'AEC',
            link: link,
            scope: {
                tides: '='
            },
            templateUrl: 'directives/f360-directives/f360-tide-chart.html'
        };
    }
})();