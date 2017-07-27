function ViewModel() {
  // Places for the initial array of markers
  this.confPlaces = ko.observableArray([
    { // Clarion Hotel & Congress
      name: 'Clarion Hotel & Congress',
      types: ['venue'],
      formatted_address: 'Brattørkaia 1, 7010 Trondheim, Norway',
      geometry: {location: {lat: 63.44002739999999, lng: 10.4024274}},
      place_id: 'ChIJq3jrGHYxbUYRWCokKUAb-00',
      notes: 'The Conference venue: Monday 30 October at 9:00–18:00'
    },
    { // Central station
      name: 'Trondheim S',
      types: ['train_station'],
      formatted_address: 'Fosenkaia 1, 7010 Trondheim',
      geometry: {location: {lat: 63.43669999999999, lng: 10.3988199}},
      place_id: 'ChIJ8QoyqZ0xbUYRzsViX0zp1e8',
      notes: 'Trains from Værnes airport arrive at 6:32, 6:53, 7:32, 7:47, 8:00 and 8:32'
    },
    { // Bus station
      name: 'Bussterminal',
      types: ['bus_station'],
      formatted_address: '7010 Trondheim, S 13',
      geometry: {location: {lat: 63.4360928, lng: 10.4011951}},
      place_id: 'ChIJo-Y7M5wxbUYRYcW5XF9iHSk',
      notes: 'Buses 3, 19, 46, 48, 54, 55, 60, 75, 92, 94, 310, 320, 330, 340, 350, 410, 450, 470, 480, 4101'
    },
    // Places that open before 9 AM
    { // Godt Brød bakery
      name: 'Godt Brød Bakeriet',
      types: ['Bakery'],
      formatted_address: 'Thomas Angells gate 16',
      geometry: {location: {lat: 63.4328076, lng: 10.3981416}},
      place_id: 'ChIJD6jnjpsxbUYRnbiHT9RoYmk',
      notes: 'Opens at 6 AM'
    },
    { // Starbucks
      name: 'Starbucks',
      types: ['Cafe'],
      formatted_address: 'Kongens gate 14B',
      geometry: {location: {lat: 63.43060060000001, lng: 10.3970648}},
      place_id: 'ChIJWwkjs5sxbUYRQfhT0Rg143o',
      notes: 'Opens at 7:00'
    },
    { // Baker'n på torget (Rosenborg bakeri)
      name: 'Rosenborg bakeri - Rema 1000',
      types: ['Bakery'],
      formatted_address: 'Munkegata 22',
      geometry: {location: {lat: 63.430189, lng: 10.394318}},
      place_id: 'ChIJpSsF-ZoxbUYRQOG9Ddb_7VE',
      notes: 'Opens at 7:00'
    },
    { // Café le Frère
      name: 'Café le Frère',
      types: ['Cafe'],
      formatted_address: 'Søndre gate 27',
      geometry: {location: {lat: 63.4343469, lng: 10.4004243}},
      place_id: 'ChIJ7X0oFJwxbUYR4h2FMXC0cKc',
      notes: 'Coffee bar, opens at 8:00'
    }
  ]);

  this.confMarkers = ko.observableArray([]);

  // Districts of Trondheim
  this.neighbourhoods = ko.observableArray([
    {name: 'Sentrum'},
    {name: 'Tyholt'},
    {name: 'Byåsen'},
    {name: 'Trolla'},
    {name: 'Ila'},
    {name: 'Møllenberg'},
    {name: 'Nedre Elvehavn'},
    {name: 'Lade'},
    {name: 'Strindheim'},
    {name: 'Jakobsli'},
    {name: 'Vikåsen'},
    {name: 'Ranheim'},
    {name: 'Lerkendal'},
    {name: 'Nardo'},
    {name: 'Flatåsen'},
    {name: 'Moholt'},
    {name: 'Heimdal'},
    {name: 'Byneset'},
    {name: 'Tiller'},
    {name: 'Kolstad'},
    {name: 'Saupstad'},
    {name: 'Kattem'}
  ]);

  this.favourites = ko.observableArray([
  ]);

  this.openLeftPanel = function() {
    var panel = $('#left-panel');
    panel.animate({left: '0'});
    panel.on('swipeleft', function() {
      panel.animate({left: '-300px'});
    });
    $('#map').click(function() {
      panel.animate({left: '-300px'});
    });
  };

  this.openRightPanel = function() {
    var panel = $('#right-panel');
    panel.animate({right: '0'});
    panel.on('swiperight', function() {
      panel.animate({right: '-300px'});
    });
    $('#map').click(function() {
      panel.animate({right: '-300px'});
    });
  };
};

var myViewModel = new ViewModel();
ko.applyBindings(myViewModel);
