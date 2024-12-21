import { useNavigate } from 'react-router-dom';
import styles from './style.module.css';
import logo from '../../images/logo.svg';


const TopBar = () => {
    const navigate = useNavigate();

    const handleNavigation = (path: any) => {
        navigate(path);
    };

  return (
    <div className={styles.topbar} onClick={() => handleNavigation('/calendar')}>
        <img src={logo} alt="logo" />
    </div>
  );
};

export default TopBar;
