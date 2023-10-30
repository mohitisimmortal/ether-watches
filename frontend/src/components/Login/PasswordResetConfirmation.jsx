import React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';

const PasswordResetConfirmation = () => {
    const navigate = useNavigate();
    
    return (
        <Container component="main" maxWidth="xs" style={{ height: '80vh' }}>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'black' }} ></Avatar>
                <Typography component="h1" variant="h5" style={{ color: 'white', textAlign: 'center' }}>
                    Password Reset Confirmation
                </Typography>
                <Typography variant="body2" style={{ marginTop: '16px', textAlign: 'center', color: 'white' }}>
                    An email with instructions to reset your password has been sent to your email address.
                    Please check your email inbox and follow the provided link to reset your password.
                </Typography>
                <Box sx={{ mt: 3 }}>
                    <button
                        className="globalbtn"
                        onClick={() => navigate('/login')}
                    >
                        Back to Login
                    </button>
                </Box>
            </Box>
        </Container>
    );
};

export default PasswordResetConfirmation;