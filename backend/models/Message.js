const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true, // This automatically creates 'createdAt'
  }
);

// Export the model so other files can use it
module.exports = mongoose.model('Message', messageSchema);