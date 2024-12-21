import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./style.module.css";
import BottomBar from "../../assets/components/bottombar";
import TopBar from "../../assets/components/topbar";
import PlusButton from "../../assets/components/plusbutton";

type Event = {
    title: string;
    description: string;
    start_datetime: string;
    end_datetime: string;
};

export default function CalendarComponent() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [eventTitle, setEventTitle] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [startTime, setStartTime] = useState("19:00");
    const [endTime, setEndTime] = useState("20:00");
    const [events, setEvents] = useState<Event[]>([]);
    // Load events from localStorage when the component mounts
    useEffect(() => {
        const savedEvents = localStorage.getItem("calendarEvents");
        if (savedEvents) {
            setEvents(JSON.parse(savedEvents));
        }
    }, []);

    // Save events to localStorage whenever `events` state changes
    useEffect(() => {
        localStorage.setItem("calendarEvents", JSON.stringify(events));
    }, [events]);

    const handleDateChange = (date: any) => {
        setSelectedDate(date);
    };

    const getDateString = (date: Date): string => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
            date.getDate()
        ).padStart(2, "0")}`;
    };

    const handleAddEvent = async () => {
        if (eventTitle.trim() && eventDescription.trim() && startTime && endTime) {
            const dateStr = getDateString(selectedDate);
            const start_datetime = `${dateStr}T${startTime}:00`;
            const end_datetime = `${dateStr}T${endTime}:00`;

            const newEvent: Event = {
                title: eventTitle.trim(),
                description: eventDescription.trim(),
                start_datetime,
                end_datetime,
            };

            // Update events locally
            setEvents((prevEvents) => [...prevEvents, newEvent]);
            console.log(newEvent);

            // Send JSON to backend
            try {
                const response = await fetch("http://127.0.0.1:8000/schedule/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newEvent),
                });

                if (!response.ok) {
                    throw new Error("Failed to save the event to the backend.");
                }

                console.log("Event successfully saved!");
            } catch (error) {
                console.error("Error saving event:", error);
                console.log("Failed to save the event. Please try again.");
            }
        } else {
            alert("Please fill in all fields before adding the event.");
        }

        // Clear inputs and close overlay
        setEventTitle("");
        setEventDescription("");
        setStartTime("19:00");
        setEndTime("20:00");
        setOverlayVisible(false);
    };

    const getTileContent = ({ date }: any) => {
        const dateStr = getDateString(date);
        const dayEvents = events.filter((event) => event.start_datetime.startsWith(dateStr));

        if (dayEvents.length > 0) {
            const displayText =
                dayEvents.length > 1
                    ? `${dayEvents[0].title.slice(0, 6)}...`
                    : dayEvents[0].title.slice(0, 6);

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
                        <h2 className={styles.text}>일정 추가</h2>
                        <h3 className={styles.text2}>제목</h3>
                        <input
                            type="text"
                            className={styles.titleInput}
                            value={eventTitle}
                            onChange={(e) => setEventTitle(e.target.value)}
                            placeholder="일정 제목을 입력해주세요."
                        />
                        <h3 className={styles.text2}>내용</h3>
                        <textarea
                            className={styles.textarea}
                            value={eventDescription}
                            onChange={(e) => setEventDescription(e.target.value)}
                            placeholder="일정 내용을 입력해주세요."
                        ></textarea>
                        <div className={styles.time}>
                            <div className={styles.starttitle}>
                                <h3 className={styles.text2}>시작 시간</h3>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className={styles.starttime}
                                />
                            </div>
                            <div className={styles.endtitle}>
                                <h3 className={styles.text2}>종료 시간</h3>
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className={styles.endtime}
                                />
                            </div>
                        </div>
                        <button className={styles.addButton} onClick={handleAddEvent}>
                            일정 추가
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
