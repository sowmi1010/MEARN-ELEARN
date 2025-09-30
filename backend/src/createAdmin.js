// backend/src/createAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function createAdmin() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/elearn';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  const adminEmail = 'admin@example.com';

  const existing = await User.findOne({ email: adminEmail });
  if (existing) {
    console.log('Admin already exists:', existing.email);
    process.exit(0);
  }

  const admin = new User({
    name: 'Super Admin',
    email: adminEmail,
    password: 'admin123', // will be hashed by pre-save hook
    role: 'admin',
  });

  await admin.save();
  console.log('Admin created:', admin.email, 'password: admin123');
  process.exit(0);
}

createAdmin().catch(err => {
  console.error(err);
  process.exit(1);
});
