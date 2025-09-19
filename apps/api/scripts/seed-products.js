require('dotenv').config();
const mongoose = require('mongoose');

async function main() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/merch_portal';
    console.log('Connecting to MongoDB:', uri);
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    const DepartmentSchema = new mongoose.Schema({ name: String, description: String });
    const ProductSchema = new mongoose.Schema({
      name: String,
      description: String,
      price: Number,
      discountPrice: Number,
      stock: Number,
      images: [String],
      department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' }
    });

    const Department = mongoose.models.Department || mongoose.model('Department', DepartmentSchema);
    const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

    const departments = await Department.find({}).limit(10);
    if (!departments || departments.length === 0) {
      console.log('No departments found. Please run seed-db.js first to create departments.');
      process.exit(1);
    }

    console.log('Clearing existing products...');
    await Product.deleteMany({});

    const products = [
      // Clothing
      {
        name: 'Premium Graphic Tee',
        description: 'High-quality graphic tee made from 100% organic cotton',
        price: 29.99,
        discountPrice: null,
        stock: 128,
        images: [
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop'
        ],
        department: departments[0]._id
      },
      {
        name: 'Limited Edition Hoodie',
        description: 'Exclusive design hoodie with premium fabric and perfect fit',
        price: 59.99,
        discountPrice: 49.99,
        stock: 64,
        images: [
          'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=400&h=400&fit=crop'
        ],
        department: departments[0]._id
      },
      // Accessories
      {
        name: 'Designer Backpack',
        description: 'Stylish and durable backpack perfect for everyday use',
        price: 79.99,
        discountPrice: null,
        stock: 42,
        images: [
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1581605405669-fcdf81983e4d?w=400&h=400&fit=crop'
        ],
        department: departments[1]._id
      },
      {
        name: 'Notebook & Pen Set',
        description: 'Premium notebook and pen set with company logo',
        price: 18.99,
        discountPrice: 14.99,
        stock: 300,
        images: [
          'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop'
        ],
        department: departments[1]._id
      },
      {
        name: 'Designer Keychain',
        description: 'Metal keychain with custom engraving',
        price: 9.99,
        discountPrice: null,
        stock: 150,
        images: [
          'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=400&fit=crop'
        ],
        department: departments[1]._id
      },
      // Electronics
      {
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse with company branding',
        price: 15.99,
        discountPrice: null,
        stock: 200,
        images: [
          'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&h=400&fit=crop'
        ],
        department: departments[2]._id
      },
      {
        name: 'Smart Water Bottle',
        description: 'Temperature-controlled smart water bottle with app connectivity',
        price: 45.99,
        discountPrice: 39.99,
        stock: 85,
        images: [
          'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1594736797933-d0401ba49814?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop'
        ],
        department: departments[2]._id
      },
      // Home
      {
        name: 'Ceramic Mug',
        description: 'Classic ceramic mug with logo print',
        price: 12.99,
        discountPrice: 9.99,
        stock: 120,
        images: [
          'https://images.unsplash.com/photo-1517685352821-92cf88aee5a5?w=400&h=400&fit=crop'
        ],
        department: departments[3]._id
      },
      {
        name: 'Throw Pillow',
        description: 'Soft throw pillow with custom design',
        price: 24.99,
        discountPrice: null,
        stock: 60,
        images: [
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=400&fit=crop'
        ],
        department: departments[3]._id
      }
    ];

    const created = await Product.create(products);
    console.log(`Created ${created.length} products`);
    for (const p of created) console.log('- ', p.name);

    console.log('Product seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding products:', err);
    process.exit(1);
  }
}

main();
