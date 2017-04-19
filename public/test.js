(function () {
    angular
        .module('TestApp', ['f360-directives'])
        .controller('tideReportController', tideReportController);
    
    function tideReportController() {
        var model = this;
        model.trip = {
            fish: [
                {_id: '123', species: 'Tuna'},
                {_id: '234', species: 'Bass'}
            ]
        };
        model.tides = [
            {time: '1/2/2017', height: '12'},
            {time: '1/3/2017', height: '13'},
            {time: '1/4/2017', height: '14'},
            {time: '1/5/2017', height: '15'}
        ];
    }
})();