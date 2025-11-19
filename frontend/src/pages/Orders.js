import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Chip,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const USER_ID = 'user-123';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/orders/${USER_ID}`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'warning',
      Processing: 'info',
      Shipped: 'primary',
      Delivered: 'success',
      Cancelled: 'error',
    };
    return colors[status] || 'default';
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
      <Typography 
        variant="h4" 
        gutterBottom
        sx={{
          mb: 4,
          fontWeight: 700,
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}
      >
        My Orders
      </Typography>

      {orders.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          mt: 8,
          p: 6,
          borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,249,250,0.9) 100%)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
          <Typography variant="h6" color="text.secondary" sx={{ fontSize: '1.2rem' }}>
            No orders yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Start shopping to see your orders here!
          </Typography>
        </Box>
      ) : (
        orders.map((order) => (
          <Card 
            key={order._id} 
            sx={{ 
              mb: 3,
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
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 2,
                flexWrap: 'wrap',
                gap: 2
              }}>
                <Box>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 700,
                      mb: 1,
                      color: '#2c3e50'
                    }}
                  >
                    Order #{order._id.slice(-8)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                    size="medium"
                    sx={{ 
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      height: 32
                    }}
                  />
                  <Typography 
                    variant="h5" 
                    sx={{
                      color: '#2196F3',
                      fontWeight: 700,
                      fontSize: '1.5rem'
                    }}
                  >
                    ${order.total.toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              <Accordion sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}>
                <AccordionSummary 
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: 'rgba(33, 150, 243, 0.05)'
                    }
                  }}
                >
                  <Typography sx={{ fontWeight: 600 }}>Order Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {order.items.map((item, index) => (
                      <Grid item xs={12} key={index}>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          p: 2,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, rgba(248,249,250,0.5) 0%, rgba(255,255,255,0.5) 100%)',
                          mb: 1
                        }}>
                          <Typography sx={{ fontWeight: 500 }}>
                            {item.name} x {item.quantity}
                          </Typography>
                          <Typography 
                            sx={{ 
                              fontWeight: 600,
                              color: '#2196F3'
                            }}
                          >
                            ${(item.price * item.quantity).toFixed(2)}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                  {order.shippingAddress && (
                    <Box sx={{ 
                      mt: 3, 
                      pt: 3, 
                      borderTop: '2px solid rgba(0,0,0,0.08)'
                    }}>
                      <Typography 
                        variant="subtitle1" 
                        gutterBottom
                        sx={{ 
                          fontWeight: 600,
                          mb: 1
                        }}
                      >
                        Shipping Address:
                      </Typography>
                      <Typography 
                        variant="body1"
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.05) 0%, rgba(33, 203, 243, 0.05) 100%)',
                          lineHeight: 1.8
                        }}
                      >
                        {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                      </Typography>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
};

export default Orders;

