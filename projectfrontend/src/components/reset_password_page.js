import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Container, Paper, Box } from '@mui/material';

export default function ResetPasswordPage() {
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [backgroundImage, setBackgroundImage] = React.useState('');

  const sendEmail = async (e) => {
    e.preventDefault();

    if (!username) {
      setError('Please enter your username.');
      return;
    }

    if (!email) {
      setError('Please enter your email.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      
      const response = await fetch("http://localhost:8080/reset/passwordReset", {
            method: "POST",
            body: formData
      })
      
      if (response.status === 200) {
          setMessage('Password Reset Link sent! Check your email and follow the instructions.');
      } else if (response.status === 400) {
          setError('You already have a pending reset request in your email. Wait 10 minutes before requesting another reset request.');
      } else if (response.status === 404) {
          setError('User was not found in the database.');
      } else if (response.status === 500) {
          setError('Link could not be sent. Please try again.');
      } 
    } catch (error) {
        console.error('Error during reset process:', error);
        setError('An unexpected error occurred.');
    }
  };

  const paperStyle={padding:'50px 20px', width:600, margin:'20px auto'};

  const fetchDynamicImage = () => {
    const dynamicImageURL = 'https://fffuel.co/images/ffflux/ffflux-4.svg'
    setBackgroundImage(`url(${dynamicImageURL})`);
  };

React.useEffect(() => {
    fetchDynamicImage();
  }, []);

  return (
    <Container style = {{display: 'flex', justifyContent: 'center', minHeight: '100vh', minWidth: '210vh', alignItems: 'center', backgroundImage:backgroundImage, backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <Paper elevation={3} style={paperStyle}>
      <Box sx = {{mb: 2}}>
        <h1 style={{color:"black", textAlign: 'center'}}><b>Password Reset</b></h1>
        </Box>
        <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1 },
      }}
      noValidate
      autoComplete="off"
        >
      <h2 style={{textAlign : 'left', fontSize : 'smaller', fontWeight : 'normal'}}>Enter your username and the email you want to receive the password reset link in.</h2>
      <TextField
        id="username-input"
        label="Username"
        value={username}
        fullWidth
        onChange={(e) => setUsername(e.target.value)}
      />

      <TextField
        id="email-input"
        label="Email"
        value={email}
        fullWidth
        onChange={(e) => setEmail(e.target.value)}
      />

      <Button variant="contained" onClick={sendEmail}>
        Send Link
      </Button>
      </Box>
      {error && !message && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {message && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>}
      </Paper>
    </Container>
  );
}
