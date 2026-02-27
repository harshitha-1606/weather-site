const apiKey = "YOUR_API_KEY_HERE";

async function getWeather(city) {
    const resultDiv = document.getElementById("result");
    const forecastDiv = document.getElementById("forecast");

    if (!city) {
        resultDiv.innerHTML = "<p class='error'>Please enter a city name</p>";
        return;
    }

    resultDiv.innerHTML = "<p>Loading...</p>";
    forecastDiv.innerHTML = "";

    try {
        // Current Weather
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const weatherResponse = await fetch(weatherURL);
        const weatherData = await weatherResponse.json();

        if (weatherData.cod !== 200) {
            resultDiv.innerHTML = "<p class='error'>City not found!</p>";
            return;
        }

        resultDiv.innerHTML = `
            <h3>${weatherData.name}</h3>
            <p>🌡 Temperature: ${weatherData.main.temp} °C</p>
            <p>☁ Condition: ${weatherData.weather[0].description}</p>
            <p>💧 Humidity: ${weatherData.main.humidity}%</p>
            <p>🌬 Wind Speed: ${weatherData.wind.speed} m/s</p>
        `;

        localStorage.setItem("lastCity", city);

        // 5 Day Forecast
        const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
        const forecastResponse = await fetch(forecastURL);
        const forecastData = await forecastResponse.json();

        displayForecast(forecastData);

    } catch (error) {
        resultDiv.innerHTML = "<p class='error'>Something went wrong!</p>";
    }
}

function displayForecast(data) {
    const forecastDiv = document.getElementById("forecast");
    forecastDiv.innerHTML = "";

    const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));

    dailyData.slice(0, 5).forEach(day => {
        const date = new Date(day.dt_txt).toLocaleDateString();

        forecastDiv.innerHTML += `
            <div class="forecast-card">
                <strong>${date}</strong>
                <p>${day.main.temp} °C</p>
                <p>${day.weather[0].main}</p>
            </div>
        `;
    });
}

function searchCity() {
    const city = document.getElementById("city").value;
    getWeather(city);
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const geoURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
            const response = await fetch(geoURL);
            const data = await response.json();

            getWeather(data.name);
        });
    } else {
        alert("Geolocation not supported.");
    }
}

// Enter key support
document.getElementById("city").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        searchCity();
    }
});

// Load last searched city
window.onload = function() {
    const savedCity = localStorage.getItem("lastCity");
    if (savedCity) {
        document.getElementById("city").value = savedCity;
        getWeather(savedCity);
    }
};
