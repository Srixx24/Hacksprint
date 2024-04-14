// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function() {
    // Initialize features
    loadBackgrounds().then(backgrounds => {
        setRandomBackground(backgrounds);
    });
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
    const weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?q=Tulsa,OK,US&appid=f146799a557e8ab658304c1b30cc3cfd&units=metric";
    fetch(weatherApiUrl)
        .then(response => response.json())
        .then(data => {
            const temperature = data.main.temp;
            const condition = data.weather[0].main;
            const location = data.name;
            document.getElementById("temperature").textContent = `${temperature}°C`;
            document.getElementById("description").textContent = condition;
            document.getElementById("location").textContent = location;
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
        });
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
    timeElement.textContent = `${formattedHours}:${formattedMinutes}`;
    paElement.textContent = ampm;
}
