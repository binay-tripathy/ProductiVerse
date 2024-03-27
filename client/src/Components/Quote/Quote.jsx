import React, { useState, useEffect } from 'react';
import './Quote.scss';
import fetchApi from './fetchApi';

const Quote = () => {
    const [response, setResponse] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseData = await fetchApi();
                setResponse(responseData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {response.length > 0 && (
                <div className="quote-container">
                    {response.map((item, index) => (
                        <div key={index} className="quote-item">
                            <p className="quote">{item.q}</p>
                            <p className="author">- {item.a}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Quote;
