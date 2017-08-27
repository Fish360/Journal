f360.service('userService',
	function($http){
        this.findAllUsers = findAllUsers;
        this.findUserById = findUserById;

        function findUserById(userId) {
            return $http
                .get("api/admin/user/" + userId)
                .then(function (response) {
                    return response.data;
                });
        }

        function findAllUsers() {
            return $http
                .get("api/admin/user")
                .then(function (response) {
                    return response.data;
                });
        }
});