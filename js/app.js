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
};
