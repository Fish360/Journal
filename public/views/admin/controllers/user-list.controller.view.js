f360.controller("userListController",
    function ($scope,
              $rootScope,
              $routeParams,
              $http,
              userService) {
        var model = this;
        model.username = $routeParams.username;

        function init() {
            userService
                .findAllUsers()
                .then(function (users) {
                    model.users = users;
                });
        }
        init();
});
