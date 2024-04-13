// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function() {
  // Fetch weather data
  fetchWeather();
  updateClock();
  setInterval(updateClock, 1000);
  
  // Handle search form submission
  const searchForm = document.getElementById("search");
  searchForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const searchInput = document.getElementById("searchInput");
    const query = searchInput.value;
    if (query) {
      const searchUrl = "https://www.google.com/search?q=" + encodeURIComponent(query);
      window.location.href = searchUrl;
    }
  });
  
  // Toggle search bar visibility
  const searchChange = document.getElementById("searchChange");
  searchChange.addEventListener("click", function() {
    const searchWrapper = document.getElementById("searchWrapper");
    searchWrapper.classList.toggle("active");
    const searchInput = document.getElementById("searchInput");
    if (searchWrapper.classList.contains("active")) {
      searchInput.focus();
    } else {
      searchInput.blur();
    }
  });
});

// Fetch weather data from API
function fetchWeather() {
  // Replace the following URL with your weather API endpoint
  const weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + encodeURIComponent(window.location.href) + "&appid=d311ada8928d1db50516795d4b5b07af";
  
  fetch(weatherApiUrl)
    .then(response => response.json())
    .then(data => {
      // Extract relevant weather information from the data
      const temperature = data.current.temp_c;
      const condition = data.current.condition.text;
      const location = data.location.name;

      // Update the weather information in the HTML
      const temperatureElement = document.getElementById("temperature");
      temperatureElement.textContent = temperature + "°C";
      const descriptionElement = document.getElementById("description");
      descriptionElement.textContent = condition;
      const locationElement = document.getElementById("location");
      locationElement.textContent = location;
    })
    .catch(error => {
      console.log("Error fetching weather data:", error);
    });
}

const backgroundImages = [
  "bg1.jpg",
  "bg2.jpg",
  "bg3.jpg",
  "bg4.jpg",
  "bg5.jpg",
  "bg6.jpg",
  "bg7.jpg",
  "bg8.jpg",
  "bg9.jpg",
  "bg10.jpg",
  "bg11.jpg",
  "bg12.jpg",
];

// Function to set a random background image
function setRandomBackground() {
  const backdropImg = document.getElementById("backdropimg");
  const randomIndex = Math.floor(Math.random() * backgroundImages.length);
  const randomImage = backgroundImages[randomIndex];
  const imageUrl = "Background images/" + randomImage;
  backdropImg.src = imageUrl;
}

// Function to update the local time clock
function updateClock() {
  const timeElement = document.getElementById("time");
  const paElement = document.getElementById("pa");

  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

  timeElement.textContent = formattedHours + ":" + formattedMinutes;
  paElement.textContent = ampm;
}

// Initialize default time settings
window.newTab.clock.military = false;

// Load clock settings
chrome.storage.local.get({
  time_switch: 'on',
  time_top_data: '',
  time_left_data: '',
  military_switch: 'off'
}, function(data) {
  // Check clock settings and apply
  if (data.time_switch == 'off') {
    document.getElementById("timeSwitch").checked = false;
    document.getElementById("timeWrapper").classList.add("exit");
    document.getElementById("timeWrapper").classList.add("firstStart");
  } else {
    document.getElementById("timeSwitch").checked = true;
    document.getElementById("timeWrapper").classList.add("entrance");
  }
  // Set clock position
  if (data.time_top_data != '') {
    document.getElementById("timeWrapper").style.top = data.time_top_data;
  }
  if (data.time_left_data != '') {
    document.getElementById("timeWrapper").style.left = data.time_left_data;
  }
  // Set military time format
  window.newTab.clock.military = (data.military_switch == 'off');

  // Update the clock initially and start clock
  updateLocalTime();

  // Update the clock every second
  setInterval(updateLocalTime, 1000);
});
