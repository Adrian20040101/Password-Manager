import React, { useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Typography, Box, Button, Dialog, DialogContent, DialogTitle, DialogActions, DialogContentText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useUserId } from './user_id_context';

function MyAppBar() {
  const history = useHistory();
  const location = useLocation();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [errorDelete, setErrorDelete] = useState('');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const { userId, setUserId } = useUserId();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userIdFromUrl = params.get('userId');
    if (userIdFromUrl) {
      setUserId(userIdFromUrl);
    }
  }, [location.search, setUserId]);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogoutClick = async (route) => {
    if (route === '/logout') {
      try {
        const response = await fetch("http://localhost:8080/user/logout", {
          method: 'POST'
        })
        if (response.status === 200) {
            history.push("/");
        } else if (response.status == 400) {
            setError('No user is logged in.');
        } else if (response.status === 500) {
            setError("Logout failed. Please try again.");
        }
      } catch (error) {
        console.error('Error logging out:', error);
        setError("An error occurred during logout. Please try again later.");
      }
    } else {
      history.push(route);
    }
    setAnchorEl(null);
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(`http://localhost:8080/user/delete?id=${userId}`, {
        method: 'DELETE'
      })
      
      if (response.status === 200) {
          handleLogoutClick('/logout');
          history.push("/");
          handleCloseConfirmation();
      } else if (response.status === 404) {
          setErrorDelete('User was not found in the database');
      } else if (response.status === 500) {
          setErrorDelete('Account deletion failed. Please try again.');
      }
    } catch (error) {
        console.error('Error logging out:', error);
        setErrorDelete("An error occurred during logout. Please try again later.");
    }
  }

  const handleDeleteConfirmation = () => {
    setOpenConfirmation(true);
    
  };

  const handleCloseConfirmation = () => {
    setOpenConfirmation(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isMainPage = location.pathname === '/manage-passwords';

  return (
    <AppBar position="static">
      <Toolbar>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
      <Typography
        variant="h6"
        component="div"
        height={'8vh'}
        align='left'
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          marginTop: '20px',
          paddingLeft: '20px',
          paddingRight: '20px'
        }}
      >
      Password Manager
        {isMainPage && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuClick}
            sx={{ marginLeft: 'auto' }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => handleLogoutClick('/logout')}>Log out</MenuItem>
          <Link to='/change-password' style={{ textDecoration: 'none' }}>
            <MenuItem onClick={handleClose}>Change Password</MenuItem>
          </Link>
          <MenuItem onClick={handleDeleteConfirmation} sx={{color: 'red' }}>Delete Account</MenuItem>
        </Menu>
         </Typography>
         </Box>
      </Toolbar>

      <Dialog
        open={openConfirmation}
        onClose={handleCloseConfirmation}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ color: 'red' }}>{"Delete Account"} </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" sx={{ color: 'black' }}>
            Are you sure you want to delete your account? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmation}>Cancel</Button>
          <Button onClick={handleDeleteAccount} sx={{ color: 'red' }} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
}

export default MyAppBar;
