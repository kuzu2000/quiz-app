import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentIndex: 0, // Index of the current question
  correctAnswers: 0, // Count of correct answers
  points: 0, // Total points
  isModalOpen: false, // Modal state
  waiting: true, // To manage quiz start/reset state
};

export const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    nextQuestion: (state, action) => {
      const { questionLength } = action.payload;
      const newIndex = state.currentIndex + 1;
      if (newIndex > questionLength - 1) {
        state.isModalOpen = true;
        state.currentIndex = 0;
      } else {
        state.currentIndex = newIndex;
      }
    },
    checkAnsweer: (state, action) => {
        const {value} = action.payload
        if(value) {
            state.correctAnswers += 1
            state.points = state.correctAnswers * 20
        }
    },
    openModal: (state) => {
        state.isModalOpen = true;
      },
      closeModal: (state) => {
        state.correctAnswers = 0;
        state.isModalOpen = false;
        state.waiting = true;
      },
      resetQuiz: (state) => {
        state.currentIndex = 0;
        state.correctAnswers = 0;
        state.points = 0;
        state.waiting = true;
      },
  },
});

export const {
    nextQuestion,
    checkAnswer,
    openModal,
    closeModal,
    resetQuiz,
  } = quizSlice.actions;

export default quizSlice.reducer