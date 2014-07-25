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
