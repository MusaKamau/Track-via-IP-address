'use strict';

// Importing the API_KEY from 'config.js'
import API_KEY from './config.js';

// Selecting HTML elements for future use
const ipAddressField = document.querySelector('.ipAddressField');
const timezoneInput = document.querySelector('.timezoneInput');
const countryLocationInput = document.querySelector('.locationInput');
const ispInput = document.querySelector('.ispInput');
const submitBtn = document.querySelector('.submit-btn');
const inputField = document.querySelector('.input-field');

// Initializing the Map
let map = L.map('map').setView([51.505, -0.09], 13);

// Adding OpenStreetMap tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Variables to store API response data
let ipAddress;
let randomIP = '';
let timeZone;
let countryLocation;
let cityLocation;
let postalCode;
let isp;
let lat;
let lng;

// Fetching IP geolocation data
let url = `https://api.ipgeolocation.io/ipgeo?apiKey=${API_KEY}=`;
fetch(url)
  .then((response) => response.json())
  .then((response) => {
    // Extracting data from the response
    ipAddress = response.ip;
    timeZone = response.time_zone.offset;
    countryLocation = response.country_name;
    cityLocation = response.city;
    postalCode = response.zipcode;
    isp = response.isp;
    lat = response.latitude;
    lng = response.longitude;

    // Updating HTML elements with fetched data
    ipAddressField.textContent = ipAddress;
    timezoneInput.textContent = ` UTC ${timeZone}`;
    countryLocationInput.textContent = `${countryLocation}, ${cityLocation} ${postalCode}`;
    ispInput.textContent = isp;

    // Displaying the location on the map
    mapLocation(lat, lng);
  })
  .catch((error) => console.log(error));

// Function to display location on the map
const mapLocation = (latitude, longitude) => {
  // Creating a custom marker icon
  var markerIcon = L.icon({
    iconUrl: 'images/icon-location.svg',
    iconSize: [46, 56],
    iconAnchor: [23, 55],
  });

  // Setting the map view and adding the tile layer
  map.setView([latitude, longitude], 17);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: false,
  }).addTo(map);

  // Adding a marker to the map
  L.marker([latitude, longitude], { icon: markerIcon }).addTo(map);
};

// Event listener for IP search and validation
submitBtn.addEventListener('click', (event) => {
  event.preventDefault();

  // Regular expression to validate the entered IP address
  const ipPattern =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  if (inputField.value.match(ipPattern)) {
    // Valid IP address entered by the user
    randomIP = inputField.value;
    url = `https://api.ipgeolocation.io/ipgeo?apiKey=${API_KEY}=${randomIP}`;

    // Fetching data for the searched IP address
    fetch(url)
      .then((response) => response.json())
      .then((response) => {
        // Extracting data from the response
        ipAddress = response.ip;
        timeZone = response.time_zone.offset;
        countryLocation = response.country_name;
        cityLocation = response.city;
        postalCode = response.zipcode;
        isp = response.isp;
        lat = response.latitude;
        lng = response.longitude;

        // Updating HTML elements with fetched data
        ipAddressField.textContent = ipAddress;
        timezoneInput.textContent = ` UTC ${timeZone}`;
        countryLocationInput.textContent = `${countryLocation}, ${cityLocation} ${postalCode}`;
        ispInput.textContent = isp;

        // Displaying the location on the map
        mapLocation(lat, lng);
      })
      .catch((error) => console.log(error));
  } else {
    // Invalid IP address entered
    alert('You have entered an invalid IP address!');
  }
});
