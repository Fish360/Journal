var f360 = angular.module("f360", ["ngRoute","angucomplete-alt"]);

f360.directive('f360Decimal', function(){
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			element = $(element[0]);
			$(element).on("keyup", function(){
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
        link: function(scope, element, attrs) {
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
	.when("/forgotPassword",
	{
	    templateUrl: "templates/user/forgotPassword.html",
	    controller: "ForgotPasswordController"
	})
	.when("/termsReadOnly",
	{
		templateUrl: "templates/user/termsReadOnly.html"
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
	.when("/:username/upgrade",
	{
		templateUrl: "templates/user/upgrade.html",
		controller: "UpgradeController"
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
    /*
    *   Trip Photos
    */
	.when("/:username/trip/:tripId/photos/:photoIndex",
	{
		templateUrl: "templates/trip/photo.html",
		controller: "TripPhotoController"
	})
	.when("/:username/trip/:tripId/photos",
	{
		templateUrl: "templates/trip/photos.html",
		controller: "TripPhotosController"
	})
	.when("/:username/trip/:tripId/photosFromHome/:photoIndex",
	{
		templateUrl: "templates/trip/photoFromHome.html",
		controller: "TripPhotoController"
	})
	.when("/:username/trip/:tripId/photosFromHome",
	{
		templateUrl: "templates/trip/photosFromHome.html",
		controller: "TripPhotosController"
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
	.when("/:username/spots/:spotId/photos/:photoIndex",
	{
	    templateUrl: "features/spots/photo.html",
	    controller: "SpotPhotoController"
    })
	.when("/:username/spots/:spotId/photos",
	{
	    templateUrl: "features/spots/photos.html",
	    controller: "SpotPhotosController"
    })
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
	.when("/:username/gear/:gearId/photos/:photoIndex",
	{
	    templateUrl: "features/gear/photo.html",
	    controller: "GearPhotoController"
	})
	.when("/:username/gear/:gearId/photos",
	{
	    templateUrl: "features/gear/photos.html",
	    controller: "GearPhotosController"
	})
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
	*	Search Results
	*/
	.when("/:username/searchResults/:searchId",
	{
	    templateUrl: "features/searchResults/list.html",
	    controller: "SearchResultsListController"
	})
	/*
	*	Search
	*/
	.when("/:username/search/list",
	{
	    templateUrl: "features/search/list.html",
	    controller: "SearchListController"
	})
	.when("/:username/search/new",
	{
	    templateUrl: "features/search/new.html",
	    controller: "SearchNewController"
	})
	.when("/:username/search/:id/edit",
	{
	    templateUrl: "features/search/edit.html",
	    controller: "SearchEditController"
	})
	/*
	*	Fish
	*/
	.when("/:username/trip/:tripId/fish/:fishId/photos/:photoIndex",
	{
	    templateUrl: "templates/fish/photo.html",
	    controller: "FishPhotoController"
	})
	.when("/:username/trip/:tripId/fish/:fishId/photos",
	{
	    templateUrl: "templates/fish/photos.html",
	    controller: "FishPhotosController"
	})
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

