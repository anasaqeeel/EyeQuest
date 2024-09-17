// Timer.js
import React, { useState, useEffect } from 'react';

const Timer = ({ score }) => {
    const [timeLeft, setTimeLeft] = useState(60); // Starting with 60 seconds for example

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft]);

    return (
        <div
            style={{
                color: 'white',
                fontSize: '20px',
                marginTop: '10px',
            }}
        >
            Time Left: {timeLeft}s
        </div>
    );
};

export default Timer;
