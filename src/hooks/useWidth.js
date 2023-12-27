import React, { useState, useEffect } from 'react';

const useWidth = () => {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWidth(Math.round(window.innerWidth / 50) * 50);
        };

        // Set up event listener for window resize
        window.addEventListener('resize', handleResize);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); // Empty dependency array means this effect runs once on mount

    return width;
};

export default useWidth;