# Overview
This app provides information about places in Trondheim, Norway. The initial set of markers is made with the [Trondheim Developer Conference](https://2017.trondheimdc.no/) in mind. It can be used as a general purpose map app, but is still related to Trondheim (for example, the viewport will return to the city centre if no places are found.)

<!-- It is hosted on GitHub and is available at [ekaterina-nikonova.github.io/tdc-map/](https://ekaterina-nikonova.github.io/tdc-map/). -->

# Running the app on a local server with npm
1. With **NodeJS** and **npm** installed<sup>\*</sup>, install **http-server**.<sup>\*\*</sup>
2. In the **NodeJS command prompt**, run the server by typing `http-server [path]`, where _path_ is the path to the directory where you store the app's code (where the _index.html_ file is located).
3. Open the app in the browser by typing `localhost:8080` in the address bar.

<sup>\*</sup> Instructions on how to install **NodeJS** and **npm**, are available [here](https://www.npmjs.com/get-npm).

<sup>\*\*</sup> To install **http-server**, use the command `npm install http-server -g`. Detailed instructions are available [here](https://www.npmjs.com/package/http-server).

# Tools

The app is mostly based on Google Maps API, jQuery, KnockoutJS. The full list of tools and technologies can be found in the app description: open left side panel > **About > About the app**. Instructions for users are provided in **About > How to use**.

## Third-party APIs
The APIs used in the app are:
 - **Yr.no** - weather forecast in the left side panel.
 - **Facebook** - _Share_ and _Like_ buttons for the app in the left side panel.
 - **Facebook** - _Share_ and _Like_ buttons for places in the info window.

## Google Firebase
Google Firebase is used for receiving messages sent from the contact form (open left panel > **About > Contact me**). Sending messages does not require authentication.

Firebase is also used for storing the list of favourite places. Anonymous guest accounts are used for this, so that the user does not need to do anything to sign in.

# Udacity requirements

The marker list is located in the right side panel.

The marker's opacity changes when the marker or the corresponding list item in the right panel is clicked. To restore the opacity, click the map.

The initial locations are hard-coded in the _conf-data.js_ file. Using the Place Details service here seemed to be risky, because the _getDetails()_ method often returns the **query limit** error when used in a loop.

# Tips
 - To test the **Directions** feature in the info window, overriding geolocation in the browser can be useful. For example, with coordinates of the Trondheim central train station (63.436598, 10.398436), step-by-step instructions for walking or bicycling will not be overwhelming.

 - Please note that **My location** marker is a special one: it is not present in the list in the right panel, cannot be marked as favourite and is not affected by such actions as clearing the map, filtering or search.
