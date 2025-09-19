import { PrismaClient, UserRole } from '@prisma/client';
import { hashPassword } from '../src/middleware/bcrypt.middleware';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding...');

  // Clean up existing data
  await cleanDatabase();

  // Create departments
  const departments = await createDepartments();

  // Create users
  const users = await createUsers(departments);

  // Create products
  const products = await createProducts(departments);

  // Create FAQs
  await createFAQs(products);

  console.log('Seeding completed successfully!');
}

async function cleanDatabase() {
  console.log('Cleaning up existing data...');
  
  // Delete in order to respect foreign key constraints
  await prisma.fAQ.deleteMany();
  await prisma.distributionItem.deleteMany();
  await prisma.distributionSchedule.deleteMany();
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.groupOrderMember.deleteMany();
  await prisma.groupOrder.deleteMany();
  await prisma.individualOrder.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();
  
  console.log('Database cleaned');
}

async function createDepartments() {
  console.log('Creating departments...');
  
  const departments = [
    {
      name: 'IT Department',
      description: 'Information Technology department responsible for technical merchandise'
    },
    {
      name: 'Marketing',
      description: 'Marketing department responsible for promotional merchandise'
    },
    {
      name: 'Human Resources',
      description: 'HR department responsible for employee merchandise and onboarding kits'
    },
    {
      name: 'Sales',
      description: 'Sales department responsible for client-facing merchandise'
    },
  ];

  const createdDepartments = [];

  for (const dept of departments) {
    const createdDept = await prisma.department.create({
      data: dept
    });
    createdDepartments.push(createdDept);
    console.log(`Created department: ${createdDept.name}`);
  }

  return createdDepartments;
}

async function createUsers(departments) {
  console.log('Creating users...');
  
  const users = [
    {
      email: 'admin@demo.com',
      password: await hashPassword('Admin@123'),
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      phone: '+1234567890',
      departmentId: null // Admin doesn't belong to a specific department
    },
    {
      email: 'dept@demo.com',
      password: await hashPassword('Dept@123'),
      firstName: 'Department',
      lastName: 'Head',
      role: UserRole.MANAGER,
      phone: '+1234567891',
      departmentId: departments[0].id // IT Department head
    },
    {
      email: 'user@demo.com',
      password: await hashPassword('User@123'),
      firstName: 'Regular',
      lastName: 'User',
      role: UserRole.CUSTOMER,
      phone: '+1234567892',
      departmentId: departments[1].id // Marketing department
    },
    {
      email: 'staff1@demo.com',
      password: await hashPassword('Staff@123'),
      firstName: 'Staff',
      lastName: 'One',
      role: UserRole.STAFF,
      phone: '+1234567893',
      departmentId: departments[2].id // HR department
    },
    {
      email: 'staff2@demo.com',
      password: await hashPassword('Staff@123'),
      firstName: 'Staff',
      lastName: 'Two',
      role: UserRole.STAFF,
      phone: '+1234567894',
      departmentId: departments[3].id // Sales department
    },
  ];

  const createdUsers = [];

  for (const user of users) {
    const createdUser = await prisma.user.create({
      data: user
    });
    createdUsers.push(createdUser);
    console.log(`Created user: ${createdUser.email}`);
  }

  return createdUsers;
}

