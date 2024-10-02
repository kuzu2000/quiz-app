const asyncHandler = require('express-async-handler');
const Quiz = require('../model/Quiz');

const addNewQuiz = asyncHandler(async (req, res) => {
  const { category, question, correct_answer, incorrect_answers } = req.body;

  if (
    !category ||
    !question ||
    !correct_answer ||
    !Array.isArray(incorrect_answers)
  ) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const quizObject = {
      category,
      question,
      correct_answer,
      incorrect_answers,
    };
    const quiz = await Quiz.create(quizObject);

    return res.status(201).json({ message: 'The quiz has been created' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
});

const uniqueCategory = asyncHandler(async (req, res) => {
  const categories = await Quiz.distinct('category');
  res.status(200).json({ results: categories });
});

const getQuizByCategory = asyncHandler(async (req, res) => {
  const { category } = req.query;

  if(category) {
    const quizzes = await Quiz.find({category: { $regex: new RegExp(category, 'i') }}).select('-__v').lean()

    if (!quizzes || !quizzes.length) return res.status(400).json({message: "Quizzes not found"})

    res.status(200).json({quizzes})
  }
});

module.exports = { addNewQuiz, uniqueCategory, getQuizByCategory };
