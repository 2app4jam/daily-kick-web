// src/pages/auth/signup/index.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../../../api/auth';
import styles from './style.module.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(formData);
      navigate('/login');
    } catch (error) {
      if (error instanceof Error) {
        alert('이미 있는 아이디입니다.');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          &lt; 뒤로가기
        </button>
        <span>회원가입</span>
      </div>

      <h1 className={styles.title}>Sign Up</h1>

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

        <div className={styles.termsContainer}>
          <p className={styles.terms}>
            계정을 생성함으로써,<br />
            <span className={styles.highlight}>이용약관</span>과{' '}
            <span className={styles.highlight}>개인정보처리방침</span>을 동의하시게 됩니다.
          </p>
        </div>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={!formData.userId || !formData.password}
        >
          다음
        </button>
      </form>
    </div>
  );
};

export default SignUp;