import React, { useState } from 'react';
import { createBrowserHistory } from 'history'; 
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {Container, Paper, Button, InputAdornment, IconButton} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function SignupPage() {
    const history = createBrowserHistory(); 
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [backgroundImage, setBackgroundImage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordFilled] = useState(false);
    const [signupMessage, setSignupMessage] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError('Username and password are required.');
            return;
        }
        
        if (password && !confirmPassword) {
            setError('Confirm your password.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

         try {
            const response = await fetch('http://localhost:8080/user/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            if (response.status === 200) {
                setSignupMessage('Sign Up successful! Return to the login page.');
                history.push('/'); 
            } else if (response.status === 400) {
                setError('A user with that username already exists. Please choose a new one.');
            } else if (response.status === 406) {
                setError('Password does not meet the minimum requirements.');
            } else {
                setError('Signup failed.');
            }
        } catch (error) {
            console.error('Error during signup:', error);
            setError('An unexpected error occurred.');
        }
    };

    const fetchDynamicImage = () => {
        const dynamicImageURL = 'https://fffuel.co/images/ffflux/ffflux-4.svg'
        setBackgroundImage(`url(${dynamicImageURL})`);
    };

    const paperStyle={padding:'50px 20px', width:600, margin:'20px auto'};

    React.useEffect(() => {
        fetchDynamicImage();
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword((prevConfirmShowPassword) => !prevConfirmShowPassword);
    };


    return (
        <Container style = {{display: 'flex', justifyContent: 'center', minHeight: '100vh', minWidth: '210vh', alignItems: 'center', backgroundImage:backgroundImage, backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <Paper elevation={3} style={paperStyle}>
        <Box sx = {{mb: 2}}>
        <h1 style={{color:"black", textAlign: 'center'}}><b>Sign Up</b></h1>
        </Box>
        <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1 },
      }}
      noValidate
      autoComplete="off"
        >

      <h2 style={{textAlign : 'left', fontSize : 'smaller', fontWeight : 'normal'}}>Password Requirements:</h2>
      <ul style={{textAlign : 'left', fontSize : 'smaller', fontWeight : 'normal', paddingLeft: '16px' }}>
        <li>At least 8 characters long</li>
        <li>Must contain at least one digit</li>
        <li>Must contain at least one capital letter</li>
        <li>Must contain at least one special character from the following: *&^!?/.' </li>
      </ul>
      <TextField id="standard-basic" label="Username" variant="outlined" fullWidth
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      />
      <TextField id="standard-basic" label="Password" variant="outlined" fullWidth
      value={password}
      type={showPassword ? 'text' : 'password'}
      onChange={(e) => setPassword(e.target.value)}
      InputProps={{
        endAdornment: (
            <InputAdornment position="end">
                <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
            </InputAdornment>
            ),
        }}
      />
      <TextField
        id="standard-basic"
        label="Confirm Password"
        variant="outlined"
        fullWidth
        value={confirmPassword}
        type={showConfirmPassword ? 'text' : 'password'}
        onChange={(e) => setConfirmPassword(e.target.value)}
        disabled={!password}
        InputProps={{
        endAdornment: (
            <InputAdornment position="end">
                <IconButton onClick={toggleConfirmPasswordVisibility} edge="end">
                    {showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
            </InputAdornment>
            ),
        }}
      />

      {passwordFilled && !confirmPassword && <p style={{ color: 'red' }}>Please confirm your password</p>}
      <Link to="/signup" style={{ textDecoration: 'none' }}>
            <Button variant="contained" onClick={handleSignup}>Sign Up</Button>
      </Link>
      <Link to={"/"}>Already have an account?</Link>
        </Box>
        {error && !signupMessage && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        {signupMessage && <p style={{ color: 'green', textAlign: 'center' }}>{signupMessage}</p>} 
    </Paper>
    </Container>
    );
}
