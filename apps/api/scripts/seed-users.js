const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/merch-portal';

// User schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  role: String,
  phone: String,
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' }
});

// Department schema
const departmentSchema = new mongoose.Schema({
  name: String,
  description: String
});

const User = mongoose.model('User', userSchema);
const Department = mongoose.model('Department', departmentSchema);

async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Department.deleteMany({});

    // Create departments
    const departments = await Department.create([
      {
        name: 'IT Department',
        description: 'Information Technology department'
      },
      {
        name: 'Marketing',
        description: 'Marketing department'
      }
    ]);

    // Create users with hashed passwords
    const users = [
      {
        email: 'admin@demo.com',
        password: await bcrypt.hash('Admin@123', 12),
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        phone: '+1234567890'
      },
      {
        email: 'dept@demo.com',
        password: await bcrypt.hash('Dept@123', 12),
        firstName: 'Department',
        lastName: 'Head',
        role: 'DEPT_HEAD',
        phone: '+1234567891',
        department: departments[0]._id
      },
      {
        email: 'user@demo.com',
        password: await bcrypt.hash('User@123', 12),
        firstName: 'Regular',
        lastName: 'User',
        role: 'CUSTOMER',
        phone: '+1234567892',
        department: departments[1]._id
      }
    ];

    await User.create(users);
    console.log('Users created successfully');

    await mongoose.disconnect();
    console.log('Done!');
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
