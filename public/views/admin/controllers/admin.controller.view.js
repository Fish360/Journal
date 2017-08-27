f360.controller("adminController",
    function ($scope,
              $routeParams) {
        var model = this;
        model.username = $routeParams.username;
        function init() {
        }
        init();
});
