import { useGetCategoryQuery } from '../features/quiz/quizApiSlice';
import { Link } from 'react-router-dom';

const QuizCategory = () => {

  const { data, isLoading, isError } = useGetCategoryQuery();

  return (
    <main>
      <div className="quiz-category">
        <h1>Quiz Category</h1>
        {isLoading && <h2>Loading...</h2>}
        <ul className="quiz-category-list">
          {data?.results.map((category) => (
            <Link
              className="link"
              to={`quiz?category=${category}`}
              key={category}
            >
              <li>
                <h1>{category}</h1>
                <p>10 questions</p>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default QuizCategory;
