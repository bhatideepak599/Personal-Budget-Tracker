// src/pages/Login/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api, setToken } from '../../api';
import { Button, Input } from '../../components/common';
import './Login.css';

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await api.login(formData.username, formData.password);
      setToken(data.access);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.message || 'Invalid username or password';
      toast.error(errorMsg);
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <header className="login-header">
          <div className="login-icon" aria-hidden="true">💰</div>
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to your budget tracker</p>
        </header>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <Input
            id="username"
            name="username"
            label="Username"
            type="text"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            autoComplete="username"
          />

          <Input
            id="password"
            name="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            autoComplete="current-password"
          />

          {error && (
            <Alert type="error" message={error} />
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
          >
            Sign In
          </Button>
        </form> 
      </div>
    </div>
  );
}