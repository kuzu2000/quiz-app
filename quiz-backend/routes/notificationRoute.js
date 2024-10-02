const jwtVerify = require('./../middleware/jwtVerify');
const express = require('express');
const router = express.Router();
const notificationController = require('./../controllers/notificationController');
router.use(jwtVerify);

router.route('/').get(notificationController.getNotifications);

router.route('/read').post(notificationController.readNotifications);

module.exports = router
