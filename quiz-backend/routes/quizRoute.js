const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

router.route('/').post(quizController.addNewQuiz).get(quizController.getQuizByCategory);

router.route('/category').get(quizController.uniqueCategory);

module.exports = router;
