import React from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, CardMedia, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StoreIcon from '@mui/icons-material/Store';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const Home = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom color="primary">
          Welcome to Our Grocery Store
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Fresh produce delivered to your doorstep
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={Link}
          to="/products"
          startIcon={<ShoppingCartIcon />}
          sx={{ mt: 2 }}
        >
          Shop Now
        </Button>
      </Box>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardMedia
              component="div"
              sx={{
                height: 200,
                backgroundColor: 'primary.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <StoreIcon sx={{ fontSize: 80, color: 'white' }} />
            </CardMedia>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Wide Selection
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Browse through hundreds of fresh products including fruits, vegetables, dairy, and more.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardMedia
              component="div"
              sx={{
                height: 200,
                backgroundColor: 'secondary.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LocalShippingIcon sx={{ fontSize: 80, color: 'white' }} />
            </CardMedia>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Fast Delivery
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Quick and reliable delivery service to ensure your groceries arrive fresh and on time.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardMedia
              component="div"
              sx={{
                height: 200,
                backgroundColor: 'success.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShoppingCartIcon sx={{ fontSize: 80, color: 'white' }} />
            </CardMedia>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Easy Shopping
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Simple and intuitive interface to make your shopping experience smooth and enjoyable.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;

