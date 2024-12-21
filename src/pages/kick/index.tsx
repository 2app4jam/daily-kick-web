import styles from './style.module.css';
import ButtomBar from '../../assets/components/bottombar';


export default function Kick(){
    return(
        <div className={styles.container} >
            <div className={styles.suggest}>
                <h2>'산책 30분 즐기기'</h2>
            </div>
            <div className={styles.refresh}>
                <h1>새로고침</h1>
            </div>
            <ButtomBar />
        </div>

        
    )
    
}
