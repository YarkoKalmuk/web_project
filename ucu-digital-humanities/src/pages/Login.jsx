import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h1 className="login-title">Ви вже увійшли</h1>
          <p className="login-info">
            Привіт, <strong>{user.username}</strong>! Ви авторизовані як{' '}
            <span className="role-badge">{user.role === 'admin' ? 'Адмін' : 'Користувач'}</span>
          </p>
          <button onClick={() => navigate('/events')} className="login-submit">
            Перейти до подій
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegisterMode) {
        await register(username, password);
      } else {
        await login(username, password);
      }
      navigate('/events');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsRegisterMode((prev) => !prev);
    setError('');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">
          {isRegisterMode ? 'Реєстрація' : 'Вхід'}
        </h1>
        <p className="login-subtitle">
          {isRegisterMode
            ? 'Створіть обліковий запис для доступу до сайту'
            : 'Увійдіть, щоб отримати доступ до функцій'}
        </p>

        {error && (
          <div className="login-error">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="login-username">Логін</label>
            <input
              type="text"
              id="login-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Введіть логін"
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Пароль</label>
            <input
              type="password"
              id="login-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введіть пароль"
              required
              autoComplete={isRegisterMode ? 'new-password' : 'current-password'}
            />
          </div>

          <button type="submit" className="login-submit" disabled={loading}>
            {loading
              ? (isRegisterMode ? 'Реєстрація...' : 'Вхід...')
              : (isRegisterMode ? 'Зареєструватися' : 'Увійти')}
          </button>
        </form>

        <div className="login-switch">
          {isRegisterMode ? 'Вже є акаунт?' : 'Немає акаунту?'}
          <button onClick={switchMode} className="switch-btn">
            {isRegisterMode ? 'Увійти' : 'Зареєструватися'}
          </button>
        </div>
      </div>
    </div>
  );
}
