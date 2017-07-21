function ViewModel() {
  this.confPlaces = ko.observableArray([
  ]);

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
