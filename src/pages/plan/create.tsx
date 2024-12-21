import axios from 'axios';
import { useState } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);
  const [aiRequirement, setAiRequirement] = useState('');

  const handleSubmitPlan = async (payload: any) => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      alert('인증 토큰이 없습니다. 다시 로그인해주세요.');
      navigate('/login');
      return;
    }

    try {
      await axios.post('http://172.16.20.82:8000/schedule/', payload, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      alert('일정이 추가되었습니다.');
      navigate('/plan');
    } catch (error: any) {
      console.error('일정 추가 중 오류 발생:', error);
      alert(error.response?.data.message || '일정 추가에 실패했습니다.');
    }
  };

  const handleDirectSubmit = async () => {
    if (!planForm.content.trim()) {
      alert('일정 내용을 입력해주세요.');
      return;
    }

    const [startHour, startMinute] = planForm.startTime.split(':');
    const [endHour, endMinute] = planForm.endTime.split(':');
    const tempStart = new Date(2024, 11, 24, parseInt(startHour), parseInt(startMinute));
    const tempEnd = new Date(2024, 11, 24, parseInt(endHour), parseInt(endMinute));

    if (tempStart >= tempEnd) {
      alert('종료 시간은 시작 시간보다 뒤여야 합니다.');
      return;
    }

    const fixedDate = '2024-12-24';
    const payload = {
      title: planForm.content,
      description: planForm.content,
      start_datetime: `${fixedDate}T${planForm.startTime}:00`,
      end_datetime: `${fixedDate}T${planForm.endTime}:00`,
      type: "PLAN"
    };

    await handleSubmitPlan(payload);
  };

  const handleAIRecommendation = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        alert('인증 토큰이 없습니다. 다시 로그인해주세요.');
        navigate('/login');
        return;
      }

      if (!aiRequirement.trim()) {
        alert('자투리 시간에 하고 싶은 일을 입력해주세요.');
        return;
      }

      const formattedDate = '2024-12-24';
      // 자투리 시간 추천 API 호출
      await axios.get(`http://172.16.20.82:8000/scrap/free-times`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        params: {
          date: formattedDate,
          requirement: aiRequirement
        },
      });

      // API가 직접 일정을 추가하므로, 리스트 페이지로 이동
      navigate('/plan');

    } catch (error: any) {
      console.error('AI 추천 실패:', error);
      alert(error.response?.data.message || 'AI 추천에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const times = Array.from({ length: 24 }, (_, i) => {
    const hour = String(i).padStart(2, '0');
    return [`${hour}:00`, `${hour}:30`];
  }).flat();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          ←
        </button>
        <h1 className={styles.title}>계획 작성하기</h1>
      </div>

      <div className={styles.viewTabs}>
        <button
          onClick={() => setActiveTab('direct')}
          className={`${styles.viewTab} ${activeTab === 'direct' ? styles.activeTab : ''}`}
          disabled={isLoading}
        >
          직접 추가
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`${styles.viewTab} ${activeTab === 'ai' ? styles.activeTab : ''}`}
          disabled={isLoading}
        >
          AI로 자투리 활용
        </button>
      </div>

      {activeTab === 'direct' ? (
        <div className={styles.formContainer}>
          <div className={styles.formSection}>
            <textarea
              placeholder="계획 내용을 작성해 주세요"
              value={planForm.content}
              onChange={(e) => setPlanForm({ ...planForm, content: e.target.value })}
              className={styles.contentInput}
            />
          </div>

          <div className={styles.formSection}>
            <div className={styles.timeSelector}>
              <span>시작 시간</span>
              <select
                value={planForm.startTime}
                onChange={(e) => setPlanForm({ ...planForm, startTime: e.target.value })}
              >
                {times.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            <div className={styles.timeSelector}>
              <span>종료 시간</span>
              <select
                value={planForm.endTime}
                onChange={(e) => setPlanForm({ ...planForm, endTime: e.target.value })}
              >
                {times.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formSection}>
            <label className={styles.toggleContainer}>
              <span>매일 고정</span>
              <div className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={planForm.isDaily}
                  onChange={(e) => setPlanForm({ ...planForm, isDaily: e.target.checked })}
                />
                <span className={styles.toggleSlider} />
              </div>
            </label>
          </div>
        </div>
      ) : (
        <div className={styles.formContainer}>
          <div className={styles.formSection}>
            <textarea
              placeholder="자투리 시간에 하고 싶은 일을 입력해주세요"
              value={aiRequirement}
              onChange={(e) => setAiRequirement(e.target.value)}
              className={styles.contentInput}
            />
            {isLoading && (
              <p className={styles.loadingMessage}>
                AI가 자투리 시간 활용을 위한 일정을 추천하는 중입니다...
              </p>
            )}
          </div>
        </div>
      )}

      <button
        className={`${styles.submitButton} ${isLoading ? styles.loading : ''}`}
        onClick={activeTab === 'direct' ? handleDirectSubmit : handleAIRecommendation}
        disabled={isLoading}
      >
        {activeTab === 'direct' ? '계획 추가' : isLoading ? '추천 중...' : 'AI 추천 받기'}
      </button>

      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
          <p>AI 추천 중...</p>
        </div>
      )}

      <BottomBar />
    </div>
  );
};

export default CreatePlan;