import * as React from 'react';
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
import { useRecoilState, useSetRecoilState } from 'recoil';
import { userLoggedInState, userState } from '../../recoil/userAtom';
import { handleApiError } from '../../reactToastify';
import { isAdminState } from '../../recoil/adminAtom';
import baseUrl from '../../baseUrl';

export default function Login({ isAdminLogin }) {
  const navigate = useNavigate();
  const [user, setUser] = useRecoilState(userState);
  const [userLoggedIn, setUserLoggedIn] = useRecoilState(userLoggedInState); // Add this line
  const setIsAdmin = useSetRecoilState(isAdminState); // Add this line

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    try {
      const response = await axios.post(`${baseUrl}/user/login`, {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
      });

      // Update the user state with the received token and other user info
      setUser({
        userToken: response.data.userToken,
        username: formData.get('username'),
        email: formData.get('email'),
        role: response.data.role,
      });

      setIsAdmin(response.data.role === 'admin');

      localStorage.setItem('userToken', response.data.userToken);
      setUserLoggedIn(true);

      // Redirect the user after successful login
      if (isAdminLogin) {
        navigate('/dashboard'); // Navigate to the admin dashboard
      } else {
        navigate('/myprofile'); // Navigate to the user profile
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <Container component="main" maxWidth="xs" style={{ minHeight: '80vh' }}>
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
          Log in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="name"
            autoFocus
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            style={{ background: 'black' }}
          >
            {isAdminLogin ? 'Admin LogIn' : 'Log In'}
          </Button>
          <Grid container>
            <Grid item xs>
              <a href="#" variant="body2" style={{ color: 'black', textDecoration: 'underline' }} onClick={() => { navigate('/forgotpassword') }}>
                Forgot password?
              </a>
            </Grid>
            <Grid item>
              <a href="#"
                variant="body2"
                onClick={() => { isAdminLogin ? navigate('/adminsignup') : navigate('/signup') }}
                style={{ color: 'black', textDecoration: 'underline' }}>
                {"Don't have an account? Sign Up"}
              </a>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}