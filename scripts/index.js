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
    const weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?q=Tulsa,OK&appid=d311ada8928d1db50516795d4b5b07af&units=metric";
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

// Function to load backgrounds from JSON configuration
async function loadBackgrounds() {
    const response = await fetch('configs/backgrounds.json');
    const data = await response.json();
    return data.list.map(bg => ({
        ...bg,
        quote: getRandomQuote()
    }));
}

const backgrounds = [
    { image: "Background images/bg1.jpg", quote: "quote1" },
    { image: "Background images/bg2.jpg", quote: "quote2" },
    { image: "Background images/bg3.jpg", quote: "quote3" },
    { image: "Background images/bg4.jpg", quote: "quote4" },
    { image: "Background images/bg5.jpg", quote: "quote5" },
    { image: "Background images/bg6.jpg", quote: "quote6" },
    { image: "Background images/bg7.jpg", quote: "quote7" },
    { image: "Background images/bg8.jpg", quote: "quote8" },
    { image: "Background images/bg9.jpg", quote: "quote9" },
    { image: "Background images/bg10.jpg", quote: "quote10" },
    { image: "Background images/bg11.jpg", quote: "quote11" },
    { image: "Background images/bg12.jpg", quote: "quote12" },
  ];

// Function to set a random background image and quote
function setRandomBackground(backgrounds) {
    const backdropImg = document.getElementById("backdropimg");
    const quoteText = document.getElementById("quote-text");
    const randomIndex = Math.floor(Ma0th.random() * backgrounds.length);
    const selectedBackground = backgrounds[randomIndex];
    backdropImg.src = selectedBackground.image;
    quoteText.textContent = selectedBackground.quote;
}
setRandomBackground(backgrounds);

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
