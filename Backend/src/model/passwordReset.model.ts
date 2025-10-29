import { Schema, model } from 'mongoose';

const passwordResetSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // TTL index for automatic cleanup
  },
  used: {
    type: Boolean,
    default: false
  },
  ipAddress: {
    type: String,
    required: false
  },
  userAgent: {
    type: String,
    required: false
  }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

// Compound index for efficient queries
passwordResetSchema.index({ userId: 1, used: 1 });
passwordResetSchema.index({ token: 1, used: 1 });

// Pre-save middleware to ensure token is unique
passwordResetSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Check if token already exists
    const existingToken = await this.model('PasswordReset').findOne({ token: this.token });
    if (existingToken) {
      const error = new Error('Token already exists');
      return next(error);
    }
  }
  next();
});

// Static method to clean up expired tokens
passwordResetSchema.statics.cleanupExpiredTokens = async function() {
  const result = await this.deleteMany({
    $or: [
      { expiresAt: { $lt: new Date() } },
      { used: true }
    ]
  });
  return result;
};

// Instance method to mark token as used
passwordResetSchema.methods.markAsUsed = function() {
  this.used = true;
  return this.save();
};

// Instance method to check if token is valid
passwordResetSchema.methods.isValid = function() {
  return !this.used && this.expiresAt > new Date();
};

const PasswordReset = model('PasswordReset', passwordResetSchema);

export default PasswordReset;
