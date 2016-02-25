module.exports = function(response) {
    var api = {
        success: success,
        error: error
    };
    return api;

    function success(data) {
        response.send(data);
    }

    function error(error) {
        response.send(error);
    }
}