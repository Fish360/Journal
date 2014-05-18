var f360 = angular.module("f360", ["ngRoute"]);

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
	.when("/register",
	{
		templateUrl: "templates/user/register.html",
		controller: "RegisterController"
	})
	.when("/:username/trip/new",
	{
		templateUrl: "templates/trip/new.html",
		controller: "NewTripController"
	})
	.when("/:username/trip/list",
	{
		templateUrl: "templates/trip/list.html",
		controller: "TripListController"
		/*
		templateUrl: function(ewq) {
			console.log(ewq);
			return "templates/trip.html"},
		controller: "TripListController"
		*/
	})
	.when("/:username/trip/:tripId/fish/list",
	{
		templateUrl: "templates/fish/list.html",
		controller: "FishListController"
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
	.otherwise({
		templateUrl: "templates/user/login.html",
		controller: "LoginController"
	})
	;
}]);
