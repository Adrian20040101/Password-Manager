import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {Container, Paper, Button, InputAdornment, IconButton} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import '../App.css';
import { useUserId } from './user_id_context';

export default function LoginPage() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [backgroundImage, setBackgroundImage] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [loginMessage, setLoginMessage] = React.useState('');
    const [error, setError] = React.useState('');
    const history = useHistory();
    const { setUserId } = useUserId();

    const fetchDynamicImage = () => {
        const dynamicImageURL = 'https://fffuel.co/images/ffflux/ffflux-4.svg'
        setBackgroundImage(`url(${dynamicImageURL})`);
    };

    React.useEffect(() => {
        fetchDynamicImage();
    }, []);

    const paperStyle={padding:'50px 20px', width:600, margin:'20px auto'};

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleClick = async (e) => {
    e.preventDefault();
    
    if (!username) {
        setError('Username required.');
        return;
    }

    if (!password) {
        setError('Password required');
        return;
    }

    try {
        const user = { username, password };
        const response = await fetch('http://localhost:8080/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });

        if (response.ok) {
            const userId = await response.json();
            setUserId(parseInt(userId));
            console.log(userId);
            console.log (typeof userId);
            history.push(`/manage-passwords?userId=${userId}`, { username });
        } else if (response.status === 401) {
            setError('Invalid credentials. Please try again.');
        } else if (response.status === 404) {
            setError('User does not exist. Sign up if you are new.');
        } else if (response.status === 409) {
            setError('Someone is already logged in. Log out first to continue.');
        } else if (response.status === 500) {
            setError('Failed to log in. Please try again.');
        } else {
            setError('An unexpected error occurred.');
        }
    } catch (error) {
        console.error('An error occurred: ', error);
        setError('An unexpected error occurred.');
    }
};

  
  

  return (
    <Container style = {{display: 'flex', justifyContent: 'center', minHeight: '100vh', minWidth: '210vh', alignItems: 'center', backgroundImage:backgroundImage, backgroundSize: 'cover', backgroundPosition: 'center'}}>
    <Paper elevation={3} style={paperStyle}>
    <Box sx = {{mb: 2}}>
    <h1 style={{color:"black", textAlign: 'center'}}><b>Login</b></h1>
    </Box>
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1 },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField id="username" label="Username" variant="outlined" fullWidth
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      />
      <TextField id="password" label="Password" variant="outlined" fullWidth
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
      <Button variant="contained" onClick={handleClick}>Submit</Button>
      <Link to="/signup" style={{ textDecoration: 'none' }}>
            <Button variant="contained">Sign Up</Button>
          </Link>
      <Link to="/reset" style={{textDecoration: 'none'}}><u> Forgot your password? </u></Link>
    </Box>
    {error && !loginMessage && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

    </Paper>
    </Container>
  );
}
