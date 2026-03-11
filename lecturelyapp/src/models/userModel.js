import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    password: {
      type: String, // hashed password
    },

    image: String,
  },
  { timestamps: true },
);

export default models.User || model("User", userSchema);

// import { Schema, model, models } from "mongoose";

// const userSchema = new Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//   },
// });

// export default models.User || model("User", userSchema);
