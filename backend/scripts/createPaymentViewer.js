import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createPaymentViewer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Check if user already exists
    const existingUser = await User.findOne({ email: 'payment.viewer@example.com' });
    
    if (existingUser) {
      console.log('Payment viewer user already exists');
      await mongoose.connection.close();
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('PaymentViewer@123', salt);

    // Create new user
    const user = new User({
      name: 'Payment Viewer',
      email: 'payment.viewer@example.com',
      password: hashedPassword,
      type: 'payment_viewer',
      isActive: true
    });

    await user.save();
    console.log('✅ Payment viewer user created successfully');
    console.log('Email: payment.viewer@example.com');
    console.log('Password: PaymentViewer@123');
    
  } catch (error) {
    console.error('Error creating payment viewer user:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

createPaymentViewer();
