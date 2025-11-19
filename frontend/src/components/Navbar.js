import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Badge,
  Box,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import StoreIcon from '@mui/icons-material/Store';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const location = useLocation();
  const { cartItems, fetchCart } = useCart();

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only fetch once on mount, not when fetchCart changes

  const cartItemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

      return (
        <AppBar 
          position="sticky" 
          elevation={2}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          <Toolbar>
            <StoreIcon sx={{ mr: 2, fontSize: 32 }} />
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1,
                fontWeight: 700,
                fontSize: '1.5rem'
              }}
            >
              Grocery Store
            </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            component={Link}
            to="/"
            startIcon={<HomeIcon />}
            variant={location.pathname === '/' ? 'outlined' : 'text'}
          >
            Home
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/products"
            startIcon={<StoreIcon />}
            variant={location.pathname === '/products' ? 'outlined' : 'text'}
          >
            Products
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/orders"
            startIcon={<ReceiptIcon />}
            variant={location.pathname === '/orders' ? 'outlined' : 'text'}
          >
            Orders
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/cart"
            startIcon={
              <Badge badgeContent={cartItemCount} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            }
            variant={location.pathname === '/cart' ? 'outlined' : 'text'}
          >
            Cart
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

