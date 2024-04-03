import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Container, Paper, Box } from '@mui/material';

export default function ResetPasswordPage() {
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [failedMessage, setFailedMessage] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [backgroundImage, setBackgroundImage] = React.useState('');

// implement a method in the back end to check if a user is existent in the db, and connect it to this part to be able to throw an error
// if the username doesn't exist in the db

  const sendEmail = (e) => {
    e.preventDefault();

    if (!username) {
      setFailedMessage('Please enter your username.');
      return;
    }

    if (!email) {
      setFailedMessage('Please enter your email.');
      return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    
    fetch("http://localhost:8080/reset/passwordReset", {
          method: "POST",
          body: formData
    })
    .then((res) => {  
      if (res.ok) {
          setMessage("Password Reset Link sent! Check your email.");
      } else {
          setFailedMessage("An error occurred. Email could not be sent.");
      }
  })

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
      {failedMessage && !message && <p style={{ color: 'red', textAlign: 'center' }}>{failedMessage}</p>}
      {message && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>}
      </Paper>
    </Container>
  );
}
