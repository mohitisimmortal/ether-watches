import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import './signup.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { userLoggedInState, userState } from '../../recoil/userAtom';
import { handleApiError } from '../../reactToastify';
import { isAdminState } from '../../recoil/adminAtom';
import baseUrl from '../../baseUrl';

export default function SignUp({ isAdminSignup }) {
  const navigate = useNavigate()
  const [user, setUser] = useRecoilState(userState); // Use the Recoil user state
  const [userLoggedIn, setUserLoggedIn] = useRecoilState(userLoggedInState);
  const setIsAdmin = useSetRecoilState(isAdminState)

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    try {
      const response = await axios.post(`${baseUrl}/user/signup`, {
        username: data.get('username'),
        email: data.get('email'),
        password: data.get('password'),
        role: isAdminSignup ? 'admin' : 'user', // Set the role based on isAdminSignup
      });

      // Update the user state with the received token and other user info
      setUser({
        userToken: response.data.userToken,
        username: data.get('username'),
        email: data.get('email'),
        role: response.data.role,
      });

      setIsAdmin(response.data.role === 'admin');
      localStorage.setItem('userToken', response.data.userToken);
      setUserLoggedIn(true);

      // Conditionally navigate based on isAdminSignup flag
      if (isAdminSignup) {
        navigate('/dashboard'); // Navigate to the admin dashboard
      } else {
        navigate('/myprofile'); // Navigate to the user profile
      }
    } catch (error) {
      handleApiError(error)
    }
  }

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
        <Avatar sx={{ m: 1, bgcolor: 'black' }}>
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} >
              <TextField
                autoComplete="given-name"
                name="username"
                required
                fullWidth
                id="username"
                label="Username"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            style={{ background: 'black' }}
          >
            {isAdminSignup ? 'Admin SignUp' : 'Sign Up'}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <a href="#" className='a-1' variant="body2" onClick={() => { isAdminSignup ? navigate('/adminlogin') : navigate('/login') }}>
                Already have an account? Sign in
              </a>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}