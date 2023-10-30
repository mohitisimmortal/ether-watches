import React from 'react';
import './Menwatches.css'; // Import your CSS file for styling
import { useNavigate } from 'react-router-dom';

const MenWatches = () => {
    const navigate = useNavigate()

    return (
        <>
            <div className="men-watches-container">
                <div className="men-watches-content">
                    <h2>Men's Watches</h2>
                    <p>
                        Adorn your wrist with opulence and craftsmanship.
                        <br />
                        Experience the pinnacle of horological excellence.
                    </p>
                    <h3>Starting at just $249.99!</h3>
                    <button className="globalbtn" onClick={() => navigate('/watches?gender=male')}>Explore Now</button>
                </div>
            </div>
            <WomenWatches />
        </>
    );
};

const WomenWatches = () => {
    const navigate = useNavigate()
    return (
        <div className="men-watches-container women-watches-container">
            <div className="men-watches-content women-watches-content">
                <h2>Women's Watches</h2>
                <p>
                    Indulge in timeless elegance with our exquisite women's watch collection.
                    <br />
                    Elevate your style and make a statement.
                </p>
                <h3>Starting at just $157.99!</h3>
                <button className="globalbtn" onClick={() => navigate('/watches?gender=female')}>Explore Now</button>
            </div>
        </div>
    );
};

export default MenWatches;