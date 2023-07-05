const { default: mongoose } = require("mongoose");

const WebUserSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  username: String,
  code: String,
  codeExpire: Date,
  forgetPassword: { type: String, default: null },
  isActive: {
    type: Boolean,
    default: false,
  },
  codeCounter: {
    type: Number,
    default: 3,
  },
});

const WebUser = new mongoose.model("WebUser", WebUserSchema);

module.exports = {
  WebUser,
};
