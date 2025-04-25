const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
      index: true,
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: [6, "Password must be aleast 6 character long"],
      select: false,
    },
    avatar: {
      type: String,
      default:
        "https://www.freepik.com/free-vector/blue-circle-with-white-user_145857007.htm#fromView=keyword&page=1&position=0&uuid=bc160f09-35f8-4dba-8ccc-b53044d194b1&query=Default+User",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified.password) {
    return next();
  }
  try {
    this.password = await argon2.hash(this.password, {
      type: argon2.argon2id,
    });
  } catch (error) {
    console.error("Error hashing the password", error);
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await argon2.verify(this.password, candidatePassword);
  } catch (error) {
    console.error("Please enter correct password", error);
    return false;
  }
};

userSchema.methods.getJWT = async function () {
  try {
    return await jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
  } catch (error) {
    console.error("Error generating JWT token:", error);
    throw new Error("Failed to generate authentication token");
  }
};
const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
