import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { apiSlice } from '../app/api/apiSlice';
import { useAddExperienceMutation } from '../features/noti/notiApiSlice';
import useAuth from '../hooks/useAuth';
import { useEffect } from 'react';

// eslint-disable-next-line react/prop-types
const Modal = ({ isModalOpen, closeModal, correct, questions, exp }) => {
  const { _id } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [addExperience, { isSuccess, isLoading }] = useAddExperienceMutation();

  const gainExperience = async () => {
    try {
      await addExperience({ userId: _id, exp }).unwrap();
    } catch (err) {
      console.error('Failed to add experience:', err);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      navigate('/')
      closeModal()
      dispatch(apiSlice.util.invalidateTags(['NotificationList']));
    }
  }, [isSuccess, navigate, dispatch, closeModal])

  return (
    <div
      className={`${
        isModalOpen ? 'modal-container isOpen' : 'modal-container'
      }`}
    >
      <div className="modal-content">
        <h2>Congrats!</h2>
        <p>
          You answered {((correct / questions?.length) * 100).toFixed(0)}% of
          questions correctly
        </p>
        <button className="close-btn" onClick={gainExperience}>
          Main Menu
        </button>
      </div>
    </div>
  );
};

export default Modal;
