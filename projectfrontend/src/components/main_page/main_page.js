import React, { useState, useEffect, useContext } from 'react';
import { Container, Paper, IconButton, Button, TextField, Icon, InputAdornment, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useLocation } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import UserIdContext, { useUserId } from '../user_id_context';

export default function MainPage() {
    const [passwords, setPasswords] = useState([]);
    const [showPasswords, setShowPasswords] = useState([]);
    const [showAddPasswordFields, setShowAddPasswordFields] = useState(false);
    const [showAddPassword, setShowAddPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showUpdatePasswordFields, setShowUpdatePasswordFields] = useState(false);
    const [showUpdatePassword, setShowUpdatePassword] = useState(false);
    const [showConfirmUpdatePassword, setShowConfirmUpdatePassword] = useState(false);
    const [error, setError] = useState('');
    const [addPassword, setAddPassword] = useState({ website: '', password: '' });
    const [addMessage, setAddMessage] = useState('');
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [deleteOutcomeOpen, setDeleteOutcomeOpen] = useState(false);
    const [passwordToDelete, setPasswordToDelete] = useState(null);
    const [errorAddMessage, setErrorAddMessage] = useState('');
    const [updateMessage, setUpdateMessage] = useState('');
    const [errorUpdateMessage, setErrorUpdateMessage] = useState('');
    const [deleteMessage, setDeleteMessage] = useState('');
    const [errorDeleteMessage, setErrorDeleteMessage] = useState('');
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const userIdString = searchParams.get('userId');
    const userId = parseInt(userIdString);
    const username = location.state.username;

    useEffect(() => {
        fetchPasswords();
    }, [userId]);

    const fetchPasswords = async () => {
        if (!userId) {
            console.error('No userId found in the URL');
            return;
        }
        
        try {
            const response = await fetch(`http://localhost:8080/password/retrieveAll?id=${userId}`);
            if (response.status === 200) {
                const data = await response.json();
                setPasswords(data);
                setShowPasswords(Array(data.length).fill(false));
            } else if (response.status === 404) {
                setError('User was not found in the database.');
            }
        } catch (error) {
            console.error('Error during password retrieval:', error);
            setError('An unexpected error occurred.');
        }
    };

    const togglePasswordVisibility = index => {
        setShowPasswords(prevShowPasswords => {
            const newShowPasswords = [...prevShowPasswords];
            newShowPasswords[index] = !newShowPasswords[index];
            return newShowPasswords;
        });
    };

    const toggleAddPasswordFields = () => {
        setShowAddPasswordFields(prevShowNewPasswordFields => !prevShowNewPasswordFields);
    };

    const toggleAddPasswordVisibility = () => {
        setShowAddPassword((prevShowAddPassword) => !prevShowAddPassword);
    };

    const toggleUpdatePasswordFields = (passwordId) => {
        setShowUpdatePasswordFields(prevState => ({...prevState, [passwordId]: !prevState[passwordId]}));
    };

    const toggleUpdatePasswordVisibility = () => {
        setShowUpdatePassword((prevShowUpdatePassword) => !prevShowUpdatePassword);
    };

    const toggleConfirmUpdatePasswordVisibility = () => {
        setShowConfirmUpdatePassword((prevShowConfirmUpdatePassword) => !prevShowConfirmUpdatePassword);
    };

    const openDeleteConfirmation = (passwordId) => {
        setPasswordToDelete(passwordId);
        setDeleteConfirmationOpen(true);
    };

    const handleDeletionConfirmation = async () => {
        try {
            const response = await fetch(`http://localhost:8080/password/deletePassword?userId=${userId}&passwordId=${passwordToDelete}`, {
                method: 'DELETE'
            })
            if (response.status === 200) {
                setDeleteMessage('Password deleted successfully.');
            } else if (response.status === 404) {
                const data = await response.text();
                if (data === 'Password not found') {
                    setErrorDeleteMessage('Password was not found in the database.');
                } else if (data === 'User not found') {
                    setErrorDeleteMessage('User was not found in the database.');
                }
            } else if (response.status === 500) {
                setErrorDeleteMessage('Password deletion failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during deletion process:', error);
            setError('An unexpected error occurred.');
        } finally {
            setDeleteConfirmationOpen(false);
            setDeleteOutcomeOpen(true);
        }
    };

    const handleCancelDelete = () => {
        setDeleteConfirmationOpen(false);
    };

    const handleDeleteOutcomeClose = () => {
        setDeleteOutcomeOpen(false);
    };


    // TODO - handle double submition problem (i.e. to not be able to add a password for the same website after creating a password entry
    // by pressing the submit button multiple times)
    const handleSubmitAddPassword = async () => {
        if (!addPassword.website || !addPassword.password) {
            setErrorAddMessage("Website and Password are required.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('id', userId);
            formData.append('website', addPassword.website)
            formData.append('password', addPassword.password);

            const response = await fetch("http://localhost:8080/password/savePassword", {
                method: "POST",
                body: formData
            })
            
            if (response.status === 200) {
                setAddMessage('Password added successfully.');
            } else if (response.status === 404) {
                setErrorAddMessage('User was not found in the database.');
            } else if (response.status === 500) {
                setErrorAddMessage('Password addition failed. Please try again.')
            }
        } catch (error) {
            console.error('Error during addition process:', error);
            setError('An unexpected error occurred.');
        } 
    };


    const changeWebsitePassword = async (id) => {
        if (!newPassword) {
            setErrorUpdateMessage('New password required.');
            return;
        } else if (!confirmNewPassword) {
            setErrorUpdateMessage('Password Confirmation required.');
            return;
        } else if (newPassword !== confirmNewPassword) {
            setErrorUpdateMessage('Passwords do not match.');
            return;
        }

        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('passwordId', id);
        formData.append('newPassword', newPassword);

        try {
            const response = await fetch('http://localhost:8080/password/changePassword', {
                method: "POST",
                body: formData
            })
            
            if (response.status === 200) {
                setUpdateMessage('Password changed successfully.');
            } else if (response.status === 404) {
                const data = await response.text();
                if (data === 'Password not found.') {
                    setErrorUpdateMessage('Password was not found in the database.');
                } else if (data === 'User not found.') {
                    setErrorUpdateMessage('User was not found in the database.');
                }
            } else if (response.status === 500) {
                setErrorUpdateMessage('Password change failed. Please try again.');
            }
        } catch {
            console.error('Error during password change process:', error);
            setError('An unexpected error occurred.');
        }
    };

    return (
        <Container>
            <div style={{ textAlign: 'left', fontSize: 'large' }}>
                <h1>Welcome back, {username}!</h1>
            </div>
            {passwords.map((password, index) => (
                <Paper key={index} elevation={3} style={{ padding: '20px', marginBottom: '10px' }}>
                    <h2 style={{ fontSize: '16px', textAlign: 'left' }}>Website: {password.website}</h2>
                    <h2 style={{ fontSize: '16px', textAlign: 'left' }}>
                        Password: {showPasswords[index] ? password.storedPassword : '•••••••••••••••••••••'}
                    </h2>
                    <Tooltip title={showPasswords[index] ? 'Hide Password' : 'Show Password'}>
                        <IconButton sx={{ marginRight: '350px', float: 'right', marginTop: '-60px' }} onClick={() => togglePasswordVisibility(index)} edge="end">
                            {showPasswords[index] ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={'Change Password'}>
                        <IconButton sx={{ marginRight: '200px', float: 'right', marginTop: '-60px' }} edge="end" onClick={() => toggleUpdatePasswordFields(password.id)}>
                            <ChangeCircleIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={'Delete'}>
                        <IconButton sx={{ marginRight: '50px', float: 'right', marginTop: '-60px' }} edge="end" onClick={() => openDeleteConfirmation(password.id)}>
                            <DeleteForeverIcon />
                        </IconButton>
                    </Tooltip>

                    {showUpdatePasswordFields[password.id] && (
                        <div>
                            <TextField
                                name="new-password"
                                label="New Password"
                                variant="outlined"
                                fullWidth
                                type={showUpdatePassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                style={{ marginBottom: '20px' }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={toggleUpdatePasswordVisibility} edge="end">
                                                {showUpdatePassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                        ),
                                }}
                            />
                            <TextField
                                name="confirm-new-password"
                                label="Confirm New Password"
                                variant="outlined"
                                fullWidth
                                type={showConfirmUpdatePassword ? 'text' : 'password'}
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                style={{ marginBottom: '20px' }}
                                disabled={!newPassword}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={toggleConfirmUpdatePasswordVisibility} edge="end">
                                                {showConfirmUpdatePassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                        ),
                                }}
                            />
                            <Button variant="contained" onClick={() => changeWebsitePassword(password.id)}>Submit</Button>
                            {errorUpdateMessage && !updateMessage && <p style={{ color: 'red', textAlign: 'center' }}>{errorUpdateMessage}</p>}
                            {updateMessage && <p style={{ color: 'green', textAlign: 'center' }}>{updateMessage}</p>}
                        </div>
                    )}
                </Paper>
            ))}

            {showAddPasswordFields && (
                <Paper elevation={3} style={{ padding: '20px', marginBottom: '10px' }}>
                    <TextField
                        name="website"
                        label="Website"
                        variant="outlined"
                        fullWidth
                        value={addPassword.website}
                        onChange={(e) => setAddPassword(prevState => ({ ...prevState, website: e.target.value }))}
                        style={{ marginBottom: '20px' }}
                    />
                    <TextField
                        name="password"
                        label="Password"
                        variant="outlined"
                        fullWidth
                        type={showAddPassword ? 'text' : 'password'}
                        value={addPassword.password}
                        onChange={(e) => setAddPassword(prevState => ({ ...prevState, password: e.target.value }))}
                        style={{ marginBottom: '20px' }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={toggleAddPasswordVisibility} edge="end">
                                        {showAddPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                    </IconButton>
                                </InputAdornment>
                                ),
                        }}
                    />
                    <Button variant="contained" onClick={handleSubmitAddPassword}>Submit</Button>
                    {errorAddMessage && !addMessage && <p style={{ color: 'red', textAlign: 'center' }}>{errorAddMessage}</p>}
                    {addMessage && <p style={{ color: 'green', textAlign: 'center' }}>{addMessage}</p>}   
                </Paper>
            )}
            <Paper elevation={3} style={{ padding: '20px', marginBottom: '10px' }}>
                <Button variant="outlined" onClick={toggleAddPasswordFields}>+ Add New</Button>   
            </Paper>

            <Dialog
                open={deleteConfirmationOpen}
                onClose={handleCancelDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" sx={{ color: 'red' }}>{"Delete Password?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" sx={{ color: 'black' }}>
                        Are you sure you want to delete this password?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeletionConfirmation} sx={{ color: 'red' }} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={deleteOutcomeOpen}
                onClose={handleDeleteOutcomeClose}
                aria-labelledby="delete-outcome-dialog-title"
                aria-describedby="delete-outcome-dialog-description"
            >
                <DialogTitle id="delete-outcome-dialog-title">Deletion Confirmation</DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-outcome-dialog-description">
                        {deleteMessage && <p>{deleteMessage}</p>}
                        {errorDeleteMessage && <p>{errorDeleteMessage}</p>}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteOutcomeClose} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
