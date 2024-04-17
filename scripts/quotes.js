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
        { quote: "Embrace the questions in your heart and welcome that the answers will come at their own time. All things worth having are worth waiting for. - Jackie Lovins" },
        { quote: "I am not free while any woman is unfree, even when her shackles are very different from my own. - Audre Lorde" },
        { quote: "If there is a book that you want to read, but it hasn't been written yet, you must be the one to write it. - Toni Morrison" },
        { quote: "The most common way people give up their power is by thinking they don't have any. - Alice Walker" },
        { quote: "I have learned over the years that when one's mind is made up, this diminishes fear; knowing what must be done does away with fear. - Rosa Parks" },
        { quote: "If you're not personally free to be yourself in that most important of all human activities -the expression of love - then life itself loses its meaning. - Harvey Milk" },
        { quote: "The kind of beauty I want most is the hard-to-get kind that comes from within - strength, courage, dignity. - Ruby Dee" }
    ];

    var quoteIndex = Math.floor(Math.random() * quotes.length);
    var randomQuote = quotes[quoteIndex].quote;
    var quoteTextElement = document.getElementById("quote-text");

    // Log the element to see if it was successfully retrieved
    console.log("Quote text element found:", quoteTextElement);

    // Check if the element exists before trying to set its text content
    if (quoteTextElement) {
        quoteTextElement.textContent = randomQuote;
    } else {
        // Log an error if the element was not found
        console.error("Failed to find the 'quote-text' element.");
    }
}

// Call getRandomQuote to initialize the quote on page load
document.addEventListener("DOMContentLoaded", function() {
    getRandomQuote();
});
