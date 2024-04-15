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
    if (searchForm) {
        searchForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const searchInput = document.getElementById("searchInput");
            const query = searchInput.value;
            if (query) {
                const searchUrl = "https://www.google.com/search?q=" + encodeURIComponent(query);
                window.location.href = searchUrl;
            }
        });
    }

    var button = document.getElementById('aboutButton');
    var popup = document.getElementById('popupText');

    if (button && popup) {
        // Display the popup when clicking the button
        button.addEventListener('click', function(event) {
            popup.style.display = 'block';
            event.stopPropagation(); // Prevent the click from propagating to the document
        });

        // Hide the popup when clicking outside it
        document.addEventListener('click', function(event) {
            if (!popup.contains(event.target)) {
                popup.style.display = 'none';
            }
        });
    }
});

// Function to update the local time clock
function updateClock() {
    const timeElement = document.getElementById("time");
    const paElement = document.getElementById("pa");
    if (timeElement && paElement) {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;  // Converts 0 to 12 for midnight
        timeElement.textContent = `${hours}:${minutes}`;
        paElement.textContent = ampm;
    }
}
