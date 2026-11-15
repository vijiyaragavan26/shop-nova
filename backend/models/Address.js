const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    fullName: {
      type: String,
      required: [true, 'Please provide full name'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Please provide mobile number'],
      trim: true
    },
    addressLine: {
      type: String,
      required: [true, 'Please provide street address / flat details'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'Please provide city'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'Please provide state'],
      trim: true
    },
    pincode: {
      type: String,
      required: [true, 'Please provide PIN code'],
      trim: true
    },
    landmark: {
      type: String,
      trim: true,
      default: ''
    },
    type: {
      type: String,
      enum: ['home', 'work', 'other'],
      default: 'home'
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Address', addressSchema);
