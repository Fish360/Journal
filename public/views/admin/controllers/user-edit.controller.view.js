f360.controller("userEditController",
    function ($scope,
              $routeParams,
              userService) {
        var model = this;
        model.userId = $routeParams.userId;
        model.username = $routeParams.username;

        function init() {
            userService
                .findUserById(model.userId)
                .then(function (user) {
                    model.user = user;
                });
        }
        init();
});
