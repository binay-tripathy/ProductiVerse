import { useState, useEffect } from 'react';
import './Quote.scss';
import fetchApi from './fetchApi';

const Quote = () => {
    const [quote, setQuote] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuote = async () => {
            try {
                setIsLoading(true);

                // Try to get the quote from storage first
                const storedQuote = localStorage.getItem('dailyQuote');
                const storedTimestamp = localStorage.getItem('quoteTimestamp');
                const now = new Date().getTime();

                // If we have a stored quote that's less than 24 hours old, use it
                if (storedQuote && storedTimestamp && (now - storedTimestamp < 86400000)) {
                    setQuote(JSON.parse(storedQuote));
                } else {
                    // Otherwise fetch a new quote
                    const responseData = await fetchApi();
                    if (responseData && responseData.length > 0) {
                        const newQuote = responseData[0];
                        setQuote(newQuote);

                        // Store the quote and timestamp
                        localStorage.setItem('dailyQuote', JSON.stringify(newQuote));
                        localStorage.setItem('quoteTimestamp', now.toString());
                    }
                }
            } catch (error) {
                console.error('Error fetching quote:', error);
                setError('Failed to load your daily inspiration. Please try again later.');
                
                // Use a fallback quote if there's an error
                setQuote({
                    q: "The secret of getting ahead is getting started.",
                    a: "Mark Twain"
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuote();
    }, []);

    return (
        <div className="quote-container">
            {isLoading ? (
                <p className="loading">Loading your daily inspiration...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : quote && (
                <div className="quote-item">
                    <p className="quote">{quote.q}</p>
                    <p className="author">- {quote.a}</p>
                </div>
            )}
        </div>
    );
};

export default Quote;
