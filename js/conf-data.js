function ViewModel() {
  var self = this;
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
      name: 'Trondheim Sentralstasjon',
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
    { // Café le Frère
      name: 'Café le Frère',
      types: ['Cafe'],
      formatted_address: 'Søndre gate 27',
      geometry: {location: {lat: 63.4343469, lng: 10.4004243}},
      place_id: 'ChIJ7X0oFJwxbUYR4h2FMXC0cKc',
      notes: 'Coffee bar, opens at 8:00'
    },
    { // Big Bite
      name: 'Big Bite',
      types: ['Restaurant'],
      formatted_address: 'Nordre gate 11',
      geometry: {location: {lat: 63.432715, lng: 10.397460}},
      place_id: 'ChIJXemij5sxbUYRxhSYKU_x5OE',
      notes: 'Opens at 7:30'
    }
  ]);

  this.markersOnMap = ko.observableArray([]); // Tracking for right panel list
  this.markersOnMapIds = ko.observableArray([]);

  this.favourites = ko.observableArray([]); // Favourite places
  this.favIds = ko.observableArray([]); // IDs of favourite places

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

  this.snippet = ko.observable(); // Input field in the right panel

  // Filter the list
  this.leaveIfContains = function() {
    this.markersOnMap().forEach(function(marker) {
      if (!marker.placeOnMap.name.toLowerCase().includes(self.snippet().toLowerCase())) {
        marker.setMap(null);
        marker.onMap(false);
      } else {
        marker.setMap(map);
        marker.onMap(true);
      }
    });
  };

  // Fetch weather forecast
  this.forecasts = ko.observableArray([]);
  this.forecast = {date: ko.observable(), icon: ko.observable(), conditions: ko.observable(), temperature: ko.observable(), wind: ko.observable()};
  this.forecastCreditText = ko.observable();
  this.forecastCreditURL = ko.observable();
  this.forecastHeader = ko.observable();
  this.buildForecast = function() {
    $.ajax({
      // Avoiding CORS error, see: https://stackoverflow.com/questions/44553816/cross-origin-resource-sharing-when-you-dont-control-the-server
      url: 'https://cors-anywhere.herokuapp.com/https://www.yr.no/place/Norway/S%C3%B8r-Tr%C3%B8ndelag/Trondheim/Trondheim/forecast.xml'
    }).done(function(result) {
      var forecasts = $.makeArray(result.getElementsByTagName('forecast')[0].getElementsByTagName('tabular')[0].getElementsByTagName('time'));
      self.forecastCreditText(result.getElementsByTagName('credit')[0].getElementsByTagName('link')[0].getAttribute('text'));
      self.forecastCreditURL(result.getElementsByTagName('credit')[0].getElementsByTagName('link')[0].getAttribute('url'));
      self.forecastHeader('Weather in ' + result.getElementsByTagName('location')[0].getElementsByTagName('name')[0].childNodes[0].nodeValue);
      forecasts.forEach(function(forecast) {
        // console.log(forecast); // Uncomment this line to see the structure of each forecast or open the link https://www.yr.no/place/Norway/S%C3%B8r-Tr%C3%B8ndelag/Trondheim/Trondheim/forecast.xml to see the whole XML file.
        var months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var fc = {};
        switch (forecast.getAttribute('period')) {
          case '0':
          var time = 'night';
          break;
          case '1':
          var time = 'morning';
          break;
          case '2':
          var time = 'day';
          break;
          case '3':
          var time = 'evening';
          break;
          default:
          var time = 'all day';
        }
        fc.date = forecast.getAttribute('from').split('T')[0].split('-')[2] +
          ' ' + months[parseInt(forecast.getAttribute('from').split('T')[0].split('-')[1], 10)] + ', ' + time;
        fc.icon = 'img\/yr-icons\/' + forecast.getElementsByTagName('symbol')[0].getAttribute('var') + '.svg';
        fc.conditions = forecast.getElementsByTagName('symbol')[0].getAttribute('name');
        fc.temperature = forecast.getElementsByTagName('temperature')[0].getAttribute('value') +
        '° C';
        var windMPS = parseInt(forecast.getElementsByTagName('windSpeed')[0].getAttribute('mps'), 10);
        fc.wind = forecast.getElementsByTagName('windSpeed')[0].getAttribute('name') +
        ((windMPS >= 0.3) ? (' from ' + forecast.getElementsByTagName('windDirection')[0].getAttribute('name')) : '');
        self.forecasts.push(fc);
      });
      // Updating values for a single forecast
      var fcNum = 0;
      function appendForecast(num) {
        $('.forecast-nav-icons').css('display', 'inline-block');
        self.forecast.date(self.forecasts()[fcNum].date);
        self.forecast.icon(self.forecasts()[fcNum].icon);
        self.forecast.conditions(self.forecasts()[fcNum].conditions);
        self.forecast.temperature(self.forecasts()[fcNum].temperature);
        self.forecast.wind(self.forecasts()[fcNum].wind);
      }
      appendForecast(fcNum);
      $('.forecast-section').css('display', 'block');

      // Next/previous forecast, reset
      $('.arrow-next').click(function() {
        if (fcNum < self.forecasts().length - 1) {
          fcNum++;
          appendForecast(fcNum);
        }
      });

      $('.arrow-prev').click(function() {
        if (fcNum > 0) {
          fcNum--;
          appendForecast(fcNum);
        }
      });

      $('.refresh-icon').click(function() {
        fcNum = 0;
        appendForecast(fcNum);
      });
    }); // No need to fail(): the forecast won't appear if the request fails
  };

  // Showing directions step-by-step in the right panel
  this.dirInstructionsHeader = ko.observable();
  this.dirInstructionsFrom = ko.observable();
  this.dirInstructionsTo = ko.observable();
  this.dirInstructions = ko.observableArray([]);

  // 'Contact me' form
  this.contactName = ko.observable('');
  this.contactEmail = ko.observable('');
  this.contactSubj = ko.observable('');
  this.contactMsg = ko.observable('');
  this.clearMsg = function() {
    self.contactName('');
    self.contactEmail('');
    self.contactSubj('');
    self.contactMsg('');
    $('#contact-me').popup('close');
  };
  this.sendMsg = function() {
    database.ref('messages/' + Date.now()).set({
      name: self.contactName(),
      email: self.contactEmail(),
      subject: self.contactSubj(),
      message: self.contactMsg()
    }).then(function() {
      $('#popup-msg-success').css('display', 'block');
      $('#popup-msg-success').css('opacity', 1);
      setTimeout(function() {
        $('#popup-msg-success').css('opacity', 0);
        $('#popup-msg-success').css('display', 'none');
      }, 2000);
      self.clearMsg();
    }).catch(function(error) {
      // Change the 'Send' button (popup can be covered by the form)
      $('.contact-send-btn').text('Error!');
      $('.contact-send-btn').removeClass('ui-icon-arrow-r');
      $('.contact-send-btn').addClass('ui-icon-alert');
      $('.contact-send-btn').css('background-color', 'rgba(255, 162, 155, 0.5)');
      setTimeout(function() {
        $('.contact-send-btn').text('Send');
        $('.contact-send-btn').removeClass('ui-icon-alert');
        $('.contact-send-btn').addClass('ui-icon-arrow-r');
        $('.contact-send-btn').css('background-color', '');
      }, 2000);
      console.log('Failed to send message: ' + error);
    });
  };

  // No favourites found
  this.noFavs = function() {
    $('#popup-no-favs').css('display', 'block');
    $('#popup-no-favs').css('opacity', 1);
    setTimeout(function() {
      $('#popup-no-favs').css('opacity', 0);
      $('#popup-no-favs').css('display', 'none');
    }, 2000);
  }
};

var myViewModel = new ViewModel();
ko.applyBindings(myViewModel);

myViewModel.snippet.subscribe(function() {
  myViewModel.leaveIfContains();
});

myViewModel.buildForecast();
