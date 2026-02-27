const apiKey = "YOUR_API_KEY_HERE";

async function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
        alert("City not found!");
        return;
    }

    document.getElementById("weatherBox").classList.remove("hidden");

    document.getElementById("cityName").innerText = data.name;
    document.getElementById("temperature").innerText = data.main.temp + "°C";
    document.getElementById("condition").innerText = data.weather[0].main;
    document.getElementById("extra").innerText =
        "Humidity: " + data.main.humidity + "% | Wind: " + data.wind.speed + " m/s";

    const iconCode = data.weather[0].icon;
    document.getElementById("weatherIcon").src =
        `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    changeBackground(data.weather[0].main);
}

function searchCity() {
    const city = document.getElementById("city").value;
    if (city) {
        getWeather(city);
    }
}

function changeBackground(condition) {
    if (condition.includes("Cloud")) {
        document.body.style.background = "linear-gradient(to right, #757F9A, #D7DDE8)";
    }
    else if (condition.includes("Rain")) {
        document.body.style.background = "linear-gradient(to right, #000046, #1CB5E0)";
    }
    else if (condition.includes("Clear")) {
        document.body.style.background = "linear-gradient(to right, #f7971e, #ffd200)";
    }
    else {
        document.body.style.background = "linear-gradient(to right, #4facfe, #00f2fe)";
    }
}

document.getElementById("city").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        searchCity();
    }
});
