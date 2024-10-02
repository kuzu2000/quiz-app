import React, { useState, useEffect, useMemo } from 'react';
import Modal from '../component/Modal';
import { useLocation } from 'react-router-dom';
import { useGetQuizByCategoryQuery } from '../features/quiz/quizApiSlice';


const Quiz = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get('category');
  const { data } = useGetQuizByCategoryQuery(category);

  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [exp, setExp] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const questions = useMemo(() => data?.quizzes || [], [data]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCorrect(0);
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (index >= questions.length && questions.length > 0) {
      openModal();
      setIndex(0);
    }
  }, [index, questions]);

  if (!questions.length) {
    return <p>Loading...</p>;
  }

  const currentQuestion = questions[index] || {};
  const { question, correct_answer, incorrect_answers } = currentQuestion;

  if (!question) {
    return <p>No question available</p>;
  }

  let answers = [...incorrect_answers];
  const tempIndex = Math.floor(Math.random() * 4);

  if (tempIndex === 3) {
    answers.push(correct_answer);
  } else {
    answers.push(answers[tempIndex]);
    answers[tempIndex] = correct_answer;
  }

  const nextQuestion = () => {
    setIndex((oldIndex) => oldIndex + 1);
  };

  const checkAnswer = (value) => {
    if (value) {
      setCorrect((oldState) => {
        const currentState = oldState + 1;
        setExp(currentState * 20);
        return currentState;
      });
    }
    nextQuestion();
  };

  return (
    <main>
      <Modal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        correct={correct}
        questions={questions}
        exp={exp}
      />
      <section className="quiz">
        <p className="correct-answers">
          correct answers: {correct}/{index}
        </p>
        <article className="container">
          <h2 dangerouslySetInnerHTML={{ __html: question }} />
          <div className="btn-container">
            {answers.map((answer, idx) => (
              <button
                key={idx}
                className="answer-btn"
                onClick={() => checkAnswer(correct_answer === answer)}
                dangerouslySetInnerHTML={{ __html: answer }}
              />
            ))}
          </div>
        </article>
        <button className="next-question" onClick={nextQuestion}>
          next question
        </button>
      </section>
    </main>
  );
};

export default Quiz;
