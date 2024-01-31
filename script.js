// Kuuntelija DOMille
document.addEventListener('DOMContentLoaded', function() {

    // Piilotetaan säätiedot
    document.querySelector('.paikka').style.display = 'none';
    document.querySelector('.weather').style.display = 'none';

    // Uusi kursori
    new kursor({
        type: 2,
        color: '#219fd1',
        removeDefaultCursor: true
    })
});

// Etsitään hakukenttä elementti
const cityInput = document.getElementById('city-input');

// Lisätään click-tapahtumakuuntelija hakukenttään
cityInput.addEventListener('click', function() {
    // Tyhjennetään hakukenttä kun se klikataan hiirellä aktiiviseksi
    this.value = '';
});

// Kuuntelija hakupainikkeelle
document.getElementById('search-button').addEventListener('click', function() {
    const city = document.getElementById('city-input').value;
    fetchWeatherData(city);
});

// Kuuntelija Enter-näppäimelle hakukentässä
document.getElementById('city-input').addEventListener('keypress', function(event) {
    // 13 = Enter-näppäin
   if (event.keyCode === 13) {
    // Suoritetaan haku annetuilla arvoilla
    fetchWeatherData(this.value);
   }
});

// Funktio hakee säädatan API:sta
function fetchWeatherData(city) {
    const apiKey = '6d7af184bdc191fcc0635ee39590a743';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=fi`;

        // Lisätään tarkistus, onko hakukenttä tyhjä
        if (city.trim() === '') {
            alert('Anna paikan nimi ennen haun suorittamista.');
            resetWeatherDetails();
            return;
        }

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
            alert('Säätietoja ei löytynyt. Tarkista paikan nimi ja yritä uudelleen.');
            resetWeatherDetails();

        // Tyhjennä hakukenttä virheilmoituksen jälkeen
            document.getElementById('city-input').value = '';
        });
}

function resetWeatherDetails() {
    document.querySelector('.paikka').style.display = 'none';
    document.querySelector('.weather').style.display = 'none';
}

// Päivitetään sivun elementteihin saatu säädata
function updateWeatherDetails(data) {
    document.getElementById('city').textContent = data.name;
    const temperature = Math.round(data.main.temp); // Pyöristetään lämpötila
    document.getElementById('temp').textContent = temperature + ' °C';
    document.getElementById('feels-like').textContent = '(Tuntuu kuin ' + Math.round(data.main.feels_like) + ' °C)';
    document.getElementById('humidity').textContent = data.main.humidity + ' %';
    document.getElementById('wind').textContent = data.wind.speed + ' km/h';

    // Haetaan leveys- ja pituusasteet APIsta
    const latitude = data.coord.lat;
    const longitude = data.coord.lon;
    // Luodaan linkki Google Mapsiin
    const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    // Haetaan coords-link HTML pohjasta
    const coordsLinkElement = document.getElementById('coords-link');
    // Asetetaan linkin href-attribuutti
    coordsLinkElement.href = googleMapsLink;
    // Asetetaan coordsLinkElementin tekstisisällöksi leveys- ja pituusasteet
    coordsLinkElement.textContent = `${latitude}, ${longitude}`;
    // Asetetaan linkki näkyviin käyttäjälle
    coordsLinkElement.style.display = 'inline';

    // Haetaan sääkuva datasta ja luodaan polku kuvalle
    const weatherIcon = getWeatherIcon(data.weather[0].main);
    document.getElementById('weather-icon').src = `images/${weatherIcon}.png`;

    // Tuodaan säätiedot näkyviin fade-in efektillä
    const placeElement = document.querySelector('.paikka');
    const weatherElement = document.querySelector('.weather');

    // Poistetaan ensin mahdolliset aiemmat fade-in luokat
    placeElement.classList.remove('fade-in');
    weatherElement.classList.remove('fade-in');

    // Pakotetaan selain päivittämään muutokset ennen animaation lisäämistä
    void placeElement.offsetWidth;
    void weatherElement.offsetWidth;

    // Lisätään fade-in luokka uudelleen
    placeElement.classList.add('fade-in');
    weatherElement.classList.add('fade-in');

    // Elementit näkyviksi
    placeElement.style.display = 'block';
    weatherElement.style.display = 'block';
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
        case 'Fog':
            return 'fog';
    }
}