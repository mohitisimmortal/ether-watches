import React from 'react';
import { Link } from 'react-router-dom';
import './NewReleases.css'; // Import your CSS file for styling
import new1 from '../../assets/new1.jpg'
import new2 from '../../assets/new2.jpg'
import new3 from '../../assets/new3.jpg'
import new4 from '../../assets/new4.jpg'
const watches = [
  {
    id: 1,
    name: 'Nova X1',
    price: 299.99,
    image: new1,
    link: '/watch/653e98fd903b4edc3fbd30ca',
  },
  {
    id: 2,
    name: 'Elegance E2',
    price: 349.99,
    image: new2,
    link: '/watch/653e9950903b4edc3fbd30d0',
  },
  {
    id: 3,
    name: 'Urban Chrono',
    price: 249.99,
    image: new3,
    link: '/watch/653e9b1b903b4edc3fbd3100',
  },
  {
    id: 4,
    name: 'Sporty Chic',
    price: 599.99,
    image: new4,
    link: '/watch/653e9b7b903b4edc3fbd3106',
  }
];

const NewReleases = () => {
  return (
    <div className="new-releases-container">
      <h2>New Releases</h2>
      <div className="watch-cards">
        {watches.map((watch) => (
          <div key={watch.id} className="watch-card">
            <Link to={watch.link}>
              <img src={watch.image} alt={watch.name} />
              <div>
                <h3>{watch.name}</h3>
                <p>${watch.price.toFixed(2)}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewReleases;