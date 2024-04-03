import React, { useState, useEffect, useContext } from "react";
import { Container, Paper, Box, TextField, IconButton, InputAdornment, Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useParams, useLocation } from "react-router-dom";
import { useUserId } from "./user_id_context";

export default function ChangePassword() {
    const [message, setMessage] = useState('');
    const [failedMessage, setFailedMessage] = useState('');
    const [backgroundImage, setBackgroundImage] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { userId } = useUserId();

    const handlePasswordChange = () => {
        if (!currentPassword) {
            setFailedMessage('Current password is required.');
            return;
        } else if (!newPassword) {
            setFailedMessage('New password is required.');
            return;
        } else if (!confirmNewPassword) {
            setFailedMessage('Password confirmation is required.');
            return;
        }

        fetch(`http://localhost:8080/user/change?id=${userId}&newPassword=${newPassword}`, {
            method: "POST"
        })
        .then((res) => {
            if (res.ok) {
                setMessage("Password changed successfully. Use this password the next time you log in.");
            } else {
                setFailedMessage("An error occurred. Please try again.");
            }
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };
    
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword((prevShowConfirmPassword) => !prevShowConfirmPassword);
    };

    const fetchDynamicImage = () => {
        const dynamicImageURL = "https://fffuel.co/images/ffflux/ffflux-4.svg";
        setBackgroundImage(`url(${dynamicImageURL})`);
    };

    useEffect(() => {
        fetchDynamicImage();
    }, []);

    return (
        <Container style={{ display: "flex", justifyContent: "center", minHeight: "100vh", minWidth: "210vh", alignItems: "center", backgroundImage: backgroundImage, backgroundSize: "cover", backgroundPosition: "center" }}>
            <Paper elevation={3} style={{ padding: "50px 20px", width: 600, margin: "20px auto" }}>
                <Box sx={{ mb: 2 }}>
                    <h1 style={{ color: "black", textAlign: "center" }}><b>Change your Password</b></h1>
                </Box>
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1 },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField
                        id="current-password"
                        label="Current Password"
                        variant="outlined"
                        fullWidth
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <TextField
                        id="new-password"
                        label="New Password"
                        variant="outlined"
                        fullWidth
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
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
                        id="confirm-new-password"
                        label="Confirm New Password"
                        variant="outlined"
                        fullWidth
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
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
                    <Button variant="contained" onClick={handlePasswordChange}>Change Password</Button>
                    {failedMessage && <p style={{ color: "red", textAlign: "center" }}>{failedMessage}</p>}
                    {message && <p style={{ color: "green", textAlign: "center" }}>{message}</p>}
                </Box>
            </Paper>
        </Container>
    );
}
