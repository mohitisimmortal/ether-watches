import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './Collections.css';
import { handleApiError } from '../../reactToastify';
import baseUrl from '../../baseUrl';

const CollectionDetails = () => {
    const { collectionname } = useParams(); // Get the collection name from the route parameter
    const [collectionWatches, setCollectionWatches] = useState([]); // State to hold the fetched watches
    const [loading, setLoading] = useState(true); // State to handle loading state

    useEffect(() => {
        // Fetch the watches for the given collection name
        axios.get(`${baseUrl}/product/collection/${collectionname}`)
            .then((response) => {
                setCollectionWatches(response.data);
                setLoading(false);
            })
            .catch((error) => {
                handleApiError(error)
                setLoading(false);
            });
    }, [collectionname]);

    return (
        <section style={{ paddingTop: '20px', minHeight: '100vh' }}>
            <h2 style={{ color: 'white', textAlign: 'center', textTransform: 'capitalize', marginBottom: '10px' }}>{collectionname} Collection</h2>
            {loading ? (
                <p style={{ color: 'white' }}>Loading...</p>
            ) : (
                <div className="watch-cards">
                    {collectionWatches.map((watch) => (
                        <div key={watch._id} className="watch-card" style={{ boxShadow: 'none' }}>
                            <Link to={`/watch/${watch._id}`}>
                                <img src={watch.imageUrl} alt={watch.name} />
                                <div>
                                    <h3>{watch.name}</h3>
                                    <p>${watch.price.toFixed(2)}</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default CollectionDetails;