import { useGetUserQuery } from '../features/user/userApiSlice';
import { useSendLogoutMutation } from '../features/auth/authApiSlice';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useEffect } from 'react';
const User = () => {
  const { _id } = useAuth();
  const navigate = useNavigate();
  const { data: user } = useGetUserQuery(_id);

  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) navigate('/login');
  }, [isSuccess, navigate]);

  return (
    <main>
      <div className="user-container">
        <h1>User</h1>
        <div className="users">
          <div className="user">{user?.username}</div>
          <div className="user">
            Level <span>{user?.level}</span>
          </div>
          <div className="user">
            <h3>Country</h3>
            <p>{user?.country}</p>
          </div>
          <div className="user">
            <h3>XP+</h3>
            <p>{user?.experience}</p>
          </div>
        </div>
        <button className="logout-btn" onClick={sendLogout}>
          {isLoading ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : (
            <>
              Logout
              <i className="fas fa-sign-out-alt"></i>
            </>
          )}
        </button>
      </div>
    </main>
  );
};

export default User;
