const User = require('../model/User');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const user = await User.findOne({ username });

  if (!user || !user.active)
    return res.status(401).json({ message: 'Unauthorized' });

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) return res.status(401).json({ message: 'Unauthorized' });

  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: user.username,
        _id: user._id
      },
    },
    process.env.ACCESS_TOKEN,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    {
      username: user.username,
      _id: user._id
    },
    process.env.REFRESH_TOKEN,
    { expiresIn: '7d' }
  );

  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken });
});

const refresh = asyncHandler(async (req, res) => {
    const cookies = req.cookies;

    console.log(cookies)
  
    if (!cookies.jwt) return res.status(403).json({ message: 'Unauthorized' });
  
    const refreshToken = cookies.jwt;
  
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, async (err, decode) => {
      if (err) return res.status(403).json({ message: 'Forbidden' });
  
      const user = await User.findOne({ username: decode.username });
  
      if (!user) return res.status(401).json({ message: 'Unauthorized' });
  
      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: user.username,
            _id: user._id
          },
        },
        process.env.ACCESS_TOKEN,
        { expiresIn: '15m' }
      );
  
      res.json({ accessToken });
    });
  });
  

const logOut = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  res.json({ message: 'Cookie cleared' });
});

module.exports = { login, refresh, logOut };
