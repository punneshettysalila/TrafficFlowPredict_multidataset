const weatherApiKey = "19a46388abe076aa515e8cbc7ea04ad9"; // Replace with your key
const citySelector = document.getElementById('citySelector');
const weatherInfo = document.getElementById('weatherInfo');

function fetchWeather(city) {
    if (!weatherApiKey || weatherApiKey === "19a46388abe076aa515e8cbc7ea04ad9") {
        weatherInfo.innerHTML = `<p style="color:#ff6b6b;">Please add your OpenWeatherMap API key</p>`;
        return;
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherApiKey}`)
        .then(res => res.json())
        .then(data => {
            if (data.cod === 200) {
                weatherInfo.innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: center; gap: 1rem;">
                        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].main}" />
                        <div>
                            <h3>${data.name}, ${data.sys.country}</h3>
                            <p>${data.weather[0].main} - ${Math.round(data.main.temp)}°C</p>
                            <p>Humidity: ${data.main.humidity}% | Wind: ${data.wind.speed} m/s</p>
                        </div>
                    </div>
                `;
            } else {
                weatherInfo.innerHTML = `<p style="color:#ff6b6b;">Weather data unavailable</p>`;
            }
        })
        .catch(() => {
            weatherInfo.innerHTML = `<p style="color:#ff6b6b;">Weather service unavailable</p>`;
        });
}

if (citySelector && weatherInfo) {
    fetchWeather(citySelector.value);
    citySelector.addEventListener('change', e => fetchWeather(e.target.value));
}
