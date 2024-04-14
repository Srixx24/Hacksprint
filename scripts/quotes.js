/*
  This code selects a random quote from the quotes array and logs it to the
  console. Each time it is run, it will display a different quote.
*/
function getRandomQuote() {
    var quotes = [
        { quote1: "Look up at the stars and not down at your feet. Try to make sense of what you see, and wonder about what makes the universe exist. Be curious. - Stephen Hawking" },
        { quote2: "You must live in the present, launch yourself on every wave, find your eternity in each moment. - Henry David Thoreau" },
        { quote3: "Thousands of candles can be lit from a single candle, and the life of the candle will not be shortened. Happiness never decreases by being shared. - Buddha" },
        { quote4: "Cherish your visions and your dreams as they are the children of your soul, the blueprints of your ultimate achievements. - Napoleon Hill" },
        { quote5: "The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart. - Helen Keller" },
        { quote6: "Embrace the questions in your heart and welcome that the answers will come their own time. All things worth having are worth waiting for. - Jackie Lovins" },
        { quote7: "I am not free while any woman is unfree, even when her shackles are very different from my own. - Audre Lorde" },
        { quote8: "If there is a book that you want to read, but it hasn't been written yet, you must be the one to write it. - Toni Morrison" },
        { quote9: "The most common way people give up their power is by thinking they don't have any. - Alice Walker" },
        { quote10: "I have learned over the years that when one's mind is made up, this diminishes fear; knowing what must be done does away with fear. - Rosa Parks" },
        { quote11: "You don't make progress by standing on the sidelines, whimpering and complaining. You make progress by implementing ideas. - Shirley Chisholm" },
        { quote12: "The kind of beauty I want most is the hard-to-get kind that comes from within - strength, courage, dignity. - Ruby Dee" }
    ];

    var quoteIndex = Math.floor(Math.random() * quotes.length);
    return quotes[quoteIndex].quote;  // Directly return the quote text
}
