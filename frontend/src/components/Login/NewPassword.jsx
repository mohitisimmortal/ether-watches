import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { handleApiError } from '../../reactToastify';
import baseUrl from '../../baseUrl';

const NewPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [newPassword, setNewPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const token = new URLSearchParams(location.search).get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send a request to your backend to update the password
            await axios.post(`${baseUrl}/user/reset-password`, {
                token,
                newPassword,
            });
            // Password reset successful, redirect the user to the login page
            navigate('/login');
        } catch (error) {
            // Handle the error and display an error message
            handleApiError(error)
            setErrorMessage('Password reset failed. Please try again.');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} style={{ color: 'white', height: '80vh' }}>
                <section style={{ paddingBottom: '0' }}>
                    <h2 style={{ color: 'white', marginBottom: '1rem' }}>Set a New Password</h2>
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    <label htmlFor="newPassword" style={{ display: 'block' }}>New Password:</label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        style={{ height: '20px', marginTop: '.3rem', padding: '.3rem' }}
                    />
                </section>
                <section style={{ paddingTop: '1rem' }}>
                    <button type="submit" className='globalbtn'>Submit</button>
                </section>
            </form>
        </div>
    );
};

export default NewPassword;