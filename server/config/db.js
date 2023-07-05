const { default: mongoose } = require("mongoose");

const db = {
  connect: async () => {
    try {
      await mongoose.connect(
        "mongodb+srv://imranovazer:20023838Aze@blog.6ft9u8s.mongodb.net/chatDB"
      );
      console.log("CONNECTED!");
    } catch (err) {
      console.log("Mongodb connection error!!");
      console.log(err);
    }
  },
};

module.exports = {
  db,
};
