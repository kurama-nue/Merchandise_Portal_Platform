require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function main() {
  try {
    // Use the same connection string as the main application
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/merch_portal';
    console.log('Connecting to MongoDB:', uri);
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    // Define schemas
    const UserSchema = new mongoose.Schema({
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      role: { type: String, required: true },
      phone: String,
      department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' }
    });

    const DepartmentSchema = new mongoose.Schema({
      name: { type: String, required: true },
      description: { type: String }
    });

    // Create or get models
    const User = mongoose.models.User || mongoose.model('User', UserSchema);
    const Department = mongoose.models.Department || mongoose.model('Department', DepartmentSchema);

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Department.deleteMany({});
    console.log('Cleared existing data');

    // Create departments
    console.log('Creating departments...');
    const departments = await Department.create([
      { name: 'Clothing', description: 'T-shirts, hoodies, and more' },
      { name: 'Accessories', description: 'Bags, bottles, and more' },
      { name: 'Electronics', description: 'Tech gadgets and devices' },
      { name: 'Home', description: 'Home and lifestyle products' },
      { name: 'Marketing', description: 'Marketing department' },
      { name: 'IT Department', description: 'Information Technology department' }
    ]);
    console.log(`Created departments: ${departments.map(d => d.name).join(', ')}`);

    // Create users
    console.log('Creating users...');
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

    const createdUsers = await User.create(users);
    console.log('Created users:');
    for (const user of createdUsers) {
      console.log(`- ${user.email} (${user.role})`);
    }

    // Verify users
    console.log('\nVerifying created users...');
    const foundUsers = await User.find({}).populate('department');
    for (const user of foundUsers) {
      console.log(`- ${user.email} (${user.role})`);
    }

    // Test finding a specific user
    const testUser = await User.findOne({ email: 'admin@demo.com' });
    if (testUser) {
      console.log('\nTest query successful - Found admin user');
    } else {
      console.log('\nWARNING: Test query failed - Could not find admin user');
    }

    console.log('\nDatabase setup complete! You can now try to login with these users.');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the script
main();
