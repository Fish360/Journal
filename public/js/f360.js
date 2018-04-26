var f360 = angular
    .module("f360", ["ngRoute", "angucomplete-alt", "f360-directives","720kb.socialshare"]);

f360.directive('f360Decimal', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element = $(element[0]);
            $(element).on("keyup", function () {
                var value = element.val();
                value = value.toString();
                value = value.replace(".", "");
                value = value.replace(",", "");
                value = (value / 100.0).toFixed(2);
                element.val(value);
            });
        }
    }
});


//f360.directive('siteHeader', function () {
f360.directive('backButton', function () {
    return {
        restrict: 'E',
//        template: '<button class="btn">{{back}}</button><button class="btn">{{forward}}</button>',
        template: '<a class="btn btn-danger pull-left f360-navbar-button"><span class="glyphicon glyphicon-chevron-left"></span></a>',
        scope: {
            back: '@back',
//            forward: '@forward',
            icons: '@icons'
        },
        link: function (scope, element, attrs) {
            $(element[0]).on('click', function () {
                history.back();
                scope.$apply();
            });
//            $(element[1]).on('click', function() {
//                history.forward();
//                scope.$apply();
//            });
        }
    };
});

f360.config(["$routeProvider", function ($routeProvider, $http) {
    $routeProvider


        .when("/admin/database", {
            "templateUrl": "views/admin/templates/database/admin-database.view.client.html"
        })
        .when("/admin/database/backup", {
            "templateUrl": "views/admin/templates/database/admin-database-backup.view.client.html",
            "controller": "DatabaseController",
            "controllerAs": "model"
        })
        .when("/admin/database/restore", {
            "templateUrl": "views/admin/templates/database/admin-database-restore.view.client.html",
            "controller": "DatabaseController",
            "controllerAs": "model"
        })
        .when("/admin/database/migrate", {
            "templateUrl": "views/admin/templates/database/admin-database-migrate.view.client.html",
                "controller": "DatabaseController",
                "controllerAs": "model",
                "resolve": {
                "user": "checkAdmin"
            }})
        .when("/:username/admin", {
            templateUrl: "views/admin/templates/admin.template.view.html",
            controller: "adminController",
            controllerAs: "model"
        })
        .when("/:username/admin/user", {
            templateUrl: "views/admin/templates/user-list.template.view.html",
            controller: "userListController",
            controllerAs: "model"
        })
        .when("/:username/admin/user/:userId", {
            templateUrl: "views/admin/templates/user-edit.template.view.html",
            controller: "userEditController",
            controllerAs: "model"
        })
        .when("/",
        {
            templateUrl: "views/user/login2.html",
            controller: "LoginController2"
        })
        .when("/login",
        {
            templateUrl: "views/user/login.html",
            controller: "LoginController"
        })
        .when("/forgotPassword",
        {
            templateUrl: "views/user/forgotPassword.html",
            controller: "ForgotPasswordController"
        })
        .when("/termsReadOnly",
        {
            templateUrl: "views/user/termsReadOnly.html"
        })
        .when("/terms",
        {
            templateUrl: "views/user/terms.html",
            controller: "TermsController"
        })
        .when("/register/true",
        {
            templateUrl: "views/user/register.html",
            controller: "RegisterController"
        })
        .when("/:username/profile",
        {
            templateUrl: "views/user/profile.html",
            controller: "ProfileController"
        })
        .when("/:username/upgrade",
        {
            templateUrl: "views/user/upgrade.html",
            controller: "UpgradeController"
        })
        /*
         *	Home
         */
        .when("/:username/home",
        {
            templateUrl: "views/home/home.html",
            controller: "HomeController"
        })
        /*
         *	Trips
         */
        .when("/:username/trip/new",
        {
            templateUrl: "views/trip/templates/trip-new.html",
            controller: "NewTripController"
        })
        .when("/:username/trip/list",
        {
            templateUrl: "views/trip/templates/trip-list.html",
            controller: "TripListController"
        })
        .when("/:username/trip/:tripid/edit",
        {
            templateUrl: "views/trip/templates/trip-edit.html",
            controller: "EditTripController"
        })
        .when("/:username/trip/:tripid/editFromHome",
        {
            templateUrl: "views/trip/templates/trip-edit-from-home.html",
            controller: "EditTripController"
        })
        .when("/:username/trip/:tripId/photos/:photoIndex",
            {
                templateUrl: "views/trip/templates/trip-photo.html",
                controller: "TripPhotoController"
            })
        .when("/:username/trip/:tripId/photos",
            {
                templateUrl: "views/trip/templates/trip-photo-list.html",
                controller: "TripPhotosController"
            })
        .when("/:username/trip/:tripId/photosFromHome/:photoIndex",
            {
                templateUrl: "views/trip/templates/trip-photo-from-home.html",
                controller: "TripPhotoController"
            })
        .when("/:username/trip/:tripId/photosFromHome",
            {
                templateUrl: "views/trip/templates/trip-photo-list-from-home.html",
                controller: "TripPhotosController"
            })
        .when("/:username/trip/:tripid/listFromHome",
            {
                templateUrl: "views/fish/listFromHome.html",
                controller: "FishListController"
            })
        /*
         *	Spots
         */
        .when("/:username/spots/:spotId/photos/:photoIndex",
        {
            templateUrl: "views/spots/photo.html",
            controller: "SpotPhotoController"
        })
        .when("/:username/spots/:spotId/photos",
        {
            templateUrl: "views/spots/photos.html",
            controller: "SpotPhotosController"
        })
        .when("/:username/spots/list",
        {
            templateUrl: "views/spots/list.html",
            controller: "SpotListController"
        })
        .when("/:username/spots/new",
        {
            templateUrl: "views/spots/new.html",
            controller: "SpotNewController"
        })
        .when("/:username/spots/newgroup",
            {
                templateUrl: "views/spots/newgroup.html",
                controller: "SpotNewGroupController"
            })
        .when("/:username/spots/:id/edit",
        {
            templateUrl: "views/spots/edit.html",
            controller: "SpotEditController"
        })
        /*
         *	Presentations
         */
        .when("/:username/presentations/list",
        {
            templateUrl: "views/presentations/list.html",
            controller: "PresentationsListController"
        })
        .when("/:username/presentations/new",
        {
            templateUrl: "views/presentations/new.html",
            controller: "PresentationsNewController"
        })
        .when("/:username/presentations/:id/edit",
        {
            templateUrl: "views/presentations/edit.html",
            controller: "PresentationsEditController"
        })
        /*
         *	Gear
         */
        .when("/:username/gear/:gearId/photos/:photoIndex",
        {
            templateUrl: "views/gear/photo.html",
            controller: "GearPhotoController"
        })
        .when("/:username/gear/:gearId/photos",
        {
            templateUrl: "views/gear/photos.html",
            controller: "GearPhotosController"
        })
        .when("/:username/gear/list",
        {
            templateUrl: "views/gear/list.html",
            controller: "GearListController"
        })
        .when("/:username/gear/new",
        {
            templateUrl: "views/gear/new.html",
            controller: "GearNewController"
        })
        .when("/:username/gear/:id/edit",
        {
            templateUrl: "views/gear/edit.html",
            controller: "GearEditController"
        })
        /*
         * Reports
         */
        .when("/:username/reports",
        {
            templateUrl: "views/reports/reports-list.html",
            controller: "ReportListController"
        })
        // .when("/:username/reports/new",
        // {
        //     // templateUrl: "views/reports/reports-new.html",
        //     // controller: "NewReportController"
        //     templateUrl: "views/reports/reports-edit.html",
        //     controller: "EditReportController"
        // })
        .when("/:username/reports/:reportId",
        {
            templateUrl: "views/reports/reports-edit.html",
            controller: "EditReportController"
        })
        .when("/:username/reports/:reportId/timeOfYear",
        {
            templateUrl: "views/reports/reports-toy.html",
            controller: "TimeOfYearReportController"
        })
        .when("/:username/reports/:reportId/spots",
        {
            templateUrl: "views/reports/reports-spots.html",
            controller: "SpotsReportController"
        })
        .when("/:username/reports/:reportId/presentations",
        {
            templateUrl: "views/reports/reports-presentations.html",
            controller: "PresentationsReportController"
        })
        .when("/:username/reports/:reportId/moonphase",
        {
            templateUrl: "views/reports/reports-moonphase.html",
            controller: "MoonPhaseReportController"
        })
        .when("/:username/reports/:reportId/condition",
        {
            templateUrl: "views/reports/reports-condition.html",
            controller: "ConditionReportController"
        })
        .when("/:username/reports/:reportId/tideSunMoonFish",
        {
            templateUrl: "views/reports/reports-tideSunMoonFish.html",
            controller: "TideSunMoonFishReportController"
        })
        /*
         *	Search Results
         */
        .when("/:username/searchResults/:searchId",
        {
            templateUrl: "views/searchResults/list.html",
            controller: "SearchResultsListController"
        })
        /*
         *	Search
         */
        .when("/:username/search/list",
        {
            templateUrl: "views/search/list.html",
            controller: "SearchListController"
        })
        .when("/:username/search/new",
        {
            templateUrl: "views/search/new.html",
            controller: "SearchNewController"
        })
        .when("/:username/search/:id/edit",
        {
            templateUrl: "views/search/edit.html",
            controller: "SearchEditController"
        })
        /*
         *	Fish
         */
        .when("/:username/trip/:tripId/fish/:fishId/photos/:photoIndex",
        {
            templateUrl: "views/fish/photo.html",
            controller: "FishPhotoController"
        })
        .when("/:username/trip/:tripId/fish/:fishId/photos",
        {
            templateUrl: "views/fish/photos.html",
            controller: "FishPhotosController"
        })
        .when("/:username/trip/:tripId/fish/list",
        {
            templateUrl: "views/fish/list.html",
            controller: "FishListController"
        })
        .when("/:username/fish/list",
        {
            templateUrl: "views/fish/listFromHome.html",
            controller: "FishHomeListController"
        })
        .when("/:username/trip/:tripId/fish/new",
        {
            templateUrl: "views/fish/new.html",
            controller: "NewFishController"
        })
        .when("/:username/fish/new",
            {
                templateUrl: "views/fish/newFish.html",
                controller: "NewFishFromHomeController"
            })
        .when("/:username/trip/:tripId/fish/:fishId/edit",
        {
            templateUrl: "views/fish/edit.html",
            controller: "EditFishController"
        })
        .when("/:username/trip/:tripId/fish/:fishId/share",
            {
                templateUrl: "views/fish/emailShare.html",
                controller: "FishShareController"
            })
        .when("/:username/trip/:tripId/fish/:fishId/editFromHome",
        {
            templateUrl: "views/fish/editFromHome.html",
            controller: "EditFishController"
        })
        .otherwise({
            templateUrl: "views/user/login.html",
            controller: "LoginController"
        })
    ;
}]);

f360.monthNames = {
    '01': 'JAN', '02': 'FEB', '03': 'MAR',
    '04': 'APR', '05': 'MAY', '06': 'JUN',
    '07': 'JUL', '08': 'AUG', '09': 'SEP',
    '10': 'OCT', '11': 'NOV', '12': 'DEC'
};

f360.filter('f360MonthName', function() {
    return function(input) {
        var monthIndex = input.substring(4,6);
        var monthName = f360.monthNames[monthIndex];
        return monthName;
    };
})