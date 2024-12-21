// src/pages/auth/firstview/index.tsx
import { useNavigate } from 'react-router-dom';
import styles from './style.module.css';
import firstViewBackground from '../../../assets/images/firstViewBackground.png';

const FirstView = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <img 
        src={firstViewBackground} 
        alt="background" 
        className={styles.backgroundImage}
      />
      <div className={styles.content}>
        <h1 className={styles.title}>
          <span>완벽한 하루를 위한 작은 변화</span>
          <span>Daily Kick</span>
        </h1>
      </div>
      <div className={styles.buttonContainer}>
        <button 
          className={styles.loginButton}
          onClick={() => navigate('/login')}
        >
          로그인
        </button>
        <button 
          className={styles.signupButton}
          onClick={() => navigate('/signup')}
        >
          회원가입
        </button>
      </div>
    </div>
  );
};

export default FirstView;