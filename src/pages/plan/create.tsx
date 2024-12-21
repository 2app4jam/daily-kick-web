import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomBar from '../../assets/components/bottombar';
import styles from './style.module.css';

interface PlanForm {
  content: string;
  startTime: string;
  endTime: string;
  isDaily: boolean;
}

const CreatePlan = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'direct' | 'ai'>('direct');
  const [planForm, setPlanForm] = useState<PlanForm>({
    content: '',
    startTime: '15:50',
    endTime: '18:00',
    isDaily: false,
  });

  const handleSubmit = async () => {
    const payload = {
      content: planForm.content, // 요청 데이터에 content만 포함
    };

    try {
      const token = localStorage.getItem('authToken'); // 로컬 스토리지에서 토큰 가져오기

      if (!token) {
        alert('로그인이 필요합니다. 다시 로그인하세요.');
        navigate('/login');
        return;
      }

      console.log('요청 데이터:', payload);

      const response = await axios.post('http://172.16.20.82:8000/schedule/', payload, {
        headers: {
          Authorization: `Bearer ${token}`, // 토큰을 헤더에 포함
          'Content-Type': 'application/json',
        },
      });

      console.log('응답 데이터:', response.data);
      alert('계획이 성공적으로 추가되었습니다.');
      navigate('/plan'); // 계획 목록으로 이동
    } catch (error: any) {
      if (error.response?.status === 422) {
        console.error('요청 데이터 형식 오류:', error.response.data);
        alert('요청 데이터가 잘못되었습니다. 입력값을 확인하세요.');
      } else {
        console.error('계획 추가 중 오류 발생:', error.message);
        alert('계획 추가에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <div className={styles.container}>
      {/* 상단 헤더 */}
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          ←
        </button>
        <h1 className={styles.title}>계획 작성하기</h1>
      </div>

      {/* 탭 */}
      <div className={styles.viewTabs}>
        <button
          onClick={() => setActiveTab('direct')}
          className={`${styles.viewTab} ${
            activeTab === 'direct' ? styles.activeTab : ''
          }`}
        >
          직접 추가
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`${styles.viewTab} ${
            activeTab === 'ai' ? styles.activeTab : ''
          }`}
        >
          AI로 자투리 활용
        </button>
      </div>

      {/* 폼 컨텐츠 */}
      {activeTab === 'direct' ? (
        <DirectInputView planForm={planForm} setPlanForm={setPlanForm} />
      ) : (
        <AIView />
      )}

      {/* 하단 버튼 */}
      <button className={styles.submitButton} onClick={handleSubmit}>
        계획 추가
      </button>

      <BottomBar />
    </div>
  );
};

interface DirectInputProps {
  planForm: PlanForm;
  setPlanForm: React.Dispatch<React.SetStateAction<PlanForm>>;
}

const DirectInputView = ({ planForm, setPlanForm }: DirectInputProps) => {
  return (
    <div className={styles.formContainer}>
      <div className={styles.formSection}>
        <textarea
          placeholder="계획 내용을 작성해 주세요"
          value={planForm.content}
          onChange={(e) => setPlanForm({ ...planForm, content: e.target.value })}
          className={styles.contentInput}
        />
      </div>
    </div>
  );
};

const AIView = () => {
  return (
    <div className={styles.formContainer}>
      <div className={styles.formSection}>
        <textarea
          placeholder="자투리 요구사항을 작성해 주세요"
          className={styles.contentInput}
        />
      </div>
    </div>
  );
};

export default CreatePlan;
