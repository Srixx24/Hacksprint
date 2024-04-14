/*
  A getWeather function that uses asynchronous function. Allowing the function
  to pause its execution while waiting for the asynchronous operation to complete.
  It retrieves the user's geolocation, fetches weather data from the OpenWeatherMap
  API based on the obtained coordinates, and updates the HTML elements with the
  retrieved weather information.
*/
document.addEventListener("DOMContentLoaded", function() {
    async function getWeather() {
      var temperature = document.getElementById("temperature");
      var description = document.getElementById("description");
      var location = document.getElementById("location");
      var locationIcon = document.querySelector('.weather-icon');

      location.innerHTML = "fetching weather data...";

      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;
        const api = "https://api.openweathermap.org/data/2.5/weather";
        const apiKey = "f146799a557e8ab658304c1b30cc3cfd";
        const url = `${api}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

        const response = await fetch(url);
        const data = await response.json();

        console.log(data);

        var tempCelsius = data.main.temp;
        var tempFahrenheit = (tempCelsius * 9 / 5) + 32;
        temperature.innerHTML = tempFahrenheit.toFixed(2) + "° F";
        location.innerHTML = data.name;
        description.innerHTML = data.weather[0].main;
        var weatherType = data.weather[0].icon;
        var fileName = `<img src="icons weather/Puggy.gif" width = "200">`;
        locationIcon.innerHTML = fileName;
      } catch (error) {
        location.innerHTML = "Unable to retrieve your location";
      }
    }

    getWeather();
});

