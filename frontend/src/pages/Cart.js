import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
  TextField,
  CircularProgress,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const USER_ID = 'user-123';

const Cart = () => {
  const { cartItems, cartTotal, loading, fetchCart, updateCartItem, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(itemId);
    } else {
      await updateCartItem(itemId, newQuantity);
    }
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      alert('Cart is empty!');
      return;
    }

    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
      alert('Please fill in all shipping address fields');
      return;
    }

    try {
      setPlacingOrder(true);
      await axios.post(`${API_BASE_URL}/orders/${USER_ID}`, {
        shippingAddress
      });
      
      await clearCart();
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order: ' + (error.response?.data?.message || error.message));
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>

      {cartItems.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h6" color="text.secondary">
            Your cart is empty
          </Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/products')}>
            Continue Shopping
          </Button>
        </Box>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {cartItems.map((item) => (
              <Card 
                key={item._id} 
                sx={{ 
                  mb: 2,
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: '1px solid rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 16px rgba(0,0,0,0.12)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} sm={3}>
                      <Box
                        component="img"
                        src={item.product?.image || 'https://via.placeholder.com/150'}
                        alt={item.product?.name}
                        sx={{ 
                          width: '100%', 
                          height: 140, 
                          objectFit: 'cover', 
                          borderRadius: 2,
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {item.product?.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                        {item.product?.description}
                      </Typography>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          mt: 1,
                          color: '#2196F3',
                          fontWeight: 700,
                          fontSize: '1.3rem'
                        }}
                      >
                        ${item.product?.price?.toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1.5,
                        mb: 2,
                        flexWrap: 'wrap'
                      }}>
                        <IconButton
                          size="medium"
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                          sx={{
                            border: '2px solid #e0e0e0',
                            '&:hover': {
                              borderColor: '#2196F3',
                              backgroundColor: 'rgba(33, 150, 243, 0.1)'
                            }
                          }}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography 
                          sx={{ 
                            minWidth: 50, 
                            textAlign: 'center',
                            fontWeight: 600,
                            fontSize: '1.1rem',
                            px: 2,
                            py: 1,
                            border: '2px solid #e0e0e0',
                            borderRadius: 1
                          }}
                        >
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="medium"
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                          sx={{
                            border: '2px solid #e0e0e0',
                            '&:hover': {
                              borderColor: '#2196F3',
                              backgroundColor: 'rgba(33, 150, 243, 0.1)'
                            }
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => removeFromCart(item._id)}
                          sx={{ 
                            ml: 1,
                            border: '2px solid #ffcdd2',
                            '&:hover': {
                              backgroundColor: 'rgba(244, 67, 54, 0.1)',
                              borderColor: '#f44336'
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          mt: 1,
                          color: '#2196F3',
                          fontWeight: 700
                        }}
                      >
                        ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Grid>

          <Grid item xs={12} md={4}>
            <Card 
              elevation={3}
              sx={{
                borderRadius: 3,
                border: '1px solid rgba(0,0,0,0.08)',
                position: 'sticky',
                top: 20
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography 
                  variant="h5" 
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Order Summary
                </Typography>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Shipping Address
                  </Typography>
                  <TextField
                    fullWidth
                    label="Street"
                    margin="normal"
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    fullWidth
                    label="City"
                    margin="normal"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    fullWidth
                    label="State"
                    margin="normal"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    fullWidth
                    label="Zip Code"
                    margin="normal"
                    value={shippingAddress.zipCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                  />
                </Box>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mb: 3,
                  p: 2,
                  background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 203, 243, 0.1) 100%)',
                  borderRadius: 2
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Total:
                  </Typography>
                  <Typography 
                    variant="h4" 
                    sx={{
                      color: '#2196F3',
                      fontWeight: 700
                    }}
                  >
                    ${cartTotal.toFixed(2)}
                  </Typography>
                </Box>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCartCheckoutIcon />}
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    boxShadow: '0 4px 10px 2px rgba(33, 203, 243, .3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                      boxShadow: '0 6px 14px 3px rgba(33, 203, 243, .4)',
                      transform: 'translateY(-2px)'
                    },
                    '&:disabled': {
                      background: '#e0e0e0',
                      color: '#9e9e9e'
                    }
                  }}
                >
                  {placingOrder ? 'Placing Order...' : 'Place Order'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Cart;

