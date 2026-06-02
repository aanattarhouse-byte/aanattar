import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  line1: { type: String, required: true },
  line2: String,
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: String, default: 'India' },
  isDefault: { type: Boolean, default: false }
}, { _id: true });

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  phone: { type: String, unique: true, index: true, sparse: true },
  email: { type: String, trim: true, lowercase: true },
  avatar: String,
  firebaseUid: { type: String, unique: true, index: true, sparse: true },
  displayName: { type: String, trim: true },
  photoURL: { type: String },
  provider: { type: String, default: 'google' },
  lastLogin: { type: Date },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  blocked: { type: Boolean, default: false },
  lockUntil: Date,
  addresses: [addressSchema]
}, { timestamps: true });

export default mongoose.model('User', userSchema);
