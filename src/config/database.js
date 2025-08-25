const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://abhitiwari2027:I8YLRT1lbF0Vq7sp@namastenode.h24ix.mongodb.net/devTinder"
  );
};

module.exports = {connectDB};

