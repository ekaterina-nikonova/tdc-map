function ViewModel() {
  var self = this;

  this.mapLoaded = ko.observable(true);
  this.mapError = function() {
    self.mapLoaded(false);
    return 'Couldn\'t load the map. Try to reload the page. Alternatively, you can also use maps.google.com or Maps app.';
  };

  this.clearMap = function() {
    self.markersOnMap().forEach(function(marker) {
      marker.setMap(null);
      marker.onMap(false);
    });
    self.markersOnMap.removeAll();
    self.dirInstructions.removeAll();
    self.dirInstructionsHeader('');
    self.dirInstructionsFrom('');
    self.dirInstructionsTo('');
  };

  // For the markers list in the right side panel
  this.markersOnMap = ko.observableArray([]);

  this.leftPanelStyle = ko.observable('-300px');
  this.rightPanelStyle = ko.observable('-300px');

  // Filter the list
  this.snippet = ko.observable('');
  ko.bindingHandlers.snippetChange = {
    update: function() {
      var snippet = self.snippet();
      self.leaveIfContains(snippet);
    }
  };

  this.leaveIfContains = function(snippet) {
    this.markersOnMap().forEach(function(marker) {
      if (!marker.placeOnMap.name.toLowerCase().includes(snippet.toLowerCase())) {
        marker.setVisible(false);
        marker.onMap(false);
      } else {
        marker.setVisible(true);
        marker.onMap(true);
      }
    });
  };

  // Fetch weather forecast
  this.forecasts = ko.observableArray([]);
  this.forecast = {date: ko.observable(), icon: ko.observable(), conditions: ko.observable(), temperature: ko.observable(), wind: ko.observable()};
  this.forecastCreditText = ko.observable('Loading weather forecast…');
  this.forecastCreditURL = ko.observable();
  this.forecastHeader = ko.observable();
  this.forecastDisplay = ko.observable('flex');
  this.nextForecast = '';
  this.prevForecast = '';
  this.resetForecast = '';

  this.forecastFallback = function(request, reason) {
    self.forecastDisplay('none');
    self.forecasts([]);
    self.forecast.date('');
    self.forecast.icon('');
    self.forecast.conditions('');
    self.forecast.temperature('');
    self.forecast.wind('');
    self.forecastHeader('');
    self.forecastCreditText(reason + ' Find weather forecast' +
      (request.locality || request.country ? ' for ' + request.locality : '')  +
      (request.locality && request.country ? ', ' : '') +
      (request.country ? request.country : '') +
      ' on Yr.no');
    self.forecastCreditURL(request.url);
  };

  this.buildForecast = function(request) {
    $.ajax({
      // Avoiding CORS error, see: https://stackoverflow.com/questions/44553816/cross-origin-resource-sharing-when-you-dont-control-the-server
      url: 'https://cors-anywhere.herokuapp.com/' + request
    }).done(function(result) {
      self.forecasts([]);
      // Here and below, JavaScript methods are used for parsing the XML file, not for manipulating DOM elements. Please note that in the forecast file we receive, the data is stored in attributes, for instance:
        /*
        <time from="2017-09-04T18:00:00" to="2017-09-05T00:00:00" period="3">
        <symbol number="3" numberEx="3" name="Partly cloudy" var="03n"/>
        <precipitation value="0"/>
        <windDirection deg="155.4" code="SSE" name="South-southeast"/>
        <windSpeed mps="4.3" name="Gentle breeze"/>
        <temperature unit="celsius" value="18"/>
        <pressure unit="hPa" value="1018.2"/>
        </time>
        */
      var forecasts = $.makeArray(result.getElementsByTagName('forecast')[0].getElementsByTagName('tabular')[0].getElementsByTagName('time'));
      self.forecastCreditText(result.getElementsByTagName('credit')[0].getElementsByTagName('link')[0].getAttribute('text'));
      self.forecastCreditURL(result.getElementsByTagName('credit')[0].getElementsByTagName('link')[0].getAttribute('url'));
      self.forecastHeader('Weather in ' + result.getElementsByTagName('location')[0].getElementsByTagName('name')[0].childNodes[0].nodeValue);
      forecasts.forEach(function(forecast) {
        // console.log(forecast); // Uncomment this line to see the structure of each forecast or open the link https://www.yr.no/place/Norway/postnummer/7010/forecast.xml to see the whole XML file.
        var months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var time,
          fc = {};
        switch (forecast.getAttribute('period')) {
          case '0':
          time = 'night';
          break;
          case '1':
          time = 'morning';
          break;
          case '2':
          time = 'day';
          break;
          case '3':
          time = 'evening';
          break;
          default:
          time = 'all day';
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
        self.forecastDisplay('flex');
        self.forecast.date(self.forecasts()[fcNum].date);
        self.forecast.icon(self.forecasts()[fcNum].icon);
        self.forecast.conditions(self.forecasts()[fcNum].conditions);
        self.forecast.temperature(self.forecasts()[fcNum].temperature);
        self.forecast.wind(self.forecasts()[fcNum].wind);
      }
      appendForecast(fcNum);

      // Next/previous forecast, reset
      self.nextForecast = function() {
        if (fcNum < self.forecasts().length - 1) {
          fcNum++;
          appendForecast(fcNum);
        }
      };

      self.prevForecast = function() {
        if (fcNum > 0) {
          fcNum--;
          appendForecast(fcNum);
        }
      };

      self.resetForecast = function() {
        fcNum = 0;
        appendForecast(fcNum);
      };
    }).fail(function() {
      self.forecastFallback({url: 'https://www.yr.no'}, 'Couldn\'t fetch weather data.');
    });
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
    $('#contact-me').popup('close'); // This is a jQuery method, requires a jQuery object
  };
  this.sendMsg = function() {
    try {
      database.ref('messages/' + Date.now()).set({
        name: self.contactName(),
        email: self.contactEmail(),
        subject: self.contactSubj(),
        message: self.contactMsg()
      }).then(function() {
        alert('Message sent.');
        self.clearMsg();
      }).catch(function(error) {
        alert('Failed to send.');
        console.log('Failed to send message: ' + error);
      });
    } catch (error) {
      self.noFirebasePopup();
      console.log(error);
    }
  };

  // Sign-in indicator
  this.signinStatus = ko.observable('Not signed in. Messages will not be sent.');
  this.noSignInPopup = function() {
    alert('Sign-in failed.');
  };

  // Firebase error alert
  this.noFirebasePopup = function() {
    alert('Database error.');
  };
}
var myViewModel = new ViewModel();
ko.applyBindings(myViewModel);

myViewModel.buildForecast('https://www.yr.no/place/Norway/postnummer/7010/forecast.xml');
