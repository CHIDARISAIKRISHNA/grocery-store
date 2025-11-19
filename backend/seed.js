const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/grocery-store';

const sampleProducts = [
  {
    name: 'Fresh Apples',
    description: 'Crisp and juicy red apples, perfect for snacking',
    price: 2.99,
    category: 'Fruits',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400',
    rating: 4.5
  },
  {
    name: 'Organic Bananas',
    description: 'Naturally sweet and nutritious bananas',
    price: 1.99,
    category: 'Fruits',
    stock: 75,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400',
    rating: 4.7
  },
  {
    name: 'Fresh Carrots',
    description: 'Sweet and crunchy organic carrots',
    price: 1.49,
    category: 'Vegetables',
    stock: 60,
    image: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=400',
    rating: 4.3
  },
  {
    name: 'Broccoli',
    description: 'Fresh green broccoli florets, rich in nutrients',
    price: 2.49,
    category: 'Vegetables',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=400',
    rating: 4.4
  },
  {
    name: 'Whole Milk',
    description: 'Fresh whole milk, 1 gallon',
    price: 3.99,
    category: 'Dairy',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
    rating: 4.6
  },
  {
    name: 'Organic Eggs',
    description: 'Free-range organic eggs, 12 count',
    price: 4.99,
    category: 'Dairy',
    stock: 45,
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400',
    rating: 4.8
  },
  {
    name: 'Fresh Bread',
    description: 'Artisan whole wheat bread, freshly baked',
    price: 3.49,
    category: 'Bakery',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
    rating: 4.5
  },
  {
    name: 'Bagels',
    description: 'Assorted bagels, 6 pack',
    price: 4.49,
    category: 'Bakery',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1615367423057-4e329599749a?w=400',
    rating: 4.4
  },
  {
    name: 'Chicken Breast',
    description: 'Fresh boneless chicken breast, 1 lb',
    price: 6.99,
    category: 'Meat',
    stock: 35,
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400',
    rating: 4.7
  },
  {
    name: 'Ground Beef',
    description: 'Premium lean ground beef, 1 lb',
    price: 7.99,
    category: 'Meat',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400',
    rating: 4.6
  },
  {
    name: 'Orange Juice',
    description: 'Fresh squeezed orange juice, 64 oz',
    price: 4.99,
    category: 'Beverages',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
    rating: 4.5
  },
  {
    name: 'Mineral Water',
    description: 'Pure spring water, 24 pack',
    price: 5.99,
    category: 'Beverages',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1548839140-bc30f357adc91?w=400',
    rating: 4.3
  },
  {
    name: 'Potato Chips',
    description: 'Classic salted potato chips, family size',
    price: 3.99,
    category: 'Snacks',
    stock: 55,
    image: 'https://images.unsplash.com/photo-1612698093158-e07ac200d44b?w=400',
    rating: 4.2
  },
  {
    name: 'Granola Bars',
    description: 'Healthy granola bars with nuts, 12 pack',
    price: 6.49,
    category: 'Snacks',
    stock: 45,
    image: 'https://images.unsplash.com/photo-1615197349907-21a9b5f7621b?w=400',
    rating: 4.4
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);

    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log(`Inserted ${sampleProducts.length} products`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

