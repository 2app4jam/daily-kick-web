import styles from './style.module.css';
import plusbutton from '../../images/plusbutton.svg';


const PlusButton = () => {
  return (
    <div className={styles.plusbutton} >
        <img src={plusbutton} alt="plusbutton" />
    </div>
  );
};

export default PlusButton;
