/*
  A getWeather function that uses asynchronous function. Allowing the function
  to pause its execution while waiting for the asynchronous operation to complete.
  It retrieves the user's geolocation, fetches weather data from the OpenWeatherMap
  API based on the obtained coordinates, and updates the HTML elements with the
  retrieved weather information.
*/
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
    const apiKey = "d311ada8928d1db50516795d4b5b07af";
    const url = `${api}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    const response = await fetch(url);
    const data = await response.json();

    console.log(data);

    var temp = data.main.temp;
    temperature.innerHTML = temp + "° C";
    location.innerHTML = data.name;
    description.innerHTML = data.weather[0].main;
    var test = data.weather[0].icon;
    var fileName = `<img src="icon/${test}.gif" width = "50">`;
    locationIcon.innerHTML = fileName;
  } catch (error) {
    location.innerHTML = "Unable to retrieve your location";
  }
}

  getWeather();
