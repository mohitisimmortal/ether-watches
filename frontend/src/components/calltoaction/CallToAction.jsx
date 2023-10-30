import React from 'react';
import './CallToAction.css';
import hero from '../../assets/hero.jpg'
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section className="cta-container">
      <div className="cta-image">
        <img src={hero} alt="Watch" />
      </div>
      <div className="cta-content">
        <h4>A Great Watch Awaits</h4>
        <p>Elevate your style with our exclusive watch collection. Discover craftsmanship that stands the test of time. From classic designs to modern marvels, find the perfect accessory for any occasion.</p>
        <p>Unleash the power of timeless elegance. Redefine sophistication with our curated selection of luxury timepieces. Each watch reflects a commitment to craftsmanship, precision, and enduring beauty.</p>
        <Link to='/watches' className='cta-button globalbtn'>Shop Now</Link>
      </div>
    </section>
  );
};

export default CallToAction;