
(function () {
    f360.directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }])
    .controller('DatabaseController', DatabaseController);

    function DatabaseController($scope, DatabaseService, $window, $location) {
        $scope.uploadFile = uploadFile;
        $scope.backup = backup;
        $scope.migrate = migrate;

        function uploadFile(environment) {
            var file = $scope.myFile;

            DatabaseService.restoreDatabase(file, environment).then(
                function() {
                    $location.path('/admin/database')
                }
            )
        }

        function backup(environment) {
            alert("done backup");
            // $window.open('/api/database/backup/' + environment);
        }

        function migrate(from, to) {
            DatabaseService.migrateDatabase(from, to).then(
                function() {
                    $location.path('/admin/database')
                }
            )
        }
    }
})();