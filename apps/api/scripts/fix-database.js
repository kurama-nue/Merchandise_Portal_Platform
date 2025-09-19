const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function main() {
  try {
    // Connect to MongoDB
    const uri = 'mongodb://localhost:27017/merch-portal';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    // Define User Schema
    const UserSchema = new mongoose.Schema({
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      role: { type: String, required: true },
      phone: String,
      department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' }
    });

    // Define Department Schema
    const DepartmentSchema = new mongoose.Schema({
      name: { type: String, required: true },
      description: { type: String }
    });

    // Create or get models
    const User = mongoose.models.User || mongoose.model('User', UserSchema);
    const Department = mongoose.models.Department || mongoose.model('Department', DepartmentSchema);

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
    console.log('Created departments:', departments.map(d => d.name).join(', '));

    // Create test users
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
        role: 'MANAGER',
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

    // Insert users
    const createdUsers = await User.create(users);
    console.log('Created users:', createdUsers.map(u => `${u.email} (${u.role})`).join(', '));

    // Verify users were created
    const foundUsers = await User.find({}).populate('department');
    console.log('\nVerifying created users:');
    foundUsers.forEach(user => {
      console.log(`- ${user.email} (${user.role})`);
    });

    console.log('\nDatabase setup complete! You can now try to login with these users.');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
