import { useState, useEffect } from 'react';
import './Quote.scss';
import fetchApi from './fetchApi';

const Quote = () => {
    const [quote, setQuote] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchQuote = async () => {
            try {
                setIsLoading(true);

                const storedQuote = localStorage.getItem('dailyQuote');
                const storedTimestamp = localStorage.getItem('quoteTimestamp');
                const now = new Date().getTime();

                if (storedQuote && storedTimestamp && (now - storedTimestamp < 86400000)) {
                    setQuote(JSON.parse(storedQuote));
                } else {
                    const responseData = await fetchApi();
                    if (responseData && responseData.length > 0) {
                        const newQuote = responseData[0];
                        setQuote(newQuote);

                        localStorage.setItem('dailyQuote', JSON.stringify(newQuote));
                        localStorage.setItem('quoteTimestamp', now.toString());
                    } else {
                        throw new Error('No valid quote data received');
                    }
                }
            } catch (error) {
                const emergencyQuotes = [
                    { q: "The secret of getting ahead is getting started.", a: "Mark Twain" },
                    { q: "Your limitation—it's only your imagination.", a: "Unknown" },
                    { q: "Push yourself, because no one else is going to do it for you.", a: "Unknown" },
                    { q: "Great things never come from comfort zones.", a: "Unknown" },
                    { q: "Dream it. Wish it. Do it.", a: "Unknown" },
                    { q: "The best way to predict the future is to create it.", a: "Peter Drucker" },
                    { q: "Success is not final, failure is not fatal: It is the courage to continue that counts.", a: "Winston Churchill" }
                ];
                const randomQuote = emergencyQuotes[Math.floor(Math.random() * emergencyQuotes.length)];
                setQuote(randomQuote);
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
            ) : quote ? (
                <div className="quote-item">
                    <p className="quote">{quote.q}</p>
                    <p className="author">- {quote.a}</p>
                </div>
            ) : (
                <p className="error">Unable to load quotes at the moment</p>
            )}
        </div>
    );
};

export default Quote;