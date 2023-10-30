import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import baseUrl from '../../baseUrl';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Send a password reset email to the provided email address.
      // Replace 'YOUR_API_ENDPOINT' with the actual endpoint of your backend API.
      await axios.post(`${baseUrl}/user/request-password-reset`, {
        email,
      });

      // Set a flag to indicate that the email has been sent successfully.
      setIsEmailSent(true);

      // Redirect the user to a confirmation page.
      navigate('/password-reset-confirmation');
    } catch (error) {
      console.error('Error sending password reset email:', error);
    }
  };

  return (
    <Container component="main" maxWidth="xs" style={{ height: '80vh' }}>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'black' }}></Avatar>
        <Typography component="h1" variant="h5">
          Forgot Password
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            style={{ background: 'black' }}
          >
            Send Reset Link
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <a
                href="#"
                variant="body2"
                onClick={() => navigate('/login')}
                style={{ color: 'black', textDecoration: 'underline' }}
              >
                Remember your password? Log in
              </a>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPassword;