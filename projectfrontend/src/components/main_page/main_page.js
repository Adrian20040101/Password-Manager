import React, { useState, useEffect, useContext } from 'react';
import { Container, Paper, IconButton, Button, TextField, Icon, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
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
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showUpdatePasswordFields, setShowUpdatePasswordFields] = useState(false);
    const [addPassword, setAddPassword] = useState({ website: '', password: '' });
    const [addMessage, setAddMessage] = useState('');
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [deleteOutcomeOpen, setDeleteOutcomeOpen] = useState(false);
    const [passwordToDelete, setPasswordToDelete] = useState(null);
    const [failedAddMessage, setFailedAddMessage] = useState('');
    const [updateMessage, setUpdateMessage] = useState('');
    const [failedUpdateMessage, setFailedUpdateMessage] = useState('');
    const [deleteMessage, setDeleteMessage] = useState('');
    const [failedDeleteMessage, setFailedDeleteMessage] = useState('');
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const userIdString = searchParams.get('userId');
    const userId = parseInt(userIdString);
    const username = location.state.username;

    useEffect(() => {
        fetchPasswords();
    }, [userId]);

    const fetchPasswords = () => {
        if (!userId) {
            console.error('No userId found in the URL');
            return;
        }
        
        fetch(`http://localhost:8080/password/retrieveAll?id=${userId}`)
            .then(response => response.json())
            .then(data => {
                setPasswords(data);
                setShowPasswords(Array(data.length).fill(false));
            })
            .catch(error => console.error('Error fetching passwords:', error));
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

    const toggleUpdatePasswordFields = (passwordId) => {
        setShowUpdatePasswordFields(prevState => ({...prevState, [passwordId]: !prevState[passwordId]}));
    };

    const openDeleteConfirmation = (passwordId) => {
        setPasswordToDelete(passwordId);
        setDeleteConfirmationOpen(true);
    };

    const handleDeletionConfirmation = () => {
        fetch(`http://localhost:8080/password/deletePassword?userId=${userId}&passwordId=${passwordToDelete}`, {
            method: 'DELETE'
        })
        .then((res) => {
            if (res.ok) {
                setDeleteMessage('Password deleted successfully. Refresh the page for updated password list');
            } else {
                setFailedDeleteMessage('An error occurred. Please try again.');
            }
        })
        .finally(() => {
            setDeleteConfirmationOpen(false);
            setDeleteOutcomeOpen(true);
        })
    };

    const handleCancelDelete = () => {
        setDeleteConfirmationOpen(false);
    };

    const handleDeleteOutcomeClose = () => {
        setDeleteOutcomeOpen(false);
    };

    const handleDeleteConfirmationClose = () => {
        setDeleteConfirmationOpen(false);
        setDeleteOutcomeOpen(true);
    };

    const handleSubmitAddPassword = () => {
        if (!addPassword.website || !addPassword.password) {
            setFailedAddMessage("Website and Password are required.");
            return;
        }

        const formData = new FormData();
        formData.append('id', userId);
        formData.append('website', addPassword.website)
        formData.append('password', addPassword.password);

        console.log(username);
        console.log(userId);

        fetch("http://localhost:8080/password/savePassword", {
            method: "POST",
            body: formData
        })
        .then((res) => {
            if (res.ok) {
                setAddMessage("Password was successfully added.")
            } else {
                setFailedAddMessage("An error occurred. Please try again.")
            }
        })
    };


    const changeWebsitePassword = (id) => {
        if (!newPassword) {
            setFailedUpdateMessage('New password required.');
            return;
        } else if (!confirmNewPassword) {
            setFailedUpdateMessage('Password Confirmation required.');
            return;
        } else if (newPassword !== confirmNewPassword) {
            setFailedUpdateMessage('Passwords do not match.');
            return;
        }

        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('passwordId', id);
        formData.append('newPassword', newPassword);

        console.log(userId);
        console.log(id);
        console.log(newPassword);

        fetch('http://localhost:8080/password/changePassword', {
            method: "POST",
            body: formData
        })
        .then((res) => {
            if (res.ok) {
                setUpdateMessage("Password was successfully changed.")
            } else {
                setFailedUpdateMessage("An error occurred. Please try again.")
            }
        })
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
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                style={{ marginBottom: '20px' }}
                            />
                            <TextField
                                name="confirm-new-password"
                                label="Confirm New Password"
                                variant="outlined"
                                fullWidth
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                style={{ marginBottom: '20px' }}
                            />
                            <Button variant="contained" onClick={() => changeWebsitePassword(password.id)}>Submit</Button>
                            {failedUpdateMessage && !updateMessage && <p style={{ color: 'red', textAlign: 'center' }}>{failedUpdateMessage}</p>}
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
                        value={addPassword.password}
                        onChange={(e) => setAddPassword(prevState => ({ ...prevState, password: e.target.value }))}
                        style={{ marginBottom: '20px' }}
                    />
                    <Button variant="contained" onClick={handleSubmitAddPassword}>Submit</Button>
                    {failedAddMessage && !addMessage && <p style={{ color: 'red', textAlign: 'center' }}>{failedAddMessage}</p>}
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
                        {failedDeleteMessage && <p>{failedDeleteMessage}</p>}
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
