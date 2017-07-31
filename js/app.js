var map; // Has to be global to be used in ViewModel

function initMap() {
  // Map styles
  var styles = [
    {
      featureType: 'all',
      elementType: 'all',
      stylers: [{ hue: '#e7ecf0' }]
    },
    {
      featureType: 'poi',
      elementType: 'all',
      stylers: [{ saturation : -50 }]
    },
    {
      featureType: 'road',
      elementType: 'all',
      stylers: [{ saturation: -70 }]
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{ lightness: 51 }]
    },
    {
      featureType: 'transit',
      elementType: 'all',
      stylers: [{ saturation: -43 }]
    },
    {
      featureType: 'transit.line',
      elementType: 'geometry.fill',
      stylers: [{ color: '#79baec' }]
    },
    {
      featureType: 'water',
      elementType: 'all',
      stylers: [{ saturation: -60 }]
    },
    {
      featureType: 'landscape.natural',
      elementType: 'fill',
      stylers: [{ hue: '#00ffdd' }]
    },
    {
      featureType: 'poi.park',
      elementType: 'fill',
      stylers: [{ hue: '#00ff33' }]
    }
  ];

    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 63.436602, lng: 10.398891},
    styles: styles,
    zoom: 13,
    mapTypeControl: false,
    fullscreenControl: false
  });

  // Side panel controls are hidden when the full-size Street View is active, so that they do not cover the SV controls.
  map.getStreetView().addListener('visible_changed', function() {
    if (map.getStreetView().getVisible()) {
      $('.panel-opener').css('display', 'none');
    } else $('.panel-opener').css('display', 'inline-block');
  });

  var iw = new google.maps.InfoWindow({}); // Only one exists at a time

  var getPlaceDetails = function(id) {
    var service = new google.maps.places.PlacesService(map);
    var place = service.getDetails({placeId: id}, function(place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        return place;
      } else {
        console.log('Cannot get details for id ' + id + ' (' + status + ').');
        return undefined;
      }
    });
  };

  var makeInfoWindow = function(place) {
    var name = place.name ? place.name : '';
    var type = place.types ? place.types[0].replace('_', ' ') : '';
    var address = place.formatted_address ? place.formatted_address : '';
    var notes = place.notes ? place.notes : '';
    iw.maxWidth = window.innerWidth;
    iw.setContent (
      '<h1 class=\"iw-place-name\">' + name + '</h1>' +
      '<h2 class=\"iw-place-type\"> &ndash; ' + type + '</h2>' +
      '<div class=\"iw-place-address\">' + address + '</div>' +
      '<input id=\"iw-pano-photos-btn\" type=\"button\">' +
      '<div id=\"iw-panorama\"></div>' +
      '<div id=\"iw-notes\">' + notes + '</div>' +
      '<input id=\"iw-directions-btn\" type=\"button\" value=\"Show directions\">');
  };

  var makeMarker = function(place, icon) {
    if (!icon) {
      switch (place.types[0].toLowerCase()) {
        case 'venue':
          icon = 'img/meet.png';
          break;
        case 'cafe':
        case 'restaurant':
        case 'bakery':
          icon = 'img/cafe.png';
          break;
        case 'lodging':
          icon = 'img/hotel.png';
          break;
        case 'bus_station':
          icon = 'img/bus.png';
          break;
        case 'train_station':
          icon = 'img/train.png';
          break;
        default:
          icon = 'img/default.png';
      };
    }
    var marker = new google.maps.Marker({
      position: place.geometry.location,
      title: place.formatted_address,
      animation: google.maps.Animation.DROP,
      icon: icon,
      pic: 'panorama',
      placeOnMap: place // For making the list of places linked with markers
    });

    // Change appearance on hover
    marker.addListener('mouseover', function() {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    });
    marker.addListener('mouseout', function() {
      marker.setAnimation('none');
    });

    // StreetView in the info window
    var streetViewService = new google.maps.StreetViewService();
    var radius = 50;

    // StreetView in the info window
    var panoOptions;
    function getStreetView(data, status) {
      if (status === google.maps.StreetViewStatus.OK) {
        var heading = google.maps.geometry.spherical.computeHeading(data.location.latLng, marker.position);
        panoOptions = {
          position: data.location.latLng,
          pov: {
            heading: heading,
            pitch: 0
          }
        };
        showPanorama(panoOptions, marker);
      } else document.getElementById('iw-panorama').appendChild(document.createTextNode('Couldn\'t display a panorama.'));
    };

    var showPanorama = function(panoOptions, marker) {
      $('#iw-panorama').empty();
      $('#iw-pano-photos-btn').attr('value', 'Show photos');
      marker.pic = 'panorama';
      var panorama = new google.maps.StreetViewPanorama(
        document.getElementById('iw-panorama'), panoOptions
      );
    }

    // Photos in the info window
    var showPhotos = function(marker) {
      $('#iw-panorama').empty();
      $('#iw-pano-photos-btn').attr('value', 'Show panorama');
      marker.pic = 'photos';
      var service = new google.maps.places.PlacesService(map);
      service.getDetails({placeId: place.place_id}, getPhotos);
      function getPhotos(place, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          var photos = place.photos;
          if (!photos) {
            $('#iw-panorama').append('<p>Couldn\'t find photos.</p>');
          } else {
            var photoNum = 0;
            $('#iw-panorama').append(
              '<p class=\"iw-photo-comment\">Photo ' +
              (photoNum + 1) + '\/' + photos.length +
              (photos.length > 1 ? ' - click or swipe to view next' : '') +
              '</p><div class=\"iw-photo-container\"></div>');
            // Show the 1st photo
            $('.iw-photo-container').append('<img src=\"img/preloader.svg\" class=\"iw-preloader\">');
            var img = document.createElement('IMG');
            img.setAttribute('src', photos[0].getUrl({maxWidth: 800, maxHeight: 600})); // A larger image can be zoomed in to inspect details
            img.setAttribute('class', 'iw-photo');
            img.addEventListener('load', function(event)  {
              $('.iw-photo-container').empty();
              $('.iw-photo-container').append(img);
            });
            var nextPhoto = function() {
              // Update the photo and the count. After the last photo, start over.
              $('.iw-photo-container').empty();
              $('.iw-photo-comment').empty();
              $('.iw-photo-container').append('<img src=\"img/preloader.svg\" class=\"iw-preloader\">');
              photoNum = photoNum === photos.length - 1 ? 0 : photoNum + 1;
              var img = document.createElement('IMG');
              img.setAttribute('src', photos[photoNum].getUrl({maxWidth: 800, maxHeight: 600}));
              img.setAttribute('class', 'iw-photo');
              img.addEventListener('load', function(event) {
                $('.iw-photo-container').empty();
                $('.iw-photo-comment').append('Photo ' +
                (photoNum + 1) + '\/' + photos.length +
                (photos.length > 1 ? ' - click or swipe to view next' : ''));
                $('.iw-photo-container').append(img);
              });
            };
            var prevPhoto = function() {
              // Update the photo and the count. After the first photo, go to the last one.
              $('.iw-photo-container').empty();
              $('.iw-photo-comment').empty();
              $('.iw-photo-container').append('<img src=\"img/preloader.svg\" class=\"iw-preloader\">');
              photoNum = photoNum === 0 ? photos.length - 1 : photoNum - 1;
              var img = document.createElement('IMG');
              img.setAttribute('src', photos[photoNum].getUrl({maxWidth: 800, maxHeight: 600}));
              img.setAttribute('class', 'iw-photo');
              img.addEventListener('load', function(event) {
                $('.iw-photo-container').empty();
                $('.iw-photo-comment').append('Photo ' +
                (photoNum + 1) + '\/' + photos.length +
                (photos.length > 1 ? ' - click or swipe to view next' : ''));
                $('.iw-photo-container').append(img);
              });
            };
            $('.iw-photo-container').click(nextPhoto);
            $('.iw-photo-container').on('swipeleft', nextPhoto);
            $('.iw-photo-container').on('swiperight', prevPhoto);
          }
        } else {
          $('#iw-panorama').append('<p>Couldn\'t find photos.');
        }
      }
    };

    marker.clickOnMarker = function() {
      makeInfoWindow(place);
      streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
      iw.open(map, marker);
      map.addListener('click', function() {iw.close();});
      $('#iw-pano-photos-btn').click(function() {
        marker.pic === 'panorama' ? showPhotos(marker) : showPanorama(panoOptions, marker);
      });
    }

    marker.addListener('click', function() {this.clickOnMarker();});
    return marker;
  };

  // Find more places
  $('#find-more-places').click(function() {
    var placeInput = document.getElementById('find-more-places');
    var searchBox = new google.maps.places.SearchBox(placeInput);
    searchBox.setBounds(map.getBounds());
    searchBox.addListener('places_changed', function() {
      clearMap();
      var places = searchBox.getPlaces();
      showMarkers(places);
    });
  });

  var clearMap = function() {
    myViewModel.markersOnMap().forEach(function(marker) {
      marker.setMap(null);
    });
    myViewModel.markersOnMap.removeAll();
    myViewModel.markersOnMapIds.removeAll();
    myViewModel.markersOnMapPlaces.removeAll();
  };

  // Showing initial markers on the map
  var showMarkers = function(places) {
    var bounds = new google.maps.LatLngBounds();
    // If there are no markers to display, the map still covers the senter of Trondheim
    bounds.extend(myViewModel.confPlaces()[0].geometry.location);
    bounds.extend(myViewModel.confPlaces()[6].geometry.location);
    places.forEach(function(place) {
      var placeId = place.place_id;
      var marker = makeMarker(place, null);
      if (!myViewModel.markersOnMapIds().includes(placeId)) {
        myViewModel.markersOnMap.push(marker);
        myViewModel.markersOnMapIds.push(placeId);
        myViewModel.markersOnMapPlaces.push({place});
        marker.setMap(map);
        bounds.extend(marker.position);
      }
    });
    map.fitBounds(bounds);
  };

  showMarkers(myViewModel.confPlaces());

  $('#show').click(function() {
    showMarkers(myViewModel.confPlaces());
  });
  $('#hide').click(clearMap);

};
