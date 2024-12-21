import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./style.module.css";
import BottomBar from "../../assets/components/bottombar";
import TopBar from "../../assets/components/topbar";
import PlusButton from "../../assets/components/plusbutton";

export default function CalendarComponent() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [eventText, setEventText] = useState("");
    const [events, setEvents] = useState<{ [key: string]: string[] }>({});

    const handleDateChange = (date: any) => {
        setSelectedDate(date);
    };

    const getDateId = (date: Date): string => {
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    };

    const handleAddEvent = () => {
        const dateId = getDateId(selectedDate);

        if (eventText.trim()) {
            setEvents((prevEvents) => ({
                ...prevEvents,
                [dateId]: prevEvents[dateId]
                    ? [...prevEvents[dateId], eventText.trim()]
                    : [eventText.trim()],
            }));
        }

        setEventText(""); // Clear the text input
        setOverlayVisible(false); // Close the overlay
    };

    const getTileContent = ({ date }: any) => {
        const dateId = getDateId(date);
        const eventList = events[dateId] || [];

        if (eventList.length > 0) {
            const displayText = eventList.length > 1
                ? `${eventList[0].slice(0, 6)}...`
                : eventList[0].slice(0, 6);

            return <p className={styles.eventMemo}>{displayText}</p>;
        }
        return null;
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
                    formatDay={(locale, date): any => date.getDate()} // 날짜만 숫자로 표시
                    tileContent={getTileContent} // 날짜 아래에 이벤트 표시
                    tileClassName={({ date }) =>
                        date.toDateString() === new Date().toDateString()
                            ? styles.today
                            : null
                    }
                />
            </div>
            <div className={styles.plus}>
                <PlusButton onClick={() => setOverlayVisible(true)} />
            </div>
            <div className={styles.bottomBar}>
                <BottomBar />
            </div>
            {overlayVisible && (
                <div className={styles.overlay}>
                    <div className={styles.overlayContent}>
                        <h2>새 일정 추가</h2>
                        <textarea
                            className={styles.textarea}
                            value={eventText}
                            onChange={(e) => setEventText(e.target.value)}
                            placeholder="일정을 입력하세요."
                        ></textarea>
                        <button className={styles.addButton} onClick={handleAddEvent}>
                            추가
                        </button>
                        
                    </div>
                </div>
            )}
        </div>
    );
}
