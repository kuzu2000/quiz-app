import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './App.css';
import { Provider } from 'react-redux';
import { quizApiSlice } from './features/quiz/quizApiSlice.js';
import store from './app/store.js';

store.dispatch(quizApiSlice.endpoints.getCategory.initiate())

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);
