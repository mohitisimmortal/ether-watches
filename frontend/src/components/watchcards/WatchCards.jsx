import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './WatchCards.css';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { productState } from '../../recoil/productAtom';
import { useRecoilState } from 'recoil';
import { Link, useLocation } from 'react-router-dom';
import baseUrl from '../../baseUrl';

const WatchCards = () => {
    const [products, setProducts] = useRecoilState(productState);
    const [metaData, setMetaData] = useState({ total: 0, totalPages: 1, currentPage: 1 });
    const [brand, setBrand] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [priceRange, setPriceRange] = useState('');
    const [ratings, setRatings] = useState('');
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const gender = searchParams.get('gender');
    const searchTerm = searchParams.get('search') || '';  // Retrieve the search term from the URL

    useEffect(() => {
        fetchProducts();
    }, [brand, priceRange, ratings, gender, metaData.currentPage, searchTerm]);

    const fetchProducts = () => {
        axios.get(`${baseUrl}/product/getall`, {
            params: {
                page: metaData.currentPage,
                brand,
                priceRange,
                ratings,
                gender,
                searchTerm
            }
        })
            .then((response) => {
                setProducts(response.data.products);
                setMetaData(prev => ({ ...prev, ...response.data.meta }));
            })
            .catch((error) => console.error('Error fetching products: ', error));
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        if (name === 'brand') {
            setBrand(value);
        } else if (name === 'priceRange') {
            setPriceRange(value);
        } else if (name === 'ratings') {
            setRatings(value);
        }
    };

    const clearFilters = () => {
        setBrand('');
        setPriceRange('');
        setRatings('');
        setMetaData(prev => ({ ...prev, currentPage: 1 }));
    };

    const handlePageChange = (_, newPage) => {
        setMetaData(prev => ({ ...prev, currentPage: newPage }));
    };

    return (
        <section className="ether-watch-cards-container">
            <button
                className="filter-button"
                onClick={() => setShowFilters(!showFilters)}
                style={{ background: 'white' }}
            >
                {showFilters ? <CloseIcon /> : <MenuIcon />}
            </button>

            <div className={`ether-watch-filters ${showFilters ? 'open' : ''}`} >
                <h3 style={{ marginBottom: '8px' }}>Filters</h3>
                <div className="filter-item">
                    <label>Brand</label>
                    <input
                        type="text"
                        name="brand"
                        value={brand}
                        onChange={handleFilterChange}
                        style={{ marginBottom: '8px' }}
                    />
                </div>
                <div className="filter-item">
                    <label>Price Range</label>
                    <select
                        name="priceRange"
                        value={priceRange}
                        onChange={handleFilterChange}
                        style={{ marginBottom: '8px' }}
                    >
                        <option value="">All</option>
                        <option value="under400">Under $400</option>
                        <option value="above400">Above $400</option>
                    </select>
                </div>
                <div className="filter-item">
                    <label>Ratings</label>
                    <select
                        name="ratings"
                        value={ratings}
                        onChange={handleFilterChange}
                        style={{ marginBottom: '8px' }}
                    >
                        <option value="">All</option>
                        <option value="below4">Below 4 Stars</option>
                        <option value="above4">4 Stars and Above</option>
                    </select>
                </div>
                <button onClick={clearFilters} style={{ marginTop: '10px', padding: '5px', cursor: 'pointer' }}>Clear Filters</button>
            </div>

            <div className="ether-watch-card-list">
                {products.map((watch) => (
                    <div className="ether-watch-card" key={watch._id}>
                        <div className="left">
                            <img src={watch.imageUrl} alt={watch.name} />
                        </div>
                        <div className="right">
                            <h3>{watch.name}</h3>
                            <p>{watch.ratings} Stars</p>
                            <p>${watch.price.toFixed(2)}</p>
                            <Link to={`/watch/${watch._id}`}>
                                <button className="globalbtn viewdetails-btn">View Details</button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <Stack spacing={2} className="pagination" >
                <Pagination
                    count={metaData.totalPages}
                    page={metaData.currentPage}
                    onChange={handlePageChange}
                    style={{ background: 'white', borderRadius: '10px' }}
                />
            </Stack>
        </section>
    );
};

export default WatchCards;