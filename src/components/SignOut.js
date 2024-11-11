import React from 'react';
import { Button, Typography, Box, Avatar } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { auth } from '@/lib/Firebase';
import { styled } from '@mui/material/styles';

const StyledHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(45deg, #1a237e 30%, #283593 90%)',
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  color: 'white',
  boxShadow: '0 3px 5px 2px rgba(26, 35, 126, .3)',
}));

const UserInfo = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: 'white',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  padding: theme.spacing(1, 3),
  borderRadius: '20px',
  textTransform: 'none',
}));

function SignOut() {
  return (
    <StyledHeader>
      <UserInfo>
        <Avatar
          src={auth.currentUser.photoURL}
          alt={auth.currentUser.displayName}
        >
          <AccountCircleIcon />
        </Avatar>
        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
          {auth.currentUser.displayName}
        </Typography>
      </UserInfo>
      
      <StyledButton
        variant="contained"
        startIcon={<LogoutIcon />}
        onClick={() => auth.signOut()}
      >
        サインアウト
      </StyledButton>
    </StyledHeader>
  );
}

export default SignOut;