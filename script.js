// OpenWeatherMap API Key
const WEATHER_API_KEY = '3c6aa129d7ef1458478bb217cc1e9a0b';

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = 'AIzaSyABHOJzsSs_F-Xh6M9zRlmZ07ugXEoZ9Tc'; 

// Event listener for the "Get Weather Data" button click
document.getElementById('getWeatherButton').addEventListener('click', fetchWeatherData);

/**
 * Fetches the user's current location using the Geolocation API.
 * Calls functions to display map, weather, and coordinates upon success.
 */
function fetchWeatherData() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(displayLocationData, handleGeolocationError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

/**
 * Handles success response from Geolocation API.
 * @param {Object} position - Geolocation coordinates (latitude, longitude)
 */
function displayLocationData(position) {
    // Extracting latitude and longitude from position
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Displaying latitude and longitude on the screen
    document.getElementById('latitudeButton').textContent = `Lat: ${latitude.toFixed(4)}`;
    document.getElementById('longitudeButton').textContent = `Long: ${longitude.toFixed(4)}`;

    // Displaying map with the given coordinates
    displayMap(latitude, longitude);

    // Fetching and displaying weather data based on coordinates
    fetchWeatherInfo(latitude, longitude);

    // Hiding the landing page and showing the weather section
    document.getElementById('landingPageSection').style.display = 'none';
    document.getElementById('weatherInfoSection').style.display = 'block';
}

/**
 * Handles Geolocation API errors and displays appropriate error messages.
 * @param {Object} error - Error object from Geolocation API
 */
function handleGeolocationError(error) {
    let errorMessage;
    switch(error.code) {
        case error.PERMISSION_DENIED:
            errorMessage = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            errorMessage = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            errorMessage = "An unknown error occurred.";
            break;
    }
    alert(errorMessage);
}

/**
 * Displays the map with a marker for the current location.
 * @param {number} latitude - User's latitude
 * @param {number} longitude - User's longitude
 */
function displayMap(latitude, longitude) {
    const mapDiv = document.getElementById('locationMap');
    
    // Embedding a Google Maps iframe to show the location
    mapDiv.innerHTML = `
        <iframe width="100%" height="300" frameborder="0" style="border:0" 
            src="https://www.google.com/maps/embed/v1/place?q=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}">
        </iframe>`;
}

/**
 * Fetches weather data from the OpenWeatherMap API based on user's location.
 * @param {number} latitude - User's latitude
 * @param {number} longitude - User's longitude
 */
async function fetchWeatherInfo(latitude, longitude) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`
        );
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const weatherData = await response.json();

        // Display the fetched weather data on the screen
        displayWeatherData(weatherData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Failed to fetch weather data. Please try again.');
    }
}

/**
 * Displays the weather information on the screen.
 * @param {Object} data - Weather data from the API
 */
function displayWeatherData(data) {
    const weatherDisplayDiv = document.getElementById('weatherDataDisplay');
    
    // Array of weather data items to be displayed
    const weatherDetails = [
        { label: 'Location:', value: data.name },
        { label: 'Wind Speed:', value: `${data.wind.speed} km/h` },
        { label: 'Humidity:', value: `${data.main.humidity}%` },
        { label: 'Pressure:', value: `${data.main.pressure} atm` },
        { label: 'Wind Direction:', value: `${data.wind.deg}°` },
        { label: 'Feels Like:', value: `${data.main.feels_like.toFixed(1)}°C` },
    ];

    // Generating the HTML for the weather data items and updating the DOM
    weatherDisplayDiv.innerHTML = weatherDetails.map(item => 
        `<div class="weather-item">
            <h4>${item.label}</h4>
            <p>${item.value}</p>
        </div>`
    ).join('');
}
