const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._%+-]+@iiit\.ac\.in$/,
  },
  age: { type: Number, required: true },
  contactNumber: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
