document.addEventListener("DOMContentLoaded", function() {
  // Define the API endpoint
  const moonPhaseApiUrl = 'https://api.farmsense.net/v1/moonphases/?d=1605585600'; // You'll need to replace this with the actual API endpoint

  // Function to fetch and display moon phase information
  function fetchMoonPhaseData() {
    fetch(moonPhaseApiUrl)
      .then(response => response.json())
      .then(data => {
        const moonPhaseDiv = document.getElementById('moonPhase');
        // Assuming the API returns an array of phases and we take the first one
        const phaseData = data[0];
        moonPhaseDiv.innerHTML = `Moon Phase: ${phaseData.Phase}`; // Change this according to the actual structure of the response
      })
      .catch(error => {
        console.error('Error fetching moon phase data:', error);
      });
  }

  // Call the function to fetch moon phase data
  fetchMoonPhaseData();

  // You can set an interval to refresh this data regularly, e.g., every hour
  setInterval(fetchMoonPhaseData, 3600000);
});

