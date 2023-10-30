import React from 'react';
import './header.css';
import Search from '../Search/Search';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userLoggedInState, userState } from '../../recoil/userAtom'; // Import userState
import { isAdminState } from '../../recoil/adminAtom'; // Import isAdminState for checking admin status

const Header = () => {
    const navigate = useNavigate();
    const userIsLoggedIn = useRecoilValue(userLoggedInState);
    const isAdmin = useRecoilValue(isAdminState); // Get admin status from Recoil state

    return (
        <header>
            <div>
                <div onClick={() => navigate('/')}>
                    <a href='#' className='logo josefin-font'>
                        Ether Watches
                    </a>
                </div>
                <Search />
                {userIsLoggedIn ? (
                    <button
                        className='myprofilebtn globalbtn'
                        onClick={() => navigate(isAdmin ? '/dashboard' : '/myprofile')} // Navigate to Dashboard if isAdmin is true, otherwise My Profile
                    >
                        {isAdmin ? 'Dashboard' : 'My Profile'}
                    </button>
                ) : (
                    <button className='loginbtn globalbtn' onClick={() => navigate('/login')}>
                        Login
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;