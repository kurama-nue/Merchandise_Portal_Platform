require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

async function main() {
  const jsonPathArg = process.argv[2] || path.join(__dirname, '../../crawler/products.json');
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/merch_portal';

  console.log('Connecting to MongoDB:', mongoUri);
  await mongoose.connect(mongoUri);

  // Define minimal schemas compatible with app models
  const DepartmentSchema = new mongoose.Schema({ name: String, description: String });
  const ProductSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    discountPrice: Number,
    stock: Number,
    images: [String],
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  });

  const Department = mongoose.models.Department || mongoose.model('Department', DepartmentSchema);
  const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

  if (!fs.existsSync(jsonPathArg)) {
    console.error('Input JSON not found:', jsonPathArg);
    process.exit(1);
  }

  const raw = fs.readFileSync(jsonPathArg, 'utf8');
  const products = JSON.parse(raw);
  console.log(`Loaded ${products.length} products from ${jsonPathArg}`);

  // Ensure default departments exist
  let department = await Department.findOne({ name: 'Accessories' });
  if (!department) {
    department = await Department.create({ name: 'Accessories', description: 'Imported products' });
    console.log('Created department:', department.name);
  }

  let created = 0, updated = 0;

  for (const p of products) {
    const name = p.title || 'Untitled';
    const price = Number(p.price) || 0;
    const images = Array.isArray(p.images) ? p.images.map(i => i.source_image_url).filter(Boolean) : [];
    const description = (p.description_short || '').toString();

    // Upsert by name+price heuristic
    const existing = await Product.findOne({ name, price });
    if (existing) {
      existing.description = description;
      existing.images = images;
      existing.department = department._id;
      await existing.save();
      updated++;
    } else {
      await Product.create({
        name,
        description,
        price,
        discountPrice: null,
        stock: 50,
        images,
        department: department._id,
      });
      created++;
    }
  }

  console.log(`Import complete. Created: ${created}, Updated: ${updated}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Import error:', err);
  process.exit(1);
});
