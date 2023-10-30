import React from 'react';
import { Link } from 'react-router-dom';
import './Collections.css';
import titan from '../../assets/titan.jpg'
import rolex from '../../assets/rolex.jpg'
import rider from '../../assets/rider.jpg'
import quartz from '../../assets/quartz.jpg'

const watches = [
    {
        id: 1,
        collectionname: 'titan',
        price: 221.99,
        image: titan,
    },
    {
        id: 2,
        collectionname: 'rolex',
        price: 188.99,
        image: rolex,
    },
    {
        id: 3,
        collectionname: 'rider',
        price: 157.99,
        image: rider,
    },
    {
        id: 4,
        collectionname: 'quartz',
        price: 249.99,
        image: quartz,
    }
];

const Collections = () => {
    return (
        <div className="collection-container">
            <h2>Browse Collections</h2>
            <div className="watch-cards">
                {watches.map((watch) => (
                    <div key={watch.id} className="watch-card">
                        <Link to={`/collection/${watch.collectionname}`}>
                            <img src={watch.image} alt={watch.collectionname} />
                            <div>
                                <h3>{watch.collectionname}</h3>
                                <p>Starts from ${watch.price.toFixed(2)}</p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Collections;