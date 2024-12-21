import { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import styles from './style.module.css';
import BottomBar from "../../assets/components/bottombar";
import TopBar from "../../assets/components/topbar";
import PlusButton from "../../assets/components/plusbutton";

export default function CalendarComponent() {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleDateChange = (date: any) => {
        setSelectedDate(date);
    };

    return (
        <div className={styles.container}>
            <div className={styles.topbar}>
              <TopBar />
            </div>
            <div className={styles.calendarWrapper}>
                <Calendar
                    onChange={handleDateChange}
                    value={selectedDate}
                    className={styles.customCalendar}
                    formatDay={(locale, date) : any => date.getDate()} // 날짜만 숫자로 표시
                    tileClassName={({ date, view }) => {
                        return date.toDateString() === new Date().toDateString() ? styles.today : null;
                    }}
                />
            </div>
            <div className={styles.plus}>
                <PlusButton />
            </div>
            <div className={styles.bottomBar}>
                <BottomBar />
            </div>
        </div>
    )
}