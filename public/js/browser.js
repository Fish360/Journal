var app = angular.module("browser", []);

app.controller("browserCtrl", function ($scope, $http) {
    $http.get("/api/browser")
    .success(function (family) {
        $scope.family = family;
    });
});
