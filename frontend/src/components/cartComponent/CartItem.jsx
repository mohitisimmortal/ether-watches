import React, { useState } from 'react';
import './Cart.css';
import axios from 'axios';
import baseUrl from '../../baseUrl';

const CartItem = ({ id, name, price, image, quantity, stock, onUpdateQuantity, onRemove }) => {
    const [itemQuantity, setItemQuantity] = useState(quantity);
    const userToken = localStorage.getItem('userToken');

    const updateStockInDatabase = async (newQuantity) => {
        try {
            // Make an API request to update the stock in the database
            await axios.put(`${baseUrl}/product/updatestock/${id}`,
                {
                    stock: newQuantity,
                },
                {
                    headers: {
                        Authorization: userToken,
                    }
                });

            // Now, you can call onUpdateQuantity to update the local state with the new quantity
            onUpdateQuantity(id, newQuantity);
        } catch (error) {
            console.error('Failed to update stock in the database:', error);
        }
    };

    const handleIncrement = (stock) => {
        if (itemQuantity < stock) {
            const updatedQuantity = itemQuantity + 1;
            setItemQuantity(updatedQuantity);
            updateStockInDatabase(updatedQuantity);
        }
    };

    const handleDecrement = () => {
        if (itemQuantity > 1) {
            const updatedQuantity = itemQuantity - 1;
            setItemQuantity(updatedQuantity);
            updateStockInDatabase(updatedQuantity);
        }
    };

    const handleRemove = () => {
        const quantityToRemove = itemQuantity;

        // Make an API request to increment the stock in the database
        axios
            .put(`${baseUrl}/product/updatestock/${id}`, {
                stock: quantityToRemove,
            }, {
                headers: {
                    Authorization: userToken,
                },
            })
            .then((response) => {
                const updatedStock = response.data.stock;

                // Now, you can call the onRemove function to remove the item from the cart
                onRemove(id);
            })
            .catch((error) => {
                console.error('Failed to update stock in the database:', error);
            });
    };

    return (
        <div className="cart-item">
            <img src={image} alt={name} className="cart-item-image" />
            <div className="cart-item-details">
                <h3>{name}</h3>
                <p>${price.toFixed(2)}</p>
            </div>
            <div className="cart-item-quantity">
                <button onClick={handleDecrement} >-</button>
                <span>{itemQuantity}</span>
                <button onClick={() => handleIncrement(stock)}>+</button>
            </div>
            <button className="cart-item-delete" onClick={handleRemove}>
                Delete
            </button>
        </div>
    );
};

export default CartItem;