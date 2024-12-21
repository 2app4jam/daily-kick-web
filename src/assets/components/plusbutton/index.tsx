import styles from './style.module.css';
import plusbutton from '../../images/plusbutton.svg';


export default function PlusButton({ onClick }: { onClick: () => void }) {
    return (
        <img
            src={plusbutton} // 플러스 버튼 이미지 경로
            alt="plus button"
            onClick={onClick}
            className={styles.plusButton}
        />
    );
}
