const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  category: { type: String, required: true },
  question: { type: String, required: true },
  correct_answer: { type: String, required: true },
  incorrect_answers: {
    type: [String],
    required: true,
    validate: {
      validator: function (array) {
        return array.length === 3;
      },
      message: 'The incorrect_answers field must contain exactly 3 answers.',
    },
  },
});

QuizSchema.index({ category: 1 })

const Quiz = mongoose.model('Quiz', QuizSchema);
module.exports = Quiz;
