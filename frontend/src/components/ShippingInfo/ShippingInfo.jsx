import React, { useEffect, useState } from 'react';
import { cartState } from '../../recoil/cartAtom';
import { useRecoilState } from 'recoil';
import './ShippingInfo.css';
import { useNavigate } from 'react-router-dom';

const ShippingInfo = () => {
  const [cart, setCart] = useRecoilState(cartState);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    phoneNo: '',
  });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart'));
    if (savedCart) {
      setCart(savedCart);
    }
  }, [setCart]);

  useEffect(() => {
    const newTotalPrice = cart.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);
    setTotalPrice(newTotalPrice);
  }, [cart]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert('Your cart is empty. Please add items to your cart before placing an order.');
      return;
    }

    navigate(`/payment?totalPrice=${totalPrice}`, {
      state: { shippingInfo },
    });
  };

  return (
    <section className="shipping-info-container">
      <h2 style={{ marginBottom: '10px' }}>Finish Your Order</h2>
      <div className="order-summary">
        <h3>Order Summary</h3>
        <ul>
          {cart.map((item) => (
            <li key={item._id}>
              {item.name} - {item.quantity} - ${item.price * item.quantity}
            </li>
          ))}
        </ul>
        <p>Total: ${totalPrice}</p>
      </div>
      <form onSubmit={handleSubmit} className="shipping-form">
        <h3>Shipping Information</h3>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={shippingInfo.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={shippingInfo.address}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>City:</label>
          <input
            type="text"
            name="city"
            value={shippingInfo.city}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Postal Code:</label>
          <input
            type="number"
            name="postalCode"
            value={shippingInfo.postalCode}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Phone Number:</label>
          <input
            type="number"
            name="phoneNo"
            value={shippingInfo.phoneNo}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="globalbtn" style={{ marginTop: '1rem' }}>
          Continue to Payment
        </button>
      </form>
    </section>
  );
};

export default ShippingInfo;