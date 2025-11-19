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
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>

      {orders.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No orders yet
          </Typography>
        </Box>
      ) : (
        orders.map((order) => (
          <Card key={order._id} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="h6">Order #{order._id.slice(-8)}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                    size="medium"
                  />
                  <Typography variant="h6" color="primary">
                    ${order.total.toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Order Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {order.items.map((item, index) => (
                      <Grid item xs={12} key={index}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
                          <Typography>
                            {item.name} x {item.quantity}
                          </Typography>
                          <Typography>
                            ${(item.price * item.quantity).toFixed(2)}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                  {order.shippingAddress && (
                    <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Shipping Address:
                      </Typography>
                      <Typography variant="body2">
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

