// Plan.tsx
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomBar from '../../assets/components/bottombar';
import TopBar from "../../assets/components/topbar";
import styles from './style.module.css';

interface Schedule {
  _id: string;
  title: string;
  description: string;
  start_datetime: string;
  end_datetime: string;
  type: string;
}

const Plan = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 일정 데이터 불러오기
  const fetchSchedules = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      // 고정된 날짜 사용 (2024-12-24)
      const formattedDate = '2024-12-24';
      console.log('요청 날짜:', formattedDate);

      const response = await axios.get(`http://172.16.20.82:8000/schedule/${formattedDate}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('서버 응답 데이터:', response.data);
      
      // tasks 배열이 있는지 확인
      if (response.data && Array.isArray(response.data.tasks)) {
        // 시간순으로 정렬
        const sortedSchedules = [...response.data.tasks].sort((a: Schedule, b: Schedule) => 
          new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime()
        );
        setSchedules(sortedSchedules);
      } else {
        console.error('유효하지 않은 응답 데이터:', response.data);
        setSchedules([]);
      }
    } catch (error: any) {
      console.error('일정 조회 오류:', error);
      
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        alert('세션이 만료되었습니다. 다시 로그인해주세요.');
        localStorage.removeItem('authToken');
        navigate('/login');
      } else {
        alert('일정을 불러오는데 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [navigate]);

  // 일정 삭제 처리
  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      await axios.delete(`http://172.16.20.82:8000/schedule/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('일정이 삭제되었습니다.');
      fetchSchedules(); // 삭제 후 목록 새로고침
    } catch (error: any) {
      console.error('일정 삭제 중 오류 발생:', error);
      
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        alert('세션이 만료되었습니다. 다시 로그인해주세요.');
        localStorage.removeItem('authToken');
        navigate('/login');
      } else {
        alert('일정 삭제에 실패했습니다.');
      }
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.topbar}>
        <TopBar />
      </div>

      <div className={styles.timelineContainer}>
        {isLoading ? (
          <div className={styles.loadingMessage}>일정을 불러오는 중...</div>
        ) : schedules.length === 0 ? (
          <div className={styles.emptyMessage}>등록된 일정이 없습니다.</div>
        ) : (
          schedules.map((schedule, index) => (
            <div key={schedule._id} className={styles.scheduleItem}>
              <div className={styles.timeColumn}>
                {formatTime(schedule.start_datetime)}
                <div className={styles.timelineDot} />
                {index < schedules.length - 1 && <div className={styles.timelineLine} />}
              </div>
              <div className={`${styles.scheduleContent} ${styles[schedule.type.toLowerCase()]}`}>
                <span>{schedule.title}</span>
                <span className={styles.timeRange}>
                  ({formatTime(schedule.start_datetime)} - {formatTime(schedule.end_datetime)})
                </span>
                <button 
                  className={styles.deleteButton}
                  onClick={() => handleDelete(schedule._id)}
                >
                  삭제
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => navigate('/plan/create')}
        className={styles.addButton}
        disabled={isLoading}
      >
        +
      </button>

      <BottomBar />
    </div>
  );
};

export default Plan;