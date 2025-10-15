require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (adminExists) {
      console.log('Admin user already exists');
      return;
    }

    const admin = new User({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });

    await admin.save();
    console.log('Admin user created: email: admin@example.com, password: admin123');
  } catch (err) {
    console.error('Error seeding admin:', err);
  } finally {
    mongoose.connection.close();
  }
}

seedAdmin();
