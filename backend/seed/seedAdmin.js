require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

const ADMIN_NAME = process.env.ADMIN_NAME || 'RSN Admin';
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@rsnseafood.lk').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@12345';
const ADMIN_PHONE = process.env.ADMIN_PHONE || '0750519450';

async function run() {
  await connectDB();

  let user = await User.findOne({ email: ADMIN_EMAIL }).select('+password');
  if (user) {
    user.role = 'admin';
    user.password = ADMIN_PASSWORD; // will be re-hashed by pre-save hook
    await user.save();
    console.log(`[Seed] Existing user promoted/reset as admin: ${ADMIN_EMAIL}`);
  } else {
    user = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      phone: ADMIN_PHONE,
      role: 'admin',
    });
    console.log(`[Seed] Admin user created: ${ADMIN_EMAIL}`);
  }

  console.log('----------------------------------------');
  console.log('Admin login:');
  console.log(`  Email:    ${ADMIN_EMAIL}`);
  console.log(`  Password: ${ADMIN_PASSWORD}`);
  console.log('Login at /admin/login — change the password afterwards.');
  console.log('----------------------------------------');

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
