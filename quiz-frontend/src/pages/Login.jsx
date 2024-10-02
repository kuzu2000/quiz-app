import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLoginMutation } from '../features/auth/authApiSlice';
import { setCredentials } from '../features/auth/authSlice';
import { useDispatch } from 'react-redux';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [focused, setFocused] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleFocus = () => {
    setFocused(true);
  };

  const [login, { isLoading, isSuccess, isError, error }] = useLoginMutation();

  const canSave = [username, password].every(Boolean) && !isLoading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (canSave) {
      const { accessToken } = await login({ username, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setUsername('');
      setPassword('');
      navigate('/');
    }
  }, [isSuccess, navigate]);

  return (
    <div className="box">
      <h2>Login</h2>
      {isError && <span className="errorBox">{JSON.stringify(error)}</span>}
      <form onSubmit={handleSubmit}>
        <div className="form">
          <input
            type="text"
            name="username"
            id="name"
            value={username}
            onBlur={handleFocus}
            onChange={(e) => setUsername(e.target.value)}
            focused={focused.toString()}
            autoFocus
            required
          />
          <label htmlFor="name">Username</label>
        </div>
        <div className="form">
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onBlur={handleFocus}
            onChange={(e) => setPassword(e.target.value)}
            focused={focused.toString()}
            required
          />
          <label htmlFor="password">Password</label>
        </div>
        {isLoading ? (
          <button type="submit" disabled={isLoading}>
            <i className="fa fa-spinner fa-spin"></i> Loading
          </button>
        ) : (
          <button type="submit" disabled={!canSave}>
            Login
          </button>
        )}
        <div style={{ marginTop: '10px' }}>
          Don't have an account?{' '}
          <span>
            <Link to={`/register`}>Register</Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;
