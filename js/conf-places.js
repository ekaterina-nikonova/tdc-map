// Places for the initial array of markers
var confPlaces = [
  { // Clarion Hotel & Congress
    name: 'Clarion Hotel & Congress',
    types: ['venue'],
    formatted_address: 'Brattørkaia 1, 7010 Trondheim, Norway',
    geometry: {location: {lat: 63.4400274, lng: 10.4024274}},
    place_id: 'ChIJq3jrGHYxbUYRWCokKUAb-00',
    notes: 'The Conference venue: Monday 30 October at 9:00–18:00'
  },
  { // Central station
    name: 'Trondheim Sentralstasjon',
    types: ['train_station'],
    formatted_address: 'Fosenkaia 1, 7010 Trondheim',
    geometry: {location: {lat: 63.4367, lng: 10.3988199}},
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
    geometry: {location: {lat: 63.4306006, lng: 10.3970648}},
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
  },
  // Additional places for testing the weather widget
  {
    name: 'University of Oslo',
    types: ['University'],
    formatted_address: 'Problemveien 7, 0315 Oslo, Norway',
    geometry: {location: {lat: 59.9399586, lng: 10.7217496}},
    place_id: 'ChIJU3nLiuZtQUYRXdev6k3jcNw',
    notes: 'Offers a number of studies in artificial intelligence and machine learning'
  },
  {
    name: 'Norwegian University of Science and Technology',
    types: ['University'],
    formatted_address: 'Høgskoleringen 1, 7491 Trondheim, Norway',
    geometry: {location: {lat: 63.419499, lng: 10.4020771}},
    place_id: 'ChIJf5PA2L8xbUYRi5eBohzp_bQ',
    notes: 'Studies in AI and a joint research lab'
  },
  {
    name: 'University of Agder',
    types: ['University'],
    formatted_address: 'Campus Kristiansand, Gimlemoen 25, 4630 Kristiansand S, Norway',
    geometry: {location: {lat: 58.163832, lng: 8.002964}},
    place_id: 'ChIJk6yVhVMCOEYRUuJGJ6kuGO8',
    notes: 'A master in ICT with specialisation in artificial intelligence with CAIR, an Artificial Intelligence Research Centre'
  },
  {
    name: 'Linköping University',
    types: ['University'],
    formatted_address: '581 83 Linköping, Sweden',
    geometry: {location: {lat: 58.3978364, lng: 15.5760072}},
    place_id: 'ChIJ71hGHCFAWUYRiBNbwVaMX3Q',
    notes: 'AI research programmes, Swedish AI Society'
  },
  {
    name: 'Dansk.ai: Danish Centre for Applied Artificial Intelligence',
    types: ['Research centre'],
    formatted_address: 'Bygning 10-16, Karen Blixens Vej 4, 2300 København S, Denmark',
    geometry: {location: {lat: 55.6628483, lng: 12.5893772}},
    place_id: 'ChIJw3DHOkRTUkYR--hiy8uL7xY',
    notes: 'AI lab, part of the Alexandra Institute'
  }
];
