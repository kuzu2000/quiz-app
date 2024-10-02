import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAddNewUserMutation } from '../features/user/userApiSlice';
import { countries } from './countries';
const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();
  const handleFocus = () => {
    setFocused(true);
  };

  const [addNewUser, { isLoading, isSuccess, isError, error }] =
    useAddNewUserMutation();

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };

  const canSave = [username, password, country].every(Boolean) && !isLoading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewUser({ username, password, country });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setUsername('');
      setPassword('');
      setCountry('');
      navigate('/login');
    }
  }, [isSuccess, navigate]);

  return (
    <div className="box">
      <h2>Register</h2>
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
        <div className="form">
          <select id="country" value={country} onChange={handleCountryChange}>
            <option value="">Select a country</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
        {isLoading ? (
          <button type="submit" disabled={isLoading}>
            <i className="fa fa-spinner fa-spin"></i> Loading
          </button>
        ) : (
          <button type="submit" disabled={!canSave}>
            Register
          </button>
        )}
        <div style={{ marginTop: '10px' }}>
          Already have an account?{' '}
          <span>
            <Link to={`/login`}>Login</Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Register;
