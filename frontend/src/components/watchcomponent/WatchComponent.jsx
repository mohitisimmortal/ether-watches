import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './watchcomponent.css'
import { useNavigate, useParams } from 'react-router-dom';
import { productState } from '../../recoil/productAtom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { handleApiError, showSuccessNotification } from '../../reactToastify';
import { cartState } from '../../recoil/cartAtom';
import { userState } from '../../recoil/userAtom';
import baseUrl from '../../baseUrl';

const WatchComponent = () => {
    const [cartCount, setCartCount] = useState(0);
    const [products, setProducts] = useRecoilState(productState);
    const [cart, setCart] = useRecoilState(cartState);
    const navigate = useNavigate();
    const { id } = useParams();
    const [watch, setWatch] = useState(null);
    const userToken = localStorage.getItem('userToken');
    const [review, setReview] = useState("");
    const [rating, setRating] = useState(1);
    const userData = useRecoilValue(userState); // Get user data from Recoil

    const addToCart = () => {
        // If the user is not logged in, navigate to the login page
        if (!userToken) {
            navigate('/login');
            return;
        }

        // Find the product in the cart by its ID
        const productInCartIndex = cart.findIndex((item) => item._id === id);

        if (watch.stock > 0) {
            if (productInCartIndex !== -1) {
                // If the product is already in the cart, create a new copy of the cart
                // with the quantity increased by 1 for the found item
                const updatedCart = [...cart];
                updatedCart[productInCartIndex] = {
                    ...updatedCart[productInCartIndex],
                    quantity: updatedCart[productInCartIndex].quantity + 1
                };
                setCart(updatedCart);
                localStorage.setItem('cart', JSON.stringify(updatedCart));

            } else {
                // If the product is not in the cart, add it with a quantity of 1
                const itemToAdd = {
                    _id: id,
                    name: watch.name,
                    price: watch.price,
                    image: watch.imageUrl,
                    stock: watch.stock,
                    quantity: 1,
                };
                const updatedCart = [...cart, itemToAdd]
                setCart(updatedCart)
                localStorage.setItem('cart', JSON.stringify(updatedCart));
            }
            // Update the cart count (this is for display purposes)
            setCartCount(cartCount + 1);

            // Update the available stock
            setWatch((prevWatch) => ({
                ...prevWatch,
                stock: prevWatch.stock - 1,
            }));

            // Send a request to update stock in the database
            axios.put(`${baseUrl}/product/updatestock/${id}`, { stock: watch.stock - 1 },
                {
                    headers: {
                        Authorization: userToken,
                    }
                }
            )
                .then((response) => {
                    // Handle the response if needed
                })
                .catch((error) => {
                    handleApiError(error)
                });
            showSuccessNotification('Product added to cart');

        } else {
            alert('Product out of stock')
        }
    };

    const handleAddReview = () => {
        const newReview = {
            user: userData._id,
            name: userData.username,
            rating: parseInt(rating),  // Convert rating to integer
            comment: review
        };

        axios.post(`${baseUrl}/product/addreview/${id}`, newReview, {
            headers: {
                Authorization: userToken,
            }
        })
            .then(response => {
                setWatch(prevWatch => {
                    const updatedReviews = [...prevWatch.reviews];
                    const existingReviewIndex = prevWatch.reviews.findIndex(r => r.user === userData._id);

                    if (existingReviewIndex !== -1) {
                        updatedReviews[existingReviewIndex] = newReview;
                    } else {
                        updatedReviews.unshift(newReview);  // Add the new review to the beginning
                    }

                    // Calculate new average rating and number of reviews
                    const newAvgRating = (updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length).toFixed(1);
                    const newNumOfReviews = updatedReviews.length;

                    return {
                        ...prevWatch,
                        reviews: updatedReviews,
                        ratings: newAvgRating,
                        numOfReviews: newNumOfReviews
                    };
                });

                setReview("");
                setRating(1);
                showSuccessNotification('Review added successfully');
            })
            .catch(error => {
                handleApiError(error);
            });
    };

    useEffect(() => {
        // Check if the product is already in Recoil state
        const existingProduct = products.find((product) => product._id === id);
        if (existingProduct) {
            setWatch(existingProduct);
        } else {
            // Fetch the product details using Axios
            axios
                .get(`${baseUrl}/product/getsingle/${id}`)
                .then((response) => {
                    setWatch(response.data);
                })
                .catch((error) => {
                    handleApiError(error)
                    navigate('/');
                });
        }
    }, [id, products, navigate]);

    return (
        <section className="watch-container">
            {
                watch ? (
                    <>
                        <div className="watch-image">
                            <img src={watch.imageUrl} alt='WatchImage' />
                        </div>

                        <div className="watch-details">
                            <h2 style={{ textTransform: 'capitalize', marginTop: '30px' }}>{watch.name}</h2>
                            <p style={{ color: 'gray', marginBottom: '10px' }}>${watch.price.toFixed(2)}</p>
                            <div className="product-description">
                                {watch.description.split('\n').map((line, index) => (
                                    <React.Fragment key={index}>
                                        {line}
                                        <br />
                                    </React.Fragment>
                                ))}
                            </div>

                            <div className="watch-rating">
                                <span>Rating: {watch.ratings}</span>
                            </div>
                            <div className="watch-actions">
                                <button onClick={addToCart} className='globalbtn' >Add to Cart</button>
                                {/* <button className='globalbtn' >Buy Now</button> */}
                            </div>

                            <div className="add-review">
                                <h3>Add Your Review</h3>
                                <textarea value={review} onChange={(e) => setReview(e.target.value)} placeholder="Write your review" rows='8' style={{ padding: '10px' }}></textarea>
                                <label style={{ marginBottom: '5px' }}>
                                    Rating: <br />
                                    <select value={rating} onChange={(e) => setRating(e.target.value)} style={{ cursor: 'pointer' }}>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </select>
                                </label>
                                <button onClick={handleAddReview} className='globalbtn'>Submit Review</button>
                            </div>

                            <div className="latest-reviews">
                                <h3>Latest Reviews :</h3>
                                <ul>
                                    {watch.reviews.slice(0, 3).map((review, index) => (
                                        <li key={index}>
                                            <br />
                                            <strong style={{textTransform:'capitalize'}}>{review.name}</strong>: {review.comment} (Rating: {review.rating})
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </>
                ) : (
                    <p>Loading...</p>
                )
            }
        </section>
    );
};

export default WatchComponent;