async function fetchApi() {
  const APIs = [
    {
      name: "Quotable",
      fetch: async () => {
        try {
          const requestOptions = {
            method: "GET",
            redirect: "follow",
          };
          const response = await fetch(
            "https://api.quotable.io/random",
            requestOptions
          );

          if (!response.ok) {
            throw new Error(`Quotable HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          if (data && data.content && data.author) {
            return [
              {
                q: data.content,
                a: data.author,
              },
            ];
          } else {
            throw new Error("Quotable API returned invalid data");
          }
        } catch (error) {
          console.warn("Quotable API fetch failed:", error.message);
          throw error;
        }
      },
    },
    {
        name: 'ZenQuotes',
        fetch: async () => {
            const proxyUrl = 'https://api.allorigins.win/get?url=';
            const apiUrl = 'https://zenquotes.io/api/random/';
            const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const quotes = JSON.parse(data.contents);
            if (quotes && quotes[0] && quotes[0].q &&
                (quotes[0].q.includes('Too many requests') ||
                 quotes[0].q.includes('Obtain an auth key') ||
                 quotes[0].q.includes('zenquotes.io'))) {
                throw new Error('ZenQuotes quota exceeded or API error');
            }
            if (!quotes || !quotes[0] || !quotes[0].q || quotes[0].q.trim() === '') {
                throw new Error('Invalid quote data from ZenQuotes');
            }
            return quotes;
        }
    },
    {
      name: "Fallback Local Quotes",
      fetch: async () => {
        const fallbackQuotes = [
          {
            q: "The best way to predict the future is to create it.",
            a: "Peter Drucker",
          },
          {
            q: "It does not matter how slowly you go as long as you do not stop.",
            a: "Confucius",
          },
          {
            q: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
            a: "Winston Churchill",
          },
          {
            q: "Believe you can and you're halfway there.",
            a: "Theodore Roosevelt",
          },
          {
            q: "Don't watch the clock; do what it does. Keep going.",
            a: "Sam Levenson",
          },
          {
            q: "The only way to do great work is to love what you do.",
            a: "Steve Jobs",
          },
          {
            q: "Innovation distinguishes between a leader and a follower.",
            a: "Steve Jobs",
          },
          {
            q: "Life is what happens to you while you're busy making other plans.",
            a: "John Lennon",
          },
          {
            q: "The future belongs to those who believe in the beauty of their dreams.",
            a: "Eleanor Roosevelt",
          },
          {
            q: "It is during our darkest moments that we must focus to see the light.",
            a: "Aristotle",
          },
          {
            q: "Yesterday is history, tomorrow is a mystery, today is a gift.",
            a: "Eleanor Roosevelt",
          },
          {
            q: "Be yourself; everyone else is already taken.",
            a: "Oscar Wilde",
          },
          {
            q: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.",
            a: "Albert Einstein",
          },
          {
            q: "You only live once, but if you do it right, once is enough.",
            a: "Mae West",
          },
          {
            q: "In the end, we will remember not the words of our enemies, but the silence of our friends.",
            a: "Martin Luther King Jr.",
          },
        ];
        const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
        return [fallbackQuotes[randomIndex]];
      },
    },
  ];

  for (let i = 0; i < APIs.length; i++) {
    try {
      const quotes = await APIs[i].fetch();
      if (quotes && quotes.length > 0 && quotes[0].q) {
        return quotes;
      }
    } catch (error) {
      // Swallow error, try next API
    }
  }

  throw new Error("All quote sources failed");
}

export default fetchApi;
