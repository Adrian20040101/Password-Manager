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
    const [failedMessage, setFailedMessage] = useState('');
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


    const handlePasswordReset = (e) => {
        e.preventDefault();

        if (!newPassword || !confirmNewPassword) {
            setFailedMessage('Please fill in both password fields.');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setFailedMessage('Passwords do not match.');
            return;
        }

        const formData = new FormData();
        formData.append('id', userId);
        formData.append('newPassword', newPassword);

        console.log(token);
        console.log(userId);

        fetch("http://localhost:8080/user/change", {
            method: "POST",
            body: formData
        })
        .then((res) => {  
            if (res.ok) {
                setMessage("Password has been successfully changed. You may return to the login page.");
            } else {
                setFailedMessage("An error occurred. Please try again.");
            }
        })
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
                {failedMessage && <p style={{ color: 'red', textAlign: 'center' }}>{failedMessage}</p>}
                {message && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>}
            </Paper>
        </Container>
  );
}
