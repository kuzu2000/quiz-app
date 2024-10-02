const Notification = require('./../model/Notification');
const asyncHandler = require('express-async-handler');

const readNotifications = asyncHandler(async (req, res) => {
  const { notificationIds } = req.body;

  if (!notificationIds.length || !notificationIds)
    return res.status(404).json({ message: 'Notification field required' });

  await Notification.updateMany(
    { _id: { $in: notificationIds } },
    { read: true }
  );
  res.status(200).json({ message: 'Notifications marked as read' });
});

const getNotifications = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(403).json({ message: 'Forbidden' });

  const notifications = await Notification.find({ userId })
    .select('-__v')
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json(notifications);
});

module.exports = { getNotifications, readNotifications };
