import mongoose from 'mongoose';
import Department from './models/Department';
import Product from './models/Product';

// Sample departments
const departments = [
  { name: 'Electronics', description: 'Electronic devices and accessories' },
  { name: 'Clothing', description: 'Apparel and fashion items' },
  { name: 'Home & Kitchen', description: 'Home goods and kitchen appliances' },
  { name: 'Books', description: 'Books and educational materials' },
];

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/merch_portal')
  .then(async () => {
    console.log('Connected to MongoDB');

    // Clear existing data
    await Department.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Insert departments
    const createdDepartments = await Department.insertMany(departments);
    console.log(`Added ${createdDepartments.length} departments`);

    // Create products for each department
    const products = [];
    
    // Electronics products
    const electronicsId = createdDepartments[0]._id;
    products.push(
      {
        name: 'Smartphone X',
        description: 'Latest smartphone with advanced features',
        price: 999.99,
        discountPrice: 899.99,
        stock: 50,
        images: ['https://placehold.co/600x400?text=Smartphone+X'],
        department: electronicsId,
      },
      {
        name: 'Laptop Pro',
        description: 'High-performance laptop for professionals',
        price: 1499.99,
        stock: 30,
        images: ['https://placehold.co/600x400?text=Laptop+Pro'],
        department: electronicsId,
      },
      {
        name: 'Wireless Earbuds',
        description: 'Premium sound quality with noise cancellation',
        price: 199.99,
        discountPrice: 149.99,
        stock: 100,
        images: ['https://placehold.co/600x400?text=Wireless+Earbuds'],
        department: electronicsId,
      }
    );

    // Clothing products
    const clothingId = createdDepartments[1]._id;
    products.push(
      {
        name: 'Classic T-Shirt',
        description: 'Comfortable cotton t-shirt',
        price: 29.99,
        stock: 200,
        images: ['https://placehold.co/600x400?text=Classic+T-Shirt'],
        department: clothingId,
      },
      {
        name: 'Denim Jeans',
        description: 'Stylish and durable jeans',
        price: 59.99,
        discountPrice: 49.99,
        stock: 150,
        images: ['https://placehold.co/600x400?text=Denim+Jeans'],
        department: clothingId,
      },
      {
        name: 'Winter Jacket',
        description: 'Warm and waterproof winter jacket',
        price: 129.99,
        stock: 75,
        images: ['https://placehold.co/600x400?text=Winter+Jacket'],
        department: clothingId,
      }
    );

    // Home & Kitchen products
    const homeId = createdDepartments[2]._id;
    products.push(
      {
        name: 'Coffee Maker',
        description: 'Programmable coffee maker with timer',
        price: 89.99,
        discountPrice: 79.99,
        stock: 60,
        images: ['https://placehold.co/600x400?text=Coffee+Maker'],
        department: homeId,
      },
      {
        name: 'Blender Set',
        description: 'High-speed blender with multiple attachments',
        price: 129.99,
        stock: 45,
        images: ['https://placehold.co/600x400?text=Blender+Set'],
        department: homeId,
      },
      {
        name: 'Bedding Set',
        description: 'Luxury cotton bedding set',
        price: 99.99,
        discountPrice: 89.99,
        stock: 80,
        images: ['https://placehold.co/600x400?text=Bedding+Set'],
        department: homeId,
      }
    );

    // Books products
    const booksId = createdDepartments[3]._id;
    products.push(
      {
        name: 'Programming Guide',
        description: 'Comprehensive programming guide for beginners',
        price: 49.99,
        stock: 120,
        images: ['https://placehold.co/600x400?text=Programming+Guide'],
        department: booksId,
      },
      {
        name: 'Cookbook Collection',
        description: 'Collection of international recipes',
        price: 39.99,
        discountPrice: 34.99,
        stock: 90,
        images: ['https://placehold.co/600x400?text=Cookbook+Collection'],
        department: booksId,
      },
      {
        name: 'Science Fiction Novel',
        description: 'Bestselling science fiction novel',
        price: 24.99,
        stock: 150,
        images: ['https://placehold.co/600x400?text=Science+Fiction+Novel'],
        department: booksId,
      }
    );

    // Insert products
    const createdProducts = await Product.insertMany(products);
    console.log(`Added ${createdProducts.length} products`);

    console.log('Database seeded successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  });