// src/pages/auth/login/index.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../../../api/auth';
import styles from './style.module.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await signIn(formData);
      localStorage.setItem('token', response.token);
      navigate('/calendar');
    } catch (error) {
      if (error instanceof Error) {
        setError('존재하지 않는 아이디입니다.');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          &lt; 뒤로가기
        </button>
        <span>로그인</span>
      </div>

      <h1 className={styles.title}>Login</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label>아이디</label>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              placeholder="아이디를 입력해주세요"
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
            />
          </div>
          {error && <span className={styles.error}>{error}</span>}
        </div>

        <div className={styles.inputGroup}>
          <label>비밀번호</label>
          <div className={styles.inputWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호를 입력해주세요"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            {formData.password && (
              <button 
                type="button" 
                className={styles.visibilityButton}
                onClick={() => setShowPassword(!showPassword)}
              >
                👁
              </button>
            )}
          </div>
        </div>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={!formData.userId || !formData.password}
        >
          로그인
        </button>
      </form>
    </div>
  );
};

export default Login;