import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Container, Paper, Button, InputAdornment, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function ResetPassword() {
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [backgroundImage, setBackgroundImage] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordFilled] = useState(false);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const tokenAndUserId = searchParams.get('token');
    const [token, userIdString] = tokenAndUserId ? tokenAndUserId.split('/') : ['', ''];
    const userId = userIdString ? parseInt(userIdString) : null;


    const handlePasswordReset = async (e) => {
        e.preventDefault();

        if (!newPassword || !confirmNewPassword) {
            setError('Please fill in both password fields.');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('id', userId);
            formData.append('newPassword', newPassword);

            const response = await fetch("http://localhost:8080/user/reset", {
                method: "POST",
                body: formData
            })
            
            if (response.status === 200) {
                setMessage('Password changed successfully.');
            } else if (response.status === 406) {
                setError('New password does not meet minimum requirements.');
            } else if (response.status === 403) {
                setError('This session either expired or has been solved. Create a new session if you want to change your password.');
            } else if (response.status === 500) {
                setError('Password could not be changed. Please try again.');
            }
        } catch (error) {
            console.error('Error during reset process:', error);
            setError('An unexpected error occurred.');
        }
    };

    const paperStyle = { padding: '50px 20px', width: 600, margin: '20px auto' };

    const fetchDynamicImage = () => {
        const dynamicImageURL = 'https://fffuel.co/images/ffflux/ffflux-4.svg';
        setBackgroundImage(`url(${dynamicImageURL})`);
    };

    useEffect(() => {
        fetchDynamicImage();
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };
    
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword((prevShowConfirmPassword) => !prevShowConfirmPassword);
    };

    return (
        <Container style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', minWidth: '210vh', alignItems: 'center', backgroundImage: backgroundImage, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <Paper elevation={3} style={paperStyle}>
                <Box sx={{ mb: 2 }}>
                    <h1 style={{ color: "black", textAlign: 'center' }}><b>Password Reset</b></h1>
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

                    <TextField id="standard-basic" label="Password" variant="outlined" fullWidth
                    value={newPassword}
                    type={showPassword ? 'text' : 'password'}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                        value={confirmNewPassword}
                        type={showConfirmPassword ? 'text' : 'password'}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        disabled={!newPassword}
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
                    {passwordFilled && !confirmNewPassword && <p style={{ color: 'red' }}>Please confirm your password</p>}
                    <Button variant="contained" onClick={handlePasswordReset}>Reset Password</Button>
                </Box>
                {error && !message && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                {message && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>}
            </Paper>
        </Container>
  );
}
