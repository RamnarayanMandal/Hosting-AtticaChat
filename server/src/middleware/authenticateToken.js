const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: "Access token is missing" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid access token" });
    }
    req.manager = decoded.manager;
    next();
  });
};

module.exports = authenticateToken;
