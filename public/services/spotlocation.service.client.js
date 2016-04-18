(function(){
    f360.factory("SpotLocationService",SpotLocationService);
    function SpotLocationService($q) {
        var service = {
            get_location: get_location
        };
        return service;

        function get_location(long,lat){
            var deferred=$q.defer();
            var geocoder = new google.maps.Geocoder();
            var address;
            var latlng={lat: parseFloat(lat), lng: parseFloat(long)};
            var newSpot={};
            geocoder.geocode({ 'location': latlng }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[1]) {
                        address=results[0].address_components;
                        newSpot={};
                        //$scope.newSpot.name=address[1].long_name;
                        newSpot.street="";
                        var county="";
                        for(var i=0;i<address.length;i++){
                            if(address[i].types[0]=="locality"){
                                newSpot.city=address[i].long_name;
                            }
                            if(address[i].types[0]=="neighborhood"){
                                newSpot.name=address[i].long_name;
                            }
                            else if(address[i].types[0]=="street_number"||address[i].types[0]=="route"){
                                newSpot.street=" "+address[i].long_name;
                            }
                            else if(address[i].types[0]=="administrative_area_level_1"){
                                newSpot.state=address[i].long_name;
                            }
                            else if(address[i].types[0]=="administrative_area_level_2") {
                                county=address[i].long_name;
                            }
                            else if(address[i].types[0]=="country"){
                                newSpot.country=address[i].long_name;
                            }
                            else if(address[i].types[0]=="postal_code"){
                                newSpot.zip=address[i].long_name;
                            }
                        }
                        if(!newSpot.city){
                            newSpot.city=county;
                        }
                        if(!newSpot.name) {
                            newSpot.name=newSpot.city;
                        }
                        newSpot.longitude=long;
                        newSpot.latitude=lat;
                        deferred.resolve(newSpot);
                    }
                } else {
                    console.log('Geocoder failed due to: '+status);
                    deferred.reject(status);
                }
            });
            return deferred.promise;
        }
    }
})(); 