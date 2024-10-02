const User = require('../model/User');
const Notification = require('../model/Notification');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');
const { updateUserLevel } = require('../config/socketIo');
const addNewUser = asyncHandler(async (req, res) => {
  const { username, password, country } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const duplicate = await User.findOne({ username })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: 'Duplicate username' });
  }

  const hashedPwd = await bcrypt.hash(password, 10);

  const userObject = { username, password: hashedPwd, country };

  const user = await User.create(userObject);

  if (user) {
    res.status(201).json({ message: `New user ${username} created` });
  } else {
    res.status(400).json({ message: 'Invalid user data received' });
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  let user = await User.findOne({ _id: userId });

  if (!user) return res.status(404).json({ message: 'User not found' });

  res.status(200).json(user);
});

const experienceThresholds = [
  0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500,
];
const addExperience = asyncHandler(async (req, res) => {
  const { userId, exp } = req.body;
  let user = await User.findById({ _id: userId });

  if (!user) return res.status(403).json({ message: 'Unauthorized' });

  user.experience += exp;

  while (
    user.level < 10 &&
    user.experience >= experienceThresholds[user.level]
  ) {
    user.level += 1;
    console.log(`User leveled up to ${user.level}`);
    updateUserLevel(userId, user.level);
    const notification = new Notification({
      userId: user._id,
      message: `Congratulations! You leveled up to Level ${user.level}!`,
    });
    await notification.save();
  }

  if (user.level > 10) {
    user.level = 10;
  }

  await user.save();
  res.status(201).json(user);
});

const leaderboard = asyncHandler(async (req, res) => {
  const users = await User.find()
    .select('-password -__v')
    .sort({ experience: -1 })
    .limit(10)
    .lean()
    .exec();

  res.status(200).json(users);
});

module.exports = { addNewUser, addExperience, leaderboard, getUserById };
