// Initialize Firebase
  var config = {
    apiKey: "AIzaSyDMYHVCZBMIioFSkJekODiR73YLBMAWkSA",
    authDomain: "tdc-2017-map.firebaseapp.com",
    databaseURL: "https://tdc-2017-map.firebaseio.com",
    projectId: "tdc-2017-map",
    storageBucket: "",
    messagingSenderId: "41083302772"
  };
  try {
    firebase.initializeApp(config);
    var database = firebase.database();

    firebase.auth().signInAnonymously().catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      myViewModel.noSignInPopup();
      myViewModel.signinStatus('Sign-in error ' + errorCode + ': ' + errorMessage);
    });

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        myViewModel.signinStatus('Signed in as ' + (user.displayName ? user.displayName : 'user ' + user.uid));
        var uid = user.uid;
      } else {
        console.log('Signed out.');
      }
    });
  } catch(error) {
    myViewModel.noFirebasePopup();
    console.log(error);
  }

// Make "My location: Show/Hide" buttons a group, Hide disabled
$('#my-location-group').controlgroup({
  type: 'horizontal'
});
$('#my-location-hide').addClass('ui-state-disabled');

var map; // Has to be global to be used in ViewModel
var morePlaces = false; // A token for repeating search when boundaries change. The feature is currently commented out.
var initialMarkers = [];

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 63.436602, lng: 10.398891},
    zoom: 13,
    mapTypeControl: false,
    fullscreenControl: false
  });

  // Loading map styles
  $.ajax({
    url: 'js/map-styles.js'
  }).done(function() {map.setOptions({styles: mapStyles});}).fail(function() {map.setOptions({
    styles: [{
      featureType: 'all',
      elementType: 'all',
      stylers: [{hue: "#e7ecf0"}]
    }]
  });});

  // Side panel controls are hidden when the full-size Street View is active, so that they do not cover the SV controls.
  map.getStreetView().addListener('visible_changed', function() {
    if (map.getStreetView().getVisible()) {
      $('.panel-opener').css('display', 'none');
    } else $('.panel-opener').css('display', 'inline-block');
  });

  var iw = new google.maps.InfoWindow({}); // Only one window exists at a time

  var makeInfoWindow = function(place) {
    var name = place.name ? place.name : '';
    var type = place.types ? (' – ' + place.types[0].replace(/_/g, ' ')) : '';
    var address = place.formatted_address ? place.formatted_address : '';
    var notes = place.notes ? place.notes : '';
    iw.setContent(
      '<article>' +
        '<h2 class=\"iw-place-name\">' + name + '</h2>' +
        '<h3 class=\"iw-place-type\">' + type + '</h3>' +
        '<div class=\"iw-place-address\">' + address + '</div>' +
        '<div id=\"iw-notes\">' + notes + '</div>' +
      '</article>'
    );
  };

  var activeMarker; // The only active marker with opacity == 1

  var makeMarker = function(place) {
    var icon = place.custom_icon;
    if (!place.custom_icon) {
      switch (place.types[0].toLowerCase()) {
        case 'venue':
          icon = 'img/meet.png';
          break;
        case 'cafe':
        case 'restaurant':
        case 'bakery':
          icon = 'img/cafe.png';
          break;
        case 'bar':
          icon = 'img/bar.png';
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
      }
    }
    var marker = new google.maps.Marker({
      position: place.geometry.location,
      title: place.formatted_address,
      animation: google.maps.Animation.DROP,
      icon: icon,
      opacity: 0.7,
      placeOnMap: place // For linking the list of places to markers
    });
    marker.onMap = ko.observable(); // For showing/hiding on the list

    window.addEventListener('click', function() {
      // Marker becomes 'inactive' whenever the info window is closed
      if (!iw.map) marker.setOpacity(0.7);
    });

    // Change marker's appearance on hover
    marker.addListener('mouseover', function() {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    });
    marker.addListener('mouseout', function() {
      marker.setAnimation('none');
    });

    // Show info window after a click on a marker
    marker.clickOnMarker = function() {
      if (activeMarker) activeMarker.setOpacity(0.7);
      activeMarker = marker;
      marker.setOpacity(1);
      makeInfoWindow(place);
      iw.setOptions({maxWidth: (window.innerWidth * 0.5).toFixed()});
      iw.open(map, marker);

      map.addListener('click', function() {
        iw.close();
      });

      // Update the weather forecast
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({location: marker.position}, function(result, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          var country = '',
            countryLong = '',
            locality = '',
            postcode = '',
            request;
          result[0].address_components.forEach(function(component) {
            component.types.forEach(function(type) {
              if (type === 'country') {
                country = component.short_name;
                countryLong = component.long_name;
              }
              if (type === 'locality') locality = component.long_name;
              if (type === 'postal_code') postcode = component.long_name;
            });
          });
          if (country === 'NO') {
            // Weather request for Norway - by postal code
            // postcode = parseInt(postcode, 10);
            request = 'https://www.yr.no/place/Norway/postnummer/' + postcode + '/forecast.xml';
            myViewModel.buildForecast(request);
          } else {
            // Request for other countries - by country and locality
            request = {};
            request.locality = locality;
            request.country = countryLong;
            request.url = 'https://www.yr.no/soek/soek.aspx?sted=' + locality + '&land=' + country + '&sok=Search';
            myViewModel.forecastFallback(request, 'The place is not in Norway or the post code is missing.');
          }
        } else {myViewModel.forecastFallback({url: 'https://www.yr.no'}, 'Something is wrong with the geocoder.');}
      });
    };

    marker.addListener('click', function() {this.clickOnMarker();});
    return marker;
  };

  var clearMap = function() {
    myViewModel.markersOnMap().forEach(function(marker) {
      marker.setMap(null);
      marker.onMap(false);
    });
    myViewModel.markersOnMap.removeAll();
    morePlaces = false;
    myViewModel.dirInstructions.removeAll();
    myViewModel.dirInstructionsHeader('');
    myViewModel.dirInstructionsFrom('');
    myViewModel.dirInstructionsTo('');
  };

  // Showing markers on map, adding them to ViewModel arrays for tracking
  var showMarkers = function(places) {
    var bounds = new google.maps.LatLngBounds();
    // If there are no markers to display, the map still covers the senter of Trondheim
    if (places.length === 0) {
      bounds.extend({lat: 63.4400274, lng: 10.4024274});
      bounds.extend({lat: 63.432715, lng: 10.397460});
    }
    places.forEach(function(place) {
      var marker = makeMarker(place);
      myViewModel.markersOnMap.push(marker);
      marker.setMap(map);
      marker.onMap(true);
      bounds.extend(marker.position);
    });
    map.fitBounds(bounds);
    if (places.length === 1) {
      map.setZoom(15);
    }
  };

  // Showing initial markers on the map
  $.ajax({
    url: 'js/conf-places.js'
  }).done(function() {
    initialMarkers = confPlaces;
    showMarkers(initialMarkers);
  }).fail(function() {alert('Couldn\'t load markers. Try to find places in the left side panel (Show places).');});

  // Find more places
  var mapBounds;
  // The user will have to repeat search every time the map is zoomed or panned. The way Search Box handles bounds is too unpredictable for automatic search. Uncomment the line below to check its behaviour.
  map.addListener('bounds_changed', function() {
    mapBounds = map.getBounds();
    // if (morePlaces) findMorePlaces();
  });
  var placeInput = document.getElementById('find-more-places');
  var searchBox = new google.maps.places.SearchBox(placeInput);
  var findMorePlaces = function() {
    clearMap();
    morePlaces = true;
    mapBounds = map.getBounds();
    searchBox.setBounds(mapBounds);
    var places = searchBox.getPlaces();
    var filteredPlaces = []; // No places outside bounds should be displayed
    places.forEach(function(place) {
      if (mapBounds.contains(place.geometry.location)) {
        filteredPlaces.push(place);
      }
    });
    showMarkers(filteredPlaces);
  };
  searchBox.addListener('places_changed', findMorePlaces);
}
