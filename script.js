const apiKey = "YOUR_API_KEY";

async function getWeather(city) {
    const errorMsg = document.getElementById("errorMsg");
    const weatherBox = document.getElementById("weatherBox");

    errorMsg.innerText = "";
    weatherBox.classList.add("hidden");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        const data = await response.json();

        if (data.cod != 200) {
            errorMsg.innerText = data.message;
            return;
        }

        document.getElementById("cityName").innerText = data.name;
        document.getElementById("temperature").innerText = data.main.temp + "°C";
        document.getElementById("condition").innerText = data.weather[0].main;
        document.getElementById("extra").innerText =
            "Humidity: " + data.main.humidity + "% | Wind: " + data.wind.speed + " m/s";

        const iconCode = data.weather[0].icon;
        document.getElementById("weatherIcon").src =
            `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        weatherBox.classList.remove("hidden");

    } catch (error) {
        errorMsg.innerText = "Something went wrong!";
    }
}

function searchCity() {
    const city = document.getElementById("city").value.trim();
    if (city) {
        getWeather(city);
    }
}

document.getElementById("city").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        searchCity();
    }
});
