// API Configuration
const API_KEY = "d532571a58b3e1ad801a0bab51fd747e";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// DOM Elements
const locationInput = document.getElementById('location-input');
const searchBtn = document.getElementById('search-btn');
const loadingElement = document.getElementById('loading');
const weatherCard = document.getElementById('weather-card');
const errorMessage = document.getElementById('error-message');
const retryBtn = document.getElementById('retry-btn');

// Weather display elements
const cityName = document.getElementById('city-name');
const currentDate = document.getElementById('current-date');
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.getElementById('temperature');
const weatherDesc = document.getElementById('weather-description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const clouds = document.getElementById('clouds');
const pressure = document.getElementById('pressure');

// Event Listeners
searchBtn.addEventListener('click', fetchWeather);
retryBtn.addEventListener('click', fetchWeather);
locationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') fetchWeather();
});

// Initialize with current date
updateCurrentDate();

// Main function to fetch weather
async function fetchWeather() {
    const location = locationInput.value.trim();
    
    if (!location) {
        showError("Please enter a city name");
        return;
    }
    
    try {
        // Show loading, hide other elements
        loadingElement.style.display = 'block';
        weatherCard.style.display = 'none';
        errorMessage.style.display = 'none';
        
        // Fetch weather data
        const weatherData = await fetchWeatherData(location);
        
        // Process and display data
        displayWeatherData(weatherData);
        
        // Show weather card
        weatherCard.style.display = 'block';
    } catch (error) {
        showError(error.message);
    } finally {
        loadingElement.style.display = 'none';
    }
}

// API call function
async function fetchWeatherData(location) {
    const response = await fetch(`${BASE_URL}?q=${location}&appid=${API_KEY}&units=metric`);
    
    if (!response.ok) {
        throw new Error("City not found. Please try another location.");
    }
    
    return await response.json();
}

// Display weather data
function displayWeatherData(data) {
    // Update basic info
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDesc.textContent = data.weather[0].description;
    humidity.textContent = data.main.humidity;
    windSpeed.textContent = data.wind.speed;
    clouds.textContent = data.clouds.all;
    pressure.textContent = data.main.pressure;
    
    // Update weather icon
    updateWeatherIcon(data.weather[0].icon, data.weather[0].main);
    
    // Update current date
    updateCurrentDate();
}

// Update weather icon based on condition
function updateWeatherIcon(iconCode, mainWeather) {
    const iconMap = {
        '01d': 'fas fa-sun',         // clear sky (day)
        '01n': 'fas fa-moon',        // clear sky (night)
        '02d': 'fas fa-cloud-sun',   // few clouds (day)
        '02n': 'fas fa-cloud-moon',  // few clouds (night)
        '03d': 'fas fa-cloud',       // scattered clouds
        '03n': 'fas fa-cloud',
        '04d': 'fas fa-cloud',       // broken clouds
        '04n': 'fas fa-cloud',
        '09d': 'fas fa-cloud-rain',  // shower rain
        '09n': 'fas fa-cloud-rain',
        '10d': 'fas fa-cloud-sun-rain', // rain (day)
        '10n': 'fas fa-cloud-moon-rain', // rain (night)
        '11d': 'fas fa-bolt',        // thunderstorm
        '11n': 'fas fa-bolt',
        '13d': 'fas fa-snowflake',   // snow
        '13n': 'fas fa-snowflake',
        '50d': 'fas fa-smog',       // mist
        '50n': 'fas fa-smog'
    };
    
    const iconClass = iconMap[iconCode] || 'fas fa-question';
    weatherIcon.innerHTML = `<i class="${iconClass}"></i>`;
}

// Update current date display
function updateCurrentDate() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    currentDate.textContent = now.toLocaleDateString('en-US', options);
}

// Show error message
function showError(message) {
    errorMessage.querySelector('p').textContent = message;
    errorMessage.style.display = 'block';
    weatherCard.style.display = 'none';
    loadingElement.style.display = 'none';
}