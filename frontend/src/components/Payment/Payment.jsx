import React from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios'; // Add Axios for server communication
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil'; // Import useRecoilState
import { cartState } from '../../recoil/cartAtom'; // Import cartState
import baseUrl from '../../baseUrl';

const stripePromise = loadStripe('pk_test_51NNZZDSEFCFyra1SNSyMBOetGUzcgy2NNbCTnr0wRn9JgB9R577o2Xa9JRU1NBb3f3R61tELnPDRResL4aG1OQrM00XSzKB9js');

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const navigate = useNavigate();
  const [cart, setCart] = useRecoilState(cartState);
  const userToken = localStorage.getItem('userToken')
  const searchParams = new URLSearchParams(location.search);
  const totalPrice = searchParams.get('totalPrice');
  const { shippingInfo } = location.state || {};

  const cardStyle = {
    base: {
      color: 'white',
    },
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}/payment/create`, {
        amount: totalPrice * 100,
        currency: 'inr',
      });

      const { clientSecret } = response.data;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {},
        },
      });

      if (result.error) {
        console.error(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        // Move the order creation API call here
        const orderData = {
          items: cart.map(item => ({
            product: item._id,
            quantity: item.quantity,
            name: item.name,
            price: item.price,
          })),
          shippingInfo: {
            name: shippingInfo.name,
            address: shippingInfo.address,
            city: shippingInfo.city,
            postalCode: shippingInfo.postalCode,
            phoneNo: shippingInfo.phoneNo,
          },
        };

        const orderResponse = await axios.post(`${baseUrl}/order/createorder`, orderData,
          {
            headers: {
              Authorization: userToken,
            }
          });

        if (orderResponse.status === 201) {
          localStorage.removeItem('cart');
          setCart([]);
          navigate('/my-orders');
        }
      }
    } catch (error) {
      console.error('Error creating PaymentIntent:', error);
    }
  };

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <div style={{ border: '1px solid white', padding: '10px', marginBottom: '10px' }}>
          <CardElement options={{ style: cardStyle }} />
        </div>
        <button type="submit" disabled={!stripe} className="globalbtn">
          Pay ${totalPrice}
        </button>
      </form>
    </section>
  );
};

const Payment = () => {
  const location = useLocation();
  return (
    <Elements stripe={stripePromise}>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '80vh' }}>
        <PaymentForm />
      </div>
    </Elements>
  );
};

export default Payment;