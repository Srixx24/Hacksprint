// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function() {
    // Initialize features
    loadBackgrounds().then(backgrounds => {
        setRandomBackground(backgrounds);
    });
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

    var button = document.getElementById('aboutButton');
    var popup = document.getElementById('popupText');

    // Display the popup when clicking the button
    button.addEventListener('click', function() {
      popup.style.display = 'block';
    });

    // Hide the popup when clicking outside it
    document.addEventListener('click', function(event) {
      if (!popup.contains(event.target) && event.target !== button) {
        popup.style.display = 'none';
      }
    });
});

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
