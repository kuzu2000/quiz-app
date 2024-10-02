import { ToastContainer, toast } from 'react-toastify';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from './component/NavBar';
import QuizCategory from './pages/QuizCategory';
import Notification from './pages/Notification';
import LeaderBoard from './pages/LeaderBoard';
import Quiz from './pages/Quiz';
import Register from './pages/Register';
import Login from './pages/Login';

import useAuth from './hooks/useAuth';
import User from './pages/User';
function App() {
  const { _id } = useAuth();
  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<QuizCategory />} />

          <Route
            path="/notification"
            element={_id ? <Notification /> : <Navigate to="/login" />}
          />

          <Route path="/leaderboard" element={<LeaderBoard />} />

          <Route
            path="/quiz"
            element={_id ? <Quiz /> : <Navigate to="/login" />}
          />

          <Route
            path="/user"
            element={_id ? <User /> : <Navigate to="/login" />}
          />

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </>
  );
}
export default App;
