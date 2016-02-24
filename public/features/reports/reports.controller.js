(function(){
    f360.controller("ReportsListController", ReportsListController);

    function ReportsListController ($routeParams, $scope) {
        $scope.username = $routeParams.username;
    }
})();
