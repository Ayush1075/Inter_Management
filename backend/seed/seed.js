const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Batch = require('../models/Batch');

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected for seeding...');

    // Drop the problematic index before clearing data
    try {
      console.log('Attempting to drop old googleId_1 index...');
      await User.collection.dropIndex('googleId_1');
      console.log('Index googleId_1 dropped successfully.');
    } catch (error) {
      // This will throw an error if the index doesn't exist, which is fine on a fresh DB.
      console.log('Could not drop index (it may not exist), continuing...');
    }


    await User.deleteMany({});
    await Batch.deleteMany({});

    console.log('Cleared existing data...');

    const batchA = await new Batch({ name: 'Batch-A' }).save();
    const batchB = await new Batch({ name: 'Batch-B' }).save();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const users = [
      { email: 'ceo@example.com', name: 'John CEO', password: hashedPassword, role: 'CEO' },
      { email: 'hr@example.com', name: 'Sarah HR', password: hashedPassword, role: 'HR' },
      { email: 'mentor.a@example.com', name: 'Alex Mentor', password: hashedPassword, role: 'MENTOR', batchId: batchA._id },
      { email: 'mentor.b@example.com', name: 'Beth Mentor', password: hashedPassword, role: 'MENTOR', batchId: batchB._id },
      { email: 'intern.a1@example.com', name: 'Alice Intern', password: hashedPassword, role: 'INTERN', batchId: batchA._id },
      { email: 'intern.a2@example.com', name: 'Bob Intern', password: hashedPassword, role: 'INTERN', batchId: batchA._id },
      { email: 'intern.b1@example.com', name: 'Charlie Intern', password: hashedPassword, role: 'INTERN', batchId: batchB._id },
      { email: 'intern.b2@example.com', name: 'Diana Intern', password: hashedPassword, role: 'INTERN', batchId: batchB._id },
    ];

    await User.insertMany(users);

    console.log('Database seeded!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB(); 