async function fetchApi() {
    const APIs = [
        {
            fetch: async () => {
                const proxyUrl = 'https://api.allorigins.win/get?url=';
                const apiUrl = 'https://zenquotes.io/api/random/';
                const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
                const data = await response.json();
                return JSON.parse(data.contents);
            }
        },
        {
            fetch: async () => {
                const response = await fetch('https://api.quotable.io/random');
                const data = await response.json();
                return [{
                    q: data.content,
                    a: data.author
                }];
            }
        },
        {
            fetch: async () => {
                const fallbackQuotes = [
                    { q: "The best way to predict the future is to create it.", a: "Peter Drucker" },
                    { q: "It does not matter how slowly you go as long as you do not stop.", a: "Confucius" },
                    { q: "Success is not final, failure is not fatal: It is the courage to continue that counts.", a: "Winston Churchill" },
                    { q: "Believe you can and you're halfway there.", a: "Theodore Roosevelt" },
                    { q: "Don't watch the clock; do what it does. Keep going.", a: "Sam Levenson" }
                ];
                const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
                return [fallbackQuotes[randomIndex]];
            }
        }
    ];

    // Try each API in sequence until one works
    for (let i = 0; i < APIs.length; i++) {
        try {
            const quotes = await APIs[i].fetch();
            if (quotes && quotes.length > 0) {
                // Check if the quote contains error messages
                const quote = quotes[0];
                if (quote.q && !quote.q.includes('Too many requests') && 
                    !quote.q.includes('auth key') && 
                    !quote.q.includes('zenquotes.io') &&
                    quote.q.length > 10) { // Ensure it's a real quote, not an error
                    console.log(`Successfully fetched quote from API ${i + 1}`);
                    return quotes;
                } else {
                    console.warn(`API ${i + 1} returned error message: ${quote.q}`);
                    continue; // Skip to next API
                }
            }
        } catch (error) {
            console.warn(`API ${i + 1} failed:`, error.message);
            // Continue to the next API
        }
    }

    // If all APIs fail, throw an error
    console.error("All quote APIs failed");
    throw new Error("All quote APIs failed");
}

export default fetchApi;
