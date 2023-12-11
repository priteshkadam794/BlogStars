const JWT = require("jsonwebtoken");

const secretKey = "$P#@@#*7^7$$";

function generateTokenForUser(user) {
  const payload = {
    fullName: user.fullName,
    _id: user._id,
    email: user.email,
    role: user.role,
  };

  const token = JWT.sign(payload, secretKey);
  return token;
}

function validateToken(token) {
  const payload = JWT.verify(token, secretKey);
  return payload;
}

module.exports = {
  generateTokenForUser,
  validateToken,
};
