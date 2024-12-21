import { useState, useEffect } from 'react';
import styles from './style.module.css';
import ButtomBar from '../../assets/components/bottombar';

export default function Kick() {
    const [recommendation, setRecommendation] = useState('산책 30분 즐기기');
    const [isLoading, setIsLoading] = useState(false);

    const extractRecommendation = (data : any) => {
        if (typeof data === 'object' && data !== null && 'recommendation' in data) {
            return data.recommendation;
        }
        return '추천을 불러올 수 없습니다';
    };

    useEffect(() => {
        const fetchInitialRecommendation = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('http://172.16.20.82:8000/kick');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setRecommendation(extractRecommendation(data));
            } catch (error) {
                console.error('Error fetching initial recommendation:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialRecommendation();
    }, []);

    const handleRefresh = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://172.16.20.82:8000/kick/refresh');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setRecommendation(extractRecommendation(data));
        } catch (error) {
            console.error('Error fetching refresh recommendation:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.suggest}>
                <h2>{isLoading ? 'Loading...' : recommendation}</h2>
            </div>
            <div 
                className={styles.refresh} 
                onClick={handleRefresh}
                role="button"
                tabIndex={0}
            >
                <h1>새로고침</h1>
            </div>
            <ButtomBar />
        </div>
    );
}