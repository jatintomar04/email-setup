import mongoose from 'mongoose';

const emailSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: String, required: true },
  subject: { type: String },
  message: { type: String },
  filePath: { type: String }, // optional
  sentAt: { type: Date, default: Date.now }
});

export default mongoose.model('Email', emailSchema);
