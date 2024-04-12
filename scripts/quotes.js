/*
  This code selects a random quote from the quotes array and logs it to the
  console. Each time it is ran it will display a different quote.
*/
var quotes = [
  {quote: "Look up at the stars and not down at your feet. Try to make sense of what you see, and wonder about what makes the universe exist. Be curious. - Stephen Hawking"},
  {quote: "You must live in the present, launch yourself on every wave, find your eternity in each moment. -Henry David Thoreau"},
  {quote: "Thousands of candles can be lit from a single candle, and the life of the candle will not be shortened. Happiness never decreases by being shared. - Buddha"},
  {quote: "Cherish your visions and your dreams as they are the children of your soul, the blueprints of your ultimate achievements. -Napoleon Hill"},
  {quote: "The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart. - Helen Keller"},
  {quote: "Embrace the questions in your heart and welcome that the answers will come their own time. All things worth having are worth waiting for. - Jackie Lovins"},
  {quote: "boop"},
  {quote: "boop"},
  {quote: "boop"},
  {quote: "boop"},
  {quote: "boop"},
  {quote: "boop"}
];

function getRandomQuote(array) {
  var quoteIndex = Math.floor(Math.random() * quotes.length);
  var randomQuote = array[quoteIndex];
  return randomQuote.quote;
}
var result = getRandomQuote(quotes);

console.log(result);
