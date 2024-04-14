/*
  This code selects a random quote amd background from the arrays and logs it to the
  console. Each time a new tabe is opened a new background and quote are generated.
*/
function getRandomQuote() {
    var quotes = [
        { quote: "Look up at the stars and not down at your feet. Try to make sense of what you see, and wonder about what makes the universe exist. Be curious. - Stephen Hawking" },
        { quote: "You must live in the present, launch yourself on every wave, find your eternity in each moment. - Henry David Thoreau" },
        { quote: "Thousands of candles can be lit from a single candle, and the life of the candle will not be shortened. Happiness never decreases by being shared. - Buddha" },
        { quote: "Cherish your visions and your dreams as they are the children of your soul, the blueprints of your ultimate achievements. - Napoleon Hill" },
        { quote: "The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart. - Helen Keller" },
        { quote: "Embrace the questions in your heart and welcome that the answers will come their own time. All things worth having are worth waiting for. - Jackie Lovins" },
        { quote: "I am not free while any woman is unfree, even when her shackles are very different from my own. - Audre Lorde" },
        { quote: "If there is a book that you want to read, but it hasn't been written yet, you must be the one to write it. - Toni Morrison" },
        { quote: "The most common way people give up their power is by thinking they don't have any. - Alice Walker" },
        { quote: "I have learned over the years that when one's mind is made up, this diminishes fear; knowing what must be done does away with fear. - Rosa Parks" },
        { quote: "If you're not personally free to be yourself in that most important of all human activities -the expression of love - then life itself loses its meaning. - Harvey Milk" },
        { quote: "The kind of beauty I want most is the hard-to-get kind that comes from within - strength, courage, dignity. - Ruby Dee" }
    ];

    var quoteIndex = Math.floor(Math.random() * quotes.length);
    var randomQuote = quotes[quoteIndex].quote;
    document.getElementById("quote-text").textContent = randomQuote;
}
getRandomQuote();

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
  { image: "Background images/bg1.jpg" },
  { image: "Background images/bg2.jpg" },
  { image: "Background images/bg3.jpg" },
  { image: "Background images/bg4.jpg" },
  { image: "Background images/bg5.jpg" },
  { image: "Background images/bg6.jpg" },
  { image: "Background images/bg7.jpg" },
  { image: "Background images/bg8.jpg" },
  { image: "Background images/bg9.jpg" },
  { image: "Background images/bg10.jpg" },
  { image: "Background images/bg11.jpg" },
  { image: "Background images/bg12.jpg" },
];

// Function to set a random background image
function setRandomBackground(backgrounds) {
  var backgroundIndex = Math.floor(Math.random() * backgrounds.length);
  var background = backgrounds[backgroundIndex];

  var backdrop = document.getElementById("backdropimg");
  backdrop.style.backgroundImage = "url(" + background.image + ")";
  backdrop.style.opacity = 1;
}
loadBackgrounds().then(backgrounds => {
  setRandomBackground(backgrounds);
});
