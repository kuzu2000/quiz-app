const jwt = require('jsonwebtoken');

const jwtVerify = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(403).json({ message: 'Unauthorized' });

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Unauthorized' });
    req.user = decoded.UserInfo;
    next();
  });
};

module.exports = jwtVerify