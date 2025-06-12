import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  displayName: String,
  email: String,
  photo: String,
  accessToken: String || null,
  refreshToken: String || null,
}, { timestamps: true });

export default mongoose.model('User', userSchema);
