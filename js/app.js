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

  var getPlaceDetails = function(id) {
    var service = new google.maps.places.PlacesService(map);
    var place = service.getDetails({placeId: id}, function(place, status) {
      console.log(status);
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        console.log(place);
        return place;
      } else {
        console.log('Cannot get details for id ' + id + ' (' + status + ').');
        return undefined;
      }
    })
  };

  var makeInfoWindow = function(place) {
    var name = place.name ? place.name : '';
    var type = place.types ? place.types[0].replace('_', ' ') : '';
    var address = place.formatted_address ? place.formatted_address : '';
    var infoWindow = new google.maps.InfoWindow({
      content: '<h1 class=\"iw-place-name\">' + name + '</h1>' +
        '<h2 class=\"iw-place-type\">' + type + '</h2>' +
        '<div class=\"iw-place-address\">' + address + '</div>' +
        '<input id=\"iw-pano-photos-btn\" type=\"button\">' +
        '<div id=\"iw-panorama\"></div>' +
        '<input id=\"iw-directions-btn\" type=\"button\" value=\"Show directions\">'
    });
    return infoWindow;
  };

  var makeMarker = function(place, infoWindow, icon) {
    if (!icon) {
      switch (place.types[0]) {
        case 'cafe':
        case 'restaurant':
        case 'bakery':
          icon = 'img/cafe.png'
          break;
        case 'hotel':
          icon = 'img/hotel.png'
          break;
        case 'bus_station':
          icon = 'img/bus.png'
          break;
        case 'train_station':
          icon = 'img/train.png'
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
    return marker;
  };

  // Test making markers
  var places = [];
  var markers = [];
  var ids = new ViewModel().confPlaces();
  ids.forEach(function(id) {
    var place = getPlaceDetails(id.id);
    console.log(place);
    places.push(place);
  });
  console.log(places);
};
