// ========================================
// GET HTML ELEMENTS
// ========================================

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const countryName = document.getElementById("countryName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const weatherIcon = document.getElementById("weatherIcon");

const loading = document.getElementById("loading");
const error = document.getElementById("error");


// ========================================
// BUTTON CLICK
// ========================================

searchBtn.addEventListener("click", getWeather);


// ========================================
// ENTER KEY
// ========================================

cityInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        getWeather();
    }

});


// ========================================
// MAIN WEATHER FUNCTION
// ========================================

async function getWeather() {

    const city = cityInput.value.trim();

    // Don't search if input is empty
    if (city === "") {

        showError("Please enter a city name.");

        return;
    }


    // Show loading
    loading.style.display = "block";
    error.style.display = "none";

    try {

        // ========================================
        // STEP 1: FIND CITY
        // ========================================

        const locationURL =
            "https://geocoding-api.open-meteo.com/v1/search" +
            "?name=" + encodeURIComponent(city) +
            "&count=1" +
            "&language=en" +
            "&format=json";


        console.log("Searching city:", city);


        const locationResponse = await fetch(locationURL);


        // Check if request failed
        if (!locationResponse.ok) {

            throw new Error(
                "Could not connect to location service."
            );

        }


        const locationData = await locationResponse.json();


        console.log("Location data:", locationData);


        // Check if city exists
        if (
            !locationData.results ||
            locationData.results.length === 0
        ) {

            throw new Error(
                "City not found. Try another city."
            );

        }


        // Get first city result
        const location = locationData.results[0];


        const latitude = location.latitude;
        const longitude = location.longitude;


        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);


        // ========================================
        // STEP 2: GET WEATHER
        // ========================================

        const weatherURL =
            "https://api.open-meteo.com/v1/forecast" +
            "?latitude=" + latitude +
            "&longitude=" + longitude +
            "&current=" +
            "temperature_2m," +
            "relative_humidity_2m," +
            "weather_code," +
            "wind_speed_10m" +
            "&timezone=auto";


        console.log("Weather URL:", weatherURL);


        const weatherResponse = await fetch(weatherURL);


        if (!weatherResponse.ok) {

            throw new Error(
                "Could not get weather data."
            );

        }


        const weatherData = await weatherResponse.json();


        console.log("Weather data:", weatherData);


        // ========================================
        // STEP 3: GET CURRENT WEATHER
        // ========================================

        const current = weatherData.current;


        // ========================================
        // STEP 4: DISPLAY DATA
        // ========================================

        cityName.textContent = location.name;


        countryName.textContent =
            location.country || "";


        temperature.textContent =
            Math.round(current.temperature_2m) + "°C";


        humidity.textContent =
            current.relative_humidity_2m + "%";


        wind.textContent =
            current.wind_speed_10m + " km/h";


        condition.textContent =
            getWeatherCondition(current.weather_code);


        weatherIcon.textContent =
            getWeatherIcon(current.weather_code);


        // Hide error
        error.style.display = "none";


    } catch (err) {

        console.error("ERROR:", err);

        showError(err.message);

    } finally {

        // Hide loading
        loading.style.display = "none";

    }

}


// ========================================
// WEATHER CONDITION
// ========================================

function getWeatherCondition(code) {

    if (code === 0) {
        return "Clear Sky";
    }

    if (code === 1) {
        return "Mainly Clear";
    }

    if (code === 2) {
        return "Partly Cloudy";
    }

    if (code === 3) {
        return "Overcast";
    }

    if (code === 45 || code === 48) {
        return "Foggy";
    }

    if (code >= 51 && code <= 55) {
        return "Drizzle";
    }

    if (code >= 56 && code <= 57) {
        return "Freezing Drizzle";
    }

    if (code >= 61 && code <= 65) {
        return "Rainy";
    }

    if (code >= 66 && code <= 67) {
        return "Freezing Rain";
    }

    if (code >= 71 && code <= 77) {
        return "Snowy";
    }

    if (code >= 80 && code <= 82) {
        return "Rain Showers";
    }

    if (code === 85 || code === 86) {
        return "Snow Showers";
    }

    if (code >= 95) {
        return "Thunderstorm";
    }

    return "Unknown Weather";
}


// ========================================
// WEATHER ICON
// ========================================

function getWeatherIcon(code) {

    if (code === 0) {
        return "☀️";
    }

    if (code === 1) {
        return "🌤️";
    }

    if (code === 2) {
        return "⛅";
    }

    if (code === 3) {
        return "☁️";
    }

    if (code === 45 || code === 48) {
        return "🌫️";
    }

    if (code >= 51 && code <= 67) {
        return "🌧️";
    }

    if (code >= 71 && code <= 77) {
        return "❄️";
    }

    if (code >= 80 && code <= 82) {
        return "🌦️";
    }

    if (code === 85 || code === 86) {
        return "🌨️";
    }

    if (code >= 95) {
        return "⛈️";
    }

    return "🌤️";
}


// ========================================
// SHOW ERROR
// ========================================

function showError(message) {

    error.textContent = message;

    error.style.display = "block";

    loading.style.display = "none";

}


// ========================================
// INITIAL WEATHER
// ========================================

getWeatherForDefaultCity("Kanpur");


// ========================================
// DEFAULT CITY
// ========================================

async function getWeatherForDefaultCity(city) {

    cityInput.value = city;

    await getWeather();

}
