require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function fixDatabase() {
  try {
    // Connect to MongoDB
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/merch-portal';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    // Define schemas
    const UserSchema = new mongoose.Schema({
      email: String,
      password: String,
      firstName: String,
      lastName: String,
      role: String,
      phone: String,
      department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' }
    });

    const DepartmentSchema = new mongoose.Schema({
      name: String,
      description: String
    });

    // Create models
    const User = mongoose.model('User', UserSchema);
    const Department = mongoose.model('Department', DepartmentSchema);

    // Clear existing data
    await User.deleteMany({});
    await Department.deleteMany({});
    console.log('Cleared existing data');

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
    console.log('Created departments');

    // Create users
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
    console.log('Created users');

    console.log('Database setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixDatabase();