async function createProducts(departments) {
  console.log('Creating products...');
  
  const products = [
    // IT Department Products
    {
      name: 'Company Branded Laptop Sleeve',
      description: 'High-quality laptop sleeve with company logo, fits laptops up to 15 inches',
      price: 25.99,
      discountPrice: 19.99,
      stock: 100,
      images: ['laptop_sleeve_1.jpg', 'laptop_sleeve_2.jpg'],
      departmentId: departments[0].id
    },
    {
      name: 'Wireless Mouse',
      description: 'Ergonomic wireless mouse with company branding',
      price: 15.99,
      discountPrice: null,
      stock: 150,
      images: ['wireless_mouse_1.jpg'],
      departmentId: departments[0].id
    },
    
    // Marketing Department Products
    {
      name: 'Marketing Brochure Templates',
      description: 'Set of 10 professionally designed brochure templates with company branding',
      price: 49.99,
      discountPrice: 39.99,
      stock: 50,
      images: ['brochure_templates.jpg'],
      departmentId: departments[1].id
    },
    {
      name: 'Branded Notebook and Pen Set',
      description: 'Premium notebook and pen set with company logo',
      price: 18.99,
      discountPrice: 15.99,
      stock: 200,
      images: ['notebook_set_1.jpg', 'notebook_set_2.jpg'],
      departmentId: departments[1].id
    },
    
    // HR Department Products
    {
      name: 'New Employee Welcome Kit',
      description: 'Complete welcome kit for new employees including branded items',
      price: 75.99,
      discountPrice: null,
      stock: 30,
      images: ['welcome_kit.jpg'],
      departmentId: departments[2].id
    },
    {
      name: 'Company Culture Handbook',
      description: 'Illustrated handbook detailing company culture and values',
      price: 12.99,
      discountPrice: 9.99,
      stock: 100,
      images: ['culture_handbook.jpg'],
      departmentId: departments[2].id
    },
    
    // Sales Department Products
    {
      name: 'Client Gift Basket',
      description: 'Premium gift basket for key clients with assorted branded items',
      price: 89.99,
      discountPrice: 79.99,
      stock: 25,
      images: ['gift_basket_1.jpg', 'gift_basket_2.jpg'],
      departmentId: departments[3].id
    },
    {
      name: 'Sales Presentation Template',
      description: 'Professional PowerPoint template for sales presentations',
      price: 29.99,
      discountPrice: null,
      stock: 75,
      images: ['sales_template.jpg'],
      departmentId: departments[3].id
    },
  ];

  const createdProducts = [];

  for (const product of products) {
    const createdProduct = await prisma.product.create({
      data: product
    });
    createdProducts.push(createdProduct);
    console.log(`Created product: ${createdProduct.name}`);
  }

  return createdProducts;
}

async function createFAQs(products) {
  console.log('Creating FAQs...');
  
  const faqs = [
    // FAQs for Laptop Sleeve
    {
      productId: products[0].id,
      question: 'What materials is the laptop sleeve made of?',
      answer: 'The laptop sleeve is made of water-resistant neoprene with a soft microfiber interior lining to protect your device.',
      isPublished: true
    },
    {
      productId: products[0].id,
      question: 'Can it fit a 16-inch MacBook Pro?',
      answer: 'Yes, while designed for laptops up to 15 inches, the sleeve has enough stretch to accommodate a 16-inch MacBook Pro.',
      isPublished: true
    },
    
    // FAQs for Wireless Mouse
    {
      productId: products[1].id,
      question: 'What is the battery life of the wireless mouse?',
      answer: 'The wireless mouse has an average battery life of 6 months with regular use. It uses one AA battery (included).',
      isPublished: true
    },
    {
      productId: products[1].id,
      question: 'Is the wireless mouse compatible with Mac?',
      answer: 'Yes, the wireless mouse is compatible with both Windows and Mac operating systems.',
      isPublished: true
    },
    
    // FAQs for Marketing Brochure Templates
    {
      productId: products[2].id,
      question: 'What file formats are included with the templates?',
      answer: 'The templates come in Adobe InDesign (.indd), Adobe Illustrator (.ai), and Microsoft Publisher (.pub) formats.',
      isPublished: true
    },
    
    // FAQs for New Employee Welcome Kit
    {
      productId: products[4].id,
      question: 'What items are included in the welcome kit?',
      answer: 'The welcome kit includes a branded notebook, pen, water bottle, t-shirt, laptop sticker set, and an employee handbook.',
      isPublished: true
    },
    {
      productId: products[4].id,
      question: 'Can the welcome kit be customized?',
      answer: 'Yes, for orders of 10 or more kits, we offer customization options. Please contact the HR department for details.',
      isPublished: true
    },
    
    // FAQs for Client Gift Basket
    {
      productId: products[6].id,
      question: 'Is international shipping available for the gift baskets?',
      answer: 'Yes, we offer international shipping for the gift baskets. Additional shipping fees may apply based on destination.',
      isPublished: true
    },
    {
      productId: products[6].id,
      question: 'Can I add a personalized note to the gift basket?',
      answer: 'Absolutely! You can add a personalized note during the checkout process at no additional cost.',
      isPublished: true
    },
  ];

  for (const faq of faqs) {
    const createdFaq = await prisma.fAQ.create({
      data: faq
    });
    console.log(`Created FAQ: ${createdFaq.question}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });