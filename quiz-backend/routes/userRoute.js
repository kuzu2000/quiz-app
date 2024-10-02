const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
router.route('/').post(userController.addNewUser);

router.route('/add-experience').post(userController.addExperience)

router.route('/leaderboard').get(userController.leaderboard)

router.route('/get-user').get(userController.getUserById)

module.exports = router;
