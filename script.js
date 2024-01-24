// Kuuntelija hakupainikkeelle
document.getElementById('search-button').addEventListener('click', function() {
    const city = document.getElementById('city-input').value;
    fetchWeatherData(city);
});

// Funktio hakee säädatan API:sta
function fetchWeatherData(city) {
    const apiKey = '6d7af184bdc191fcc0635ee39590a743';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=fi`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Säätietoja ei löytynyt.");
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            updateWeatherDetails(data);
        })
        .catch(error => {
            console.error("Virhe haettaessa säätietoja: ", error);
        });
}

// Päivitetään sivun elementteihin saatu säädata
function updateWeatherDetails(data) {
    document.getElementById('city').textContent = data.name;
    document.getElementById('temp').textContent = data.main.temp + ' °C';
    document.getElementById('humidity').textContent = data.main.humidity + ' %';
    document.getElementById('wind').textContent = data.wind.speed + ' km/h';

    // Haetaan sääkuva datasta ja luodaan polku kuvalle
    const weatherIcon = getWeatherIcon(data.weather[0].main);
    document.getElementById('weather-icon').src = `images/${weatherIcon}.png`;
}

// Palauttaa sään kuvan annetujen tietojen perusteella
function getWeatherIcon(weather) {
    switch (weather) {
        case 'Clear':
            return 'clear';
        case 'Clouds':
            return 'clouds';
        case 'Rain':
            return 'rain';
        case 'Drizzle':
            return 'drizzle';
        case 'Snow':
            return 'snow';
        case 'Thunderstorm':
            return 'thunderstorm';
        case 'Mist':
            return 'mist';
    }
}
