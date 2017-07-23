function ViewModel() {
  // Places for the initial array of markers; id's are found via Places TextSearch
  this.confPlaces = ko.observableArray([
    { // Clarion Hotel & Congress
      id: 'c02a8745e79d45cfd0484de5b3d2b4d32b1e18f4'
    },
    { // Central station
      id: 'dcccefe7fdb0c1758f003d1ef51c2040f3fe9680'
    },
    { // Bus station
      id: '3fa15060ef030bebfc263d331553c50c1c50b690'
    },
    // Places that open before 9 AM
    { // Godt Brød bakery
      id: 'dead2f8867d2721d9a8f2cf7050898c75f441698'
    },
    { // Starbucks
      id: '35228c93e7034512e871c46187405e86b8940403'
    },
    { // Baker'n på torget (Rosenborg bakeri)
      // id: '4448436d61107f2635e1ab37913b85a466af871c'
      id: 'ChIJpSsF-ZoxbUYRQOG9Ddb_7VE'
    },
    { // Café le Frère
      id: 'c95907fc45e9b960e43572739e8bcd560aa4e199'
    }
  ]);

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
};

ko.applyBindings(new ViewModel());
