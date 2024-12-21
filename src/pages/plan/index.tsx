import axios from 'axios';
import React, { useEffect, useState } from 'react';
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

  // 오늘 일정 리스트 불러오기
  useEffect(() => {
    const fetchSchedules = async () => {
        try {
          const token = localStorage.getItem('authToken'); // 로컬 스토리지에서 토큰 읽기
      
          if (!token) {
            throw new Error('인증 토큰이 없습니다.');
          }
      
          const formattedDate = new Date("2024-12-24").toISOString().split('T')[0];
          console.log('요청 날짜:', formattedDate);
          console.log('사용 중인 토큰:', token);
      
          // 요청 전송
          const response = await axios.get(`http://172.16.20.82:8000/schedule/${formattedDate}`, {
            headers: {
              Authorization: `Bearer ${token}`, // 'Bearer'가 필요 없는 경우 토큰만 전달
              'Content-Type': 'application/json',
            },
          });
      
          console.log('서버 응답 데이터:', response.data);
          setSchedules(response.data.tasks);
        } catch (error: any) {
          if (axios.isAxiosError(error) && error.response) {
            console.error('서버 응답 에러:', error.response.data);
      
            // 인증 에러 처리
            if (error.response.status === 401) {
              alert('세션이 만료되었습니다. 다시 로그인해주세요.');
              localStorage.removeItem('authToken');
              navigate('/login'); // 올바른 경로로 이동
            }
          } else {
            console.error('알 수 없는 에러:', error.message);
          }
        }
      };
      
    fetchSchedules();
  }, [navigate]);

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('authToken');

      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      console.log('삭제 요청 일정 ID:', id);

      await axios.delete(`http://172.16.20.82:8000/schedule/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setSchedules((prevSchedules) => prevSchedules.filter(schedule => schedule._id !== id));
      alert('일정이 성공적으로 삭제되었습니다.');
    } catch (error: any) {
      console.error('일정 삭제 중 오류 발생:', error.response?.data || error.message);
      alert('일정 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topbar}>
        <TopBar />
      </div>

      <div className={styles.timelineContainer}>
        {schedules.map((schedule, index) => (
          <div key={schedule._id} className={styles.scheduleItem}>
            <div className={styles.timeColumn}>
              {new Date(schedule.start_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              <div className={styles.timelineDot} />
              {index < schedules.length - 1 && <div className={styles.timelineLine} />}
            </div>
            <div className={styles.scheduleContent}>
              {schedule.title}
              <button className={styles.deleteButton} onClick={() => handleDelete(schedule._id)}>
                <p>삭제</p>
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate('/plan/create')}
        className={styles.addButton}
      >
        +
      </button>

      <BottomBar />
    </div>
  );
};

export default Plan;
