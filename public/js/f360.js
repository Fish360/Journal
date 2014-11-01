var f360 = angular.module("f360", ["ngRoute"]);

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
        link: function(scope, element, attrs) {
		console.log(999);
            $(element[0]).on('click', function() {
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

f360.config(["$routeProvider", function($routeProvider, $http)
{
	$routeProvider
	.when("/",
	{
		templateUrl: "templates/user/login.html",
		controller: "LoginController"
	})
	.when("/login",
	{
		templateUrl: "templates/user/login.html",
		controller: "LoginController"
	})
	.when("/terms",
	{
		templateUrl: "templates/user/terms.html",
		controller: "TermsController"
	})
	.when("/register/true",
	{
		templateUrl: "templates/user/register.html",
		controller: "RegisterController"
	})
	.when("/:username/profile",
	{
		templateUrl: "templates/user/profile.html",
		controller: "ProfileController"
	})
	/*
	*	Home
	*/
	.when("/:username/home",
	{
		templateUrl: "templates/home/home.html",
		controller: "HomeController"
	})
	/*
	*	Trips
	*/
	.when("/:username/trip/new",
	{
		templateUrl: "templates/trip/new.html",
		controller: "NewTripController"
	})
	.when("/:username/trip/list",
	{
		templateUrl: "templates/trip/list.html",
		controller: "TripListController"
	})
	.when("/:username/trip/:tripid/edit",
	{
		templateUrl: "templates/trip/edit.html",
		controller: "EditTripController"
	})
	.when("/:username/trip/:tripid/editFromHome",
	{
		templateUrl: "templates/trip/editFromHome.html",
		controller: "EditTripController"
	})
	.when("/:username/trip/:tripid/listFromHome",
	{
		templateUrl: "templates/fish/listFromHome.html",
		controller: "FishListController"
	})
	/*
	*	Spots
	*/
	.when("/:username/spots/list",
	{
	    templateUrl: "features/spots/list.html",
	    controller: "SpotListController"
	})
	.when("/:username/spots/new",
	{
	    templateUrl: "features/spots/new.html",
	    controller: "SpotNewController"
	})
	.when("/:username/spots/:id/edit",
	{
	    templateUrl: "features/spots/edit.html",
	    controller: "SpotEditController"
	})
	/*
	*	Presentations
	*/
	.when("/:username/presentations/list",
	{
	    templateUrl: "features/presentations/list.html",
	    controller: "PresentationsListController"
	})
	.when("/:username/presentations/new",
	{
	    templateUrl: "features/presentations/new.html",
	    controller: "PresentationsNewController"
	})
	.when("/:username/presentations/:id/edit",
	{
	    templateUrl: "features/presentations/edit.html",
	    controller: "PresentationsEditController"
	})
	/*
	*	Gear
	*/
	.when("/:username/gear/list",
	{
	    templateUrl: "features/gear/list.html",
	    controller: "GearListController"
	})
	.when("/:username/gear/new",
	{
	    templateUrl: "features/gear/new.html",
	    controller: "GearNewController"
	})
	.when("/:username/gear/:id/edit",
	{
	    templateUrl: "features/gear/edit.html",
	    controller: "GearEditController"
	})
	/*
	*	Fish
	*/
	.when("/:username/trip/:tripId/fish/list",
	{
		templateUrl: "templates/fish/list.html",
		controller: "FishListController"
	})
	.when("/:username/fish/list",
	{
		templateUrl: "templates/fish/listFromHome.html",
		controller: "FishHomeListController"
	})
	.when("/:username/trip/:tripId/fish/new",
	{
		templateUrl: "templates/fish/new.html",
		controller: "NewFishController"
	})
	.when("/:username/trip/:tripId/fish/:fishId/edit",
	{
		templateUrl: "templates/fish/edit.html",
		controller: "EditFishController"
	})
	.when("/:username/trip/:tripId/fish/:fishId/editFromHome",
	{
		templateUrl: "templates/fish/editFromHome.html",
		controller: "EditFishController"
	})
	.otherwise({
		templateUrl: "templates/user/login.html",
		controller: "LoginController"
	})
	;
}]);
