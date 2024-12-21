import { useNavigate } from 'react-router-dom';
import styles from './style.module.css';
import calender from '../../images/calender.svg';
import plan from '../../images/plan.svg';


const BottomBar = () => {
    const navigate = useNavigate();

    const handleNavigation = (path: any) => {
        navigate(path);
    };

  return (
    <div className={styles.bottomBar}>

      <div className={styles.bottomBarItem} onClick={() => handleNavigation('/calendar')}>
        <img src={calender} alt="캘린더" className={styles.calender}/>
        <h1 className={styles.text}>캘린더</h1>
      </div>

      <div className={styles.bottomBarItem} onClick={() => handleNavigation('/plan')}>
        <img src={plan} alt="계획" className={styles.plan}/>
        <h1 className={styles.text}>계획</h1>
      </div>

    </div>
  );
};

export default BottomBar;
