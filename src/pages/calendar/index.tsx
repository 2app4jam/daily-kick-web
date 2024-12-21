import { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import styles from './style.module.css';
import BottomBar from "../../assets/components/bottombar";
import TopBar from "../../assets/components/topbar";

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
                    tileClassName={({ date, view }) => {
                        // Highlight today's date
                        return date.toDateString() === new Date().toDateString() ? styles.today : null;
                    }}
                />
            </div>
            <div className={styles.bottomBar}>
                <BottomBar />
            </div>
        </div>
    )
}
