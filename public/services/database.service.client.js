
(function () {
    f30.service('DatabaseService', DatabaseService);

    function DatabaseService($http) {
        var api = this;
        api.backup = backup;
        api.restoreDatabase = restoreDatabase;
        api.migrateDatabase = migrateDatabase;

        //TODO: clean this up, move file uploader here
        function backup(environment) {
            console.log(environment);
            return $http.get('/api/database/backup/' + environment.environment);
        }

        function restoreDatabase(file, environment) {
            var fd = new FormData();
            fd.append('file', file);

            var uploadUrl = '/api/database/restore/' + environment + '/fileUpload';

            return $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            });
        }

        function migrateDatabase(from, to) {
            return $http.get('/api/database/migrate/' + from + '/' + to);
        }
    }
})();
