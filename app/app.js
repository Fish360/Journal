module.exports = function (app, db) {
    var model = require("./models/reports.model.server.js")(db);
    require("./services/reports.service.server.js")(app, model);
}