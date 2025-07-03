const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

// ✅ Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/pintrestClone')
  .then(() => {
    console.log("✅ MongoDB connected successfully!");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// ✅ Define user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  // ❌ REMOVE password field — handled by passport-local-mongoose
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    }
  ],
  dp: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  },
});

// ✅ Add passport-local-mongoose plugin
userSchema.plugin(plm);

// ✅ Export the model
module.exports = mongoose.model('User', userSchema);
