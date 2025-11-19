const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/grocery-store';

// Using reliable food image URLs from a working CDN
const sampleProducts = [
  // Fruits (12 items with working images)
  { name: 'Fresh Apples', description: 'Crisp and juicy red apples, perfect for snacking', price: 2.99, category: 'Fruits', stock: 50, image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&h=400&fit=crop&auto=format', rating: 4.5 },
  { name: 'Organic Bananas', description: 'Naturally sweet and nutritious bananas', price: 1.99, category: 'Fruits', stock: 75, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop&auto=format', rating: 4.7 },
  { name: 'Sweet Strawberries', description: 'Fresh red strawberries, perfect for desserts', price: 4.99, category: 'Fruits', stock: 35, image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop&auto=format', rating: 4.8 },
  { name: 'Fresh Oranges', description: 'Juicy Valencia oranges, high in vitamin C', price: 3.49, category: 'Fruits', stock: 60, image: 'https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=400&h=400&fit=crop&auto=format', rating: 4.6 },
  { name: 'Fresh Grapes', description: 'Seedless red grapes, perfect for snacking', price: 4.49, category: 'Fruits', stock: 40, image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&h=400&fit=crop&auto=format', rating: 4.5 },
  { name: 'Pineapple', description: 'Sweet and juicy whole pineapple', price: 4.99, category: 'Fruits', stock: 20, image: 'https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?w=400&h=400&fit=crop&auto=format', rating: 4.7 },
  { name: 'Fresh Blueberries', description: 'Organic blueberries, antioxidant rich', price: 6.99, category: 'Fruits', stock: 30, image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&h=400&fit=crop&auto=format', rating: 4.8 },
  { name: 'Watermelon', description: 'Sweet and refreshing whole watermelon', price: 5.49, category: 'Fruits', stock: 15, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop&auto=format', rating: 4.6 },
  { name: 'Kiwi', description: 'Tropical kiwi fruit, rich in vitamin C', price: 3.99, category: 'Fruits', stock: 32, image: 'https://images.unsplash.com/photo-1590254553792-7e91903c5357?w=400&h=400&fit=crop&auto=format', rating: 4.5 },
  { name: 'Pears', description: 'Sweet and crisp pears, perfect texture', price: 3.49, category: 'Fruits', stock: 38, image: 'https://images.unsplash.com/photo-1602779717364-526b55e0c5e0?w=400&h=400&fit=crop&auto=format', rating: 4.4 },
  { name: 'Raspberries', description: 'Fresh red raspberries, antioxidant rich', price: 6.49, category: 'Fruits', stock: 18, image: 'https://images.unsplash.com/photo-1518635017498-87f514b751ba?w=400&h=400&fit=crop&auto=format', rating: 4.7 },
  { name: 'Blackberries', description: 'Sweet blackberries, perfect for desserts', price: 5.99, category: 'Fruits', stock: 20, image: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400&h=400&fit=crop&auto=format', rating: 4.6 },
  
  // Vegetables (9 items with working images)
  { name: 'Fresh Carrots', description: 'Sweet and crunchy organic carrots', price: 1.49, category: 'Vegetables', stock: 60, image: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=400&h=400&fit=crop&auto=format', rating: 4.3 },
  { name: 'Broccoli', description: 'Fresh green broccoli florets, rich in nutrients', price: 2.49, category: 'Vegetables', stock: 40, image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=400&h=400&fit=crop&auto=format', rating: 4.4 },
  { name: 'Fresh Spinach', description: 'Organic baby spinach, perfect for salads', price: 2.99, category: 'Vegetables', stock: 45, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop&auto=format', rating: 4.5 },
  { name: 'Red Bell Peppers', description: 'Fresh red bell peppers, sweet and crunchy', price: 3.49, category: 'Vegetables', stock: 35, image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=400&fit=crop&auto=format', rating: 4.6 },
  { name: 'Fresh Onions', description: 'Yellow onions, essential for cooking', price: 1.49, category: 'Vegetables', stock: 65, image: 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=400&h=400&fit=crop&auto=format', rating: 4.2 },
  { name: 'Potatoes', description: 'Russet potatoes, great for baking and mashing', price: 2.99, category: 'Vegetables', stock: 70, image: 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=400&h=400&fit=crop&auto=format', rating: 4.5 },
  { name: 'Fresh Lettuce', description: 'Crisp iceberg lettuce, perfect for salads', price: 2.49, category: 'Vegetables', stock: 40, image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&h=400&fit=crop&auto=format', rating: 4.3 },
  { name: 'Fresh Corn', description: 'Sweet corn on the cob, farm fresh', price: 1.99, category: 'Vegetables', stock: 30, image: 'https://images.unsplash.com/photo-1464454709131-ffd692591ee5?w=400&h=400&fit=crop&auto=format', rating: 4.6 },
  { name: 'Cauliflower', description: 'Fresh white cauliflower, versatile vegetable', price: 3.49, category: 'Vegetables', stock: 33, image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=400&h=400&fit=crop&auto=format', rating: 4.5 },
  
  // Dairy (12 items with working images)
  { name: 'Whole Milk', description: 'Fresh whole milk, 1 gallon', price: 3.99, category: 'Dairy', stock: 30, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop&auto=format', rating: 4.6 },
  { name: 'Organic Eggs', description: 'Free-range organic eggs, 12 count', price: 4.99, category: 'Dairy', stock: 45, image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop&auto=format', rating: 4.8 },
  { name: 'Greek Yogurt', description: 'Creamy Greek yogurt, protein-rich', price: 5.49, category: 'Dairy', stock: 35, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop&auto=format', rating: 4.7 },
  { name: 'Fresh Cheese', description: 'Mozzarella cheese, perfect for pizzas', price: 4.99, category: 'Dairy', stock: 40, image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=400&fit=crop&auto=format', rating: 4.5 },
  { name: 'Butter', description: 'Unsalted butter, 1 lb package', price: 4.49, category: 'Dairy', stock: 50, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=400&fit=crop&auto=format', rating: 4.6 },
  { name: 'Cheddar Cheese', description: 'Sharp cheddar cheese, 8 oz block', price: 5.99, category: 'Dairy', stock: 38, image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=400&fit=crop&auto=format', rating: 4.6 },
  { name: 'Swiss Cheese', description: 'Swiss cheese slices, 8 oz', price: 6.49, category: 'Dairy', stock: 32, image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=400&fit=crop&auto=format', rating: 4.5 },
  { name: 'Cottage Cheese', description: 'Low-fat cottage cheese, 16 oz', price: 3.99, category: 'Dairy', stock: 42, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop&auto=format', rating: 4.4 },
  { name: 'Almond Milk', description: 'Unsweetened almond milk, 64 oz', price: 4.49, category: 'Dairy', stock: 36, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop&auto=format', rating: 4.6 },
  { name: 'Oat Milk', description: 'Creamy oat milk, 64 oz', price: 4.99, category: 'Dairy', stock: 34, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop&auto=format', rating: 4.7 },
  { name: 'Goat Cheese', description: 'Fresh goat cheese, 4 oz', price: 5.49, category: 'Dairy', stock: 24, image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=400&fit=crop&auto=format', rating: 4.6 },
  { name: 'Feta Cheese', description: 'Crumbled feta cheese, 6 oz', price: 4.99, category: 'Dairy', stock: 30, image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=400&fit=crop&auto=format', rating: 4.5 },
  
  // Bakery (10 items with working images)
  { name: 'Fresh Bread', description: 'Artisan whole wheat bread, freshly baked', price: 3.49, category: 'Bakery', stock: 25, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop&auto=format', rating: 4.5 },
  { name: 'Croissants', description: 'Buttery French croissants, 4 pack', price: 5.99, category: 'Bakery', stock: 18, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=400&fit=crop&auto=format', rating: 4.7 },
  { name: 'Chocolate Chip Cookies', description: 'Freshly baked chocolate chip cookies, 12 pack', price: 4.99, category: 'Bakery', stock: 30, image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop&auto=format', rating: 4.8 },
  { name: 'Donuts', description: 'Assorted glazed donuts, 6 pack', price: 5.49, category: 'Bakery', stock: 22, image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop&auto=format', rating: 4.6 },
  { name: 'Muffins', description: 'Fresh blueberry muffins, 6 pack', price: 4.99, category: 'Bakery', stock: 20, image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&h=400&fit=crop&auto=format', rating: 4.5 },
  { name: 'Cinnamon Rolls', description: 'Fresh cinnamon rolls with icing, 4 pack', price: 6.99, category: 'Bakery', stock: 16, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=400&fit=crop&auto=format', rating: 4.8 },
  { name: 'Sourdough Bread', description: 'Artisan sourdough bread, tangy flavor', price: 4.99, category: 'Bakery', stock: 19, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop&auto=format', rating: 4.6 },
  { name: 'Pita Bread', description: 'Fresh pita bread, 6 pack', price: 3.99, category: 'Bakery', stock: 23, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop&auto=format', rating: 4.4 },
  { name: 'Tortillas', description: 'Flour tortillas, 10 pack', price: 2.99, category: 'Bakery', stock: 35, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop&auto=format', rating: 4.3 },
  { name: 'Baguette', description: 'French baguette, freshly baked', price: 3.99, category: 'Bakery', stock: 21, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop&auto=format', rating: 4.6 },
  
  // Meat (9 items with working images)
  { name: 'Chicken Breast', description: 'Fresh boneless chicken breast, 1 lb', price: 6.99, category: 'Meat', stock: 35, image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop&auto=format', rating: 4.7 },
  { name: 'Ground Beef', description: 'Premium lean ground beef, 1 lb', price: 7.99, category: 'Meat', stock: 30, image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=400&fit=crop&auto=format', rating: 4.6 },
  { name: 'Salmon Fillet', description: 'Fresh Atlantic salmon fillet, 1 lb', price: 12.99, category: 'Meat', stock: 25, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=400&fit=crop&auto=format', rating: 4.9 },
  { name: 'Pork Chops', description: 'Fresh bone-in pork chops, 1 lb', price: 8.99, category: 'Meat', stock: 28, image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400&h=400&fit=crop&auto=format', rating: 4.6 },
  { name: 'Shrimp', description: 'Large fresh shrimp, 1 lb', price: 14.99, category: 'Meat', stock: 20, image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&h=400&fit=crop&auto=format', rating: 4.8 },
  { name: 'Chicken Thighs', description: 'Fresh chicken thighs, 1 lb', price: 5.99, category: 'Meat', stock: 32, image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop&auto=format', rating: 4.6 },
  { name: 'Ribeye Steak', description: 'Premium ribeye steak, 1 lb', price: 15.99, category: 'Meat', stock: 18, image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=400&fit=crop&auto=format', rating: 4.9 },
  { name: 'Bacon', description: 'Thick-cut bacon, 12 oz package', price: 7.99, category: 'Meat', stock: 40, image: 'https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=400&h=400&fit=crop&auto=format', rating: 4.8 },
  { name: 'Sausage', description: 'Italian sausage links, 1 lb', price: 6.99, category: 'Meat', stock: 29, image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop&auto=format', rating: 4.6 },
  { name: 'Tilapia Fillet', description: 'Fresh tilapia fillet, 1 lb', price: 8.99, category: 'Meat', stock: 24, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=400&fit=crop&auto=format', rating: 4.5 },
  
  // Beverages (7 items with working images)
  { name: 'Orange Juice', description: 'Fresh squeezed orange juice, 64 oz', price: 4.99, category: 'Beverages', stock: 40, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop&auto=format', rating: 4.5 },
  { name: 'Green Tea', description: 'Premium green tea, 20 tea bags', price: 3.99, category: 'Beverages', stock: 60, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop&auto=format', rating: 4.6 },
  { name: 'Coffee Beans', description: 'Arabica coffee beans, 1 lb', price: 12.99, category: 'Beverages', stock: 35, image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop&auto=format', rating: 4.8 },
  { name: 'Coca Cola', description: 'Classic Coca Cola, 12 pack cans', price: 5.99, category: 'Beverages', stock: 55, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop&auto=format', rating: 4.2 },
  { name: 'Grape Juice', description: '100% grape juice, 64 oz', price: 4.99, category: 'Beverages', stock: 38, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop&auto=format', rating: 4.4 },
  { name: 'Iced Tea', description: 'Sweet iced tea, 64 oz', price: 3.49, category: 'Beverages', stock: 42, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop&auto=format', rating: 4.3 },
  { name: 'Cranberry Juice', description: '100% cranberry juice, 64 oz', price: 5.49, category: 'Beverages', stock: 36, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop&auto=format', rating: 4.5 },
  
  // Snacks (5 items with working images)
  { name: 'Mixed Nuts', description: 'Premium mixed nuts, 16 oz container', price: 8.99, category: 'Snacks', stock: 40, image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=400&fit=crop&auto=format', rating: 4.7 },
  { name: 'Trail Mix', description: 'Energy trail mix with dried fruits and nuts', price: 5.99, category: 'Snacks', stock: 35, image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=400&h=400&fit=crop&auto=format', rating: 4.5 },
  { name: 'Popcorn', description: 'Microwave popcorn, 12 pack', price: 4.49, category: 'Snacks', stock: 42, image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&auto=format', rating: 4.4 },
  { name: 'Chocolate Bars', description: 'Assorted chocolate bars, 10 pack', price: 7.99, category: 'Snacks', stock: 38, image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&h=400&fit=crop&auto=format', rating: 4.8 },
  { name: 'Dried Fruit', description: 'Mixed dried fruit, 12 oz package', price: 5.49, category: 'Snacks', stock: 39, image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=400&h=400&fit=crop&auto=format', rating: 4.5 }
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
