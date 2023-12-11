const { createHmac, randomBytes } = require("crypto");
const { Schema, model } = require("mongoose");
const { generateTokenForUser } = require("../services/auth");
const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
    profileImageUrl: {
      type: String,
      dafault: "/images/profile.jpg",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return;
  const salt = randomBytes(16).toString();
  const hashedpassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedpassword;
  next();
});

userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("user not found");

    const salt = user.salt;
    const userPassword = user.password;
    const hashedpassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    if (userPassword !== hashedpassword) throw new Error("Incorrect Password");

    const token = generateTokenForUser(user);
    return token;
  }
);

const User = model("users", userSchema);

module.exports = User;
