import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useRecoilState } from "recoil";
import { isAdminState } from "./recoil/adminAtom";
import { userLoggedInState, userState } from "./recoil/userAtom";
import 'react-toastify/dist/ReactToastify.css';
import baseUrl from "./baseUrl";
import Homepage from './components/Homepage/Homepage';
import Nopage from './components/Nopage/Nopage';
import Footer from "./components/Footer/Footer";
import WatchComponent from "./components/watchcomponent/WatchComponent";
import MyProfile from "./components/myprofile/MyProfile";
import EditProfile from "./components/myprofile/EditProfile";
import WatchCards from "./components/watchcards/WatchCards";
import Header from "./components/Header/Header";
import ForgotPassword from "./components/Login/ForgotPassword";
import PasswordResetConfirmation from "./components/Login/PasswordResetConfirmation";
import NewPassword from "./components/Login/NewPassword";
import AdminLogin from "./components/ADMIN/Login/AdminLogin";
import AdminSignup from "./components/ADMIN/Login/AdminSignup";
import UserSignup from "./components/Signup/UserSignup";
import Dashboard from "./components/ADMIN/Dashboard/Dashboard";
import UserLogin from "./components/Login/UserLogin";
import axios from "axios";
import ShippingInfo from "./components/ShippingInfo/ShippingInfo";
import Payment from "./components/Payment/Payment";
import MyOrders from "./components/MyOrders/MyOrders";
import CollectionDetails from "./components/collections/CollectionDetails";
import AllOrders from "./components/ADMIN/Dashboard/AllOrders";

function App() {
  const [isAdmin, setIsAdmin] = useRecoilState(isAdminState);
  const [userLoggedIn, setUserLoggedIn] = useRecoilState(userLoggedInState);
  const [user, setUser] = useRecoilState(userState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isProduction = process.env.IS_PRODUCTION;

  // Fetch user data when the component mounts
  useEffect(() => {
    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
      // Handle the case where the user is not logged in or has no token
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const headers = {
          Authorization: userToken,
        };
        const response = await axios.get(`${baseUrl}/user/profile`, { headers });
        const userData = response.data;

        setUser({
          userToken,
          username: userData.username,
          email: userData.email,
          role: userData.role,
          _id: userData._id
        });

        setUserLoggedIn(true);
        setIsAdmin(userData.role === 'admin');
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchUserData();

    // Cleanup the effect
    return () => {
      if (setUserLoggedIn) setUserLoggedIn(false);
      if (setIsAdmin) setIsAdmin(false);
    };
  }, [setUser, setUserLoggedIn, setIsAdmin]);

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <ToastContainer theme="dark" position="top-right" autoClose={3000} />
      <BrowserRouter>
        <Header />
        <Routes>

          {/* USER ROUTES -- */}
          {userLoggedIn ? (
            // user-protected-routes 
            <>
              <Route path="/myprofile" element={<MyProfile />} />
              <Route path="/editprofile" element={<EditProfile />} />
              <Route path="/shippinginfo" element={<ShippingInfo />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/payment" element={<Payment />} />
            </>
          ) : null}

          {/* // user-non-protected-routes  */}
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/signup" element={<UserSignup />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/password-reset-confirmation" element={<PasswordResetConfirmation />} />
          <Route path="/reset-password" element={<NewPassword />} />
          <Route path="/watch/:id" element={<WatchComponent />} />
          <Route path="/collection/:collectionname" element={<CollectionDetails />} />
          <Route path="/watches" element={<WatchCards />} />

          {/* ADMIN ROUTES -- */}
          {isAdmin ? (
            // admin-protected-routes 
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/allorders" element={<AllOrders />} />
            </>
          ) : null}

          {/* // admin-non-protected-routes  */}
          <Route path="/adminlogin" element={<AdminLogin />} />
          {/* anyone can setup code locally and made a admin in their local machine(not on main codebase as they haven't access to real database) */}
          {!isProduction && <Route path="/adminsignup" element={<AdminSignup />} />}

          <Route path="*" element={<Nopage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
