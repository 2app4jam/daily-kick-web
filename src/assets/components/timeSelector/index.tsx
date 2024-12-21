// src/assets/components/timeSelector/index.tsx
import React from 'react';
import styles from './style.module.css';

interface TimeSelectorProps {
  label: string;
  time: string;
  onTimeChange: (time: string) => void;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({ label, time, onTimeChange }) => {
  return (
    <div className={styles.timeContainer}>
      <label className={styles.timeLabel}>{label}</label>
      <input
        type="time"
        value={time}
        onChange={(e) => onTimeChange(e.target.value)}
        className={styles.timeInput}
      />
    </div>
  );
};

export default TimeSelector;