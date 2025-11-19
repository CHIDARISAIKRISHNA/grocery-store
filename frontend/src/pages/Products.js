import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
  Chip,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const { addToCart } = useCart();

  const categories = ['Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Meat', 'Beverages', 'Snacks', 'Other'];

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const url = category
        ? `${API_BASE_URL}/products?category=${category}&search=${searchTerm}`
        : `${API_BASE_URL}/products?search=${searchTerm}`;
      const response = await axios.get(url);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [category, searchTerm]);

  const filterProducts = useCallback(() => {
    let filtered = products;
    
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (category) {
      filtered = filtered.filter(product => product.category === category);
    }
    
    setFilteredProducts(filtered);
  }, [products, searchTerm, category]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    filterProducts();
  }, [filterProducts]);

  const handleAddToCart = async (productId) => {
    const success = await addToCart(productId, 1);
    if (success) {
      alert('Product added to cart!');
    } else {
      alert('Failed to add product to cart');
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
        Our Products
      </Typography>

      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        mb: 4, 
        flexWrap: 'wrap',
        p: 3,
        borderRadius: 3,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,249,250,0.9) 100%)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
      }}>
        <TextField
          label="Search Products"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ 
            minWidth: 250,
            flexGrow: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            label="Category"
            onChange={(e) => setCategory(e.target.value)}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button 
          variant="outlined" 
          onClick={fetchProducts}
          sx={{
            px: 3,
            borderRadius: 2,
            fontWeight: 600,
            textTransform: 'none',
            borderColor: '#2196F3',
            color: '#2196F3',
            '&:hover': {
              borderColor: '#1976D2',
              backgroundColor: 'rgba(33, 150, 243, 0.1)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          Refresh
        </Button>
      </Box>

      <Grid container spacing={3}>
        {filteredProducts.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="h6" color="text.secondary" textAlign="center">
              No products found
            </Typography>
          </Grid>
        ) : (
          filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <Card 
                elevation={3} 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 3,
                  overflow: 'hidden',
                  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="220"
                  image={product.image || 'https://via.placeholder.com/300'}
                  alt={product.name}
                  sx={{ 
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                />
                <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1.5 }}>
                    <Typography 
                      variant="h6" 
                      component="div" 
                      sx={{ 
                        flex: 1,
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        color: '#2c3e50'
                      }}
                    >
                      {product.name}
                    </Typography>
                    <Chip 
                      label={product.category} 
                      size="small" 
                      color="primary"
                      sx={{ 
                        fontWeight: 600,
                        height: 26,
                        fontSize: '0.75rem'
                      }}
                    />
                  </Box>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    paragraph
                    sx={{ 
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                      minHeight: 40,
                      mb: 2
                    }}
                  >
                    {product.description}
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mt: 2,
                    pt: 2,
                    borderTop: '1px solid rgba(0,0,0,0.08)'
                  }}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        color: '#2196F3',
                        fontWeight: 700,
                        fontSize: '1.5rem'
                      }}
                    >
                      ${product.price.toFixed(2)}
                    </Typography>
                    <Chip 
                      label={product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                      size="small"
                      color={product.stock > 0 ? 'success' : 'error'}
                      sx={{ 
                        fontWeight: 600,
                        fontSize: '0.7rem'
                      }}
                    />
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<AddShoppingCartIcon />}
                    onClick={() => handleAddToCart(product._id)}
                    disabled={product.stock === 0}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                      fontSize: '1rem',
                      textTransform: 'none',
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                        boxShadow: '0 5px 8px 3px rgba(33, 203, 243, .4)',
                        transform: 'scale(1.02)'
                      },
                      '&:disabled': {
                        background: '#e0e0e0',
                        color: '#9e9e9e'
                      }
                    }}
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default Products;

