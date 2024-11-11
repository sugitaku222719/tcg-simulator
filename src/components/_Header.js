import React, { useState } from 'react';
import SignOut from './SignOut';
import Link from 'next/link';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/Firebase';
import SignIn from './SignIn';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(45deg, #1a237e 30%, #283593 90%)',
  boxShadow: '0 3px 5px 2px rgba(26, 35, 126, .3)',
}));

const LogoText = styled(Typography)(({ theme }) => ({
  color: '#ff1744',
  fontWeight: 'bold',
  letterSpacing: '1px',
  textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5rem',
  },
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: 'white',
  padding: '8px 16px',
  borderRadius: '20px',
  fontSize: '1rem',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: 'translateY(-2px)',
    transition: 'all 0.3s ease',
  },
}));

const MobileNavDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 240,
    background: 'linear-gradient(45deg, #1a237e 30%, #283593 90%)',
    color: 'white',
  },
}));

const navItems = [
  { text: 'エントランス', href: '/' },
  { text: 'カード登録', href: '/cardRegistration' },
  { text: 'デッキ登録', href: '/deckRegistration/deckIndex' },
  { text: '対戦部屋', href: '/playRoom/roomCreate' },
];

function _Header() {
  const [user] = useAuthState(auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <List>
      {navItems.map((item) => (
        <ListItem key={item.text} component={Link} href={item.href} onClick={handleDrawerToggle}>
          <ListItemText 
            primary={item.text} 
            sx={{ 
              color: 'white',
              '& span': { fontSize: '1.1rem' }
            }} 
          />
        </ListItem>
      ))}
    </List>
  );

  return (
    <StyledAppBar position="static">
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', padding: '0.5rem 0' }}>
          <LogoText variant="h4">
            TCG SIMULATOR
          </LogoText>

          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {navItems.map((item) => (
                <Link key={item.text} href={item.href} passHref>
                  <NavButton>{item.text}</NavButton>
                </Link>
              ))}
              {user ? <SignOut /> : <SignIn />}
            </Box>
          )}

          <MobileNavDrawer
            variant="temporary"
            anchor="right"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better mobile performance
            }}
          >
            {drawer}
            <Box sx={{ padding: '1rem', textAlign: 'center' }}>
              {user ? <SignOut /> : <SignIn />}
            </Box>
          </MobileNavDrawer>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
}

export default _Header;