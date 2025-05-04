const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
  email: { type: String, required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  message: { type: String },
  status: { type: String, default: "Pending" },
});

module.exports = mongoose.model("Request", RequestSchema);