import React from 'react';
import { Link } from 'react-router-dom';
import './myprofile.css'
import Cart from '../cartComponent/Cart';
import { userState } from '../../recoil/userAtom';
import { useRecoilValue } from 'recoil';

const MyProfile = () => {
  const user = useRecoilValue(userState);

  return (
    <section className="my-profile-container">
      <h3>{user.username}</h3>
      <p>{user.email}</p>
      <div className="profile-buttons">
        <Link to="/my-orders" className=" globalbtn">
          My Orders
        </Link>
        <Link to="/editprofile" className="globalbtn">
          Edit Profile
        </Link>
      </div>
      <div className="my-cart-section">
        <h3>My Cart</h3>
        <Cart />
      </div>
    </section>
  );
};

export default MyProfile;