var confMarkers = [];

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

    var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 63.436602, lng: 10.398891},
    styles: styles,
    zoom: 13,
    mapTypeControl: false
  });

  var iw = new google.maps.InfoWindow({});

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
    iw.setContent ('<h1 class=\"iw-place-name\">' + name + '</h1>' +
      '<h2 class=\"iw-place-type\">' + type + '</h2>' +
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
      icon: icon
    });
    // StreetView in the info window
    var streetViewService = new google.maps.StreetViewService();
    var radius = 50;

    // StreetView in the info window
    function getStreetView(data, status) {
      if (status === google.maps.StreetViewStatus.OK) {
        var heading = google.maps.geometry.spherical.computeHeading(data.location.latLng, marker.position);
        var panoOptions = {
          position: data.location.latLng,
          pov: {
            heading: heading,
            pitch: 15
          }
        };
        var panorama = new google.maps.StreetViewPanorama(
          document.getElementById('iw-panorama'), panoOptions
        );
      } else document.getElementById('iw-panorama').appendChild(document.createTextNode('Couldn\'t display a panorama.'));
    };
    marker.addListener('click', function() {
      makeInfoWindow(place);
      streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
      iw.open(map, marker);
    });
    return marker;
  };

  // Initial markers
  var showConfMarkers = function() {
    confMarkers = [];
    var confPlaces = new ViewModel().confPlaces();
    var bounds = new google.maps.LatLngBounds();
    confPlaces.forEach(function(confPlace) {
      var placeId = {placeId: confPlace.id};
      var service = new google.maps.places.PlacesService(map);
      var marker = makeMarker(confPlace, null);
      marker.setMap(map);
      bounds.extend(marker.position);
      confMarkers.push(marker);
    });
    map.fitBounds(bounds);
  };

  showConfMarkers();

  var hideConfMarkers = function() {
    confMarkers.forEach(function(marker) {
      marker.setMap(null);
    });
  };

  $('#show').click(showConfMarkers);
  $('#hide').click(hideConfMarkers);
};
