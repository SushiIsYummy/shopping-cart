import { PulseLoader } from 'react-spinners';
import styles from './LoadingOverlay.module.css';
import PropTypes from 'prop-types';

function LoadingOverlay({
  loadingIcon
}) {

  return (
    <div className={styles.loadingOverlay}>
      {loadingIcon}
    </div>
  )
}

LoadingOverlay.defaultProps = {
  loadingIcon: <PulseLoader color='#36d7b7' size={24} />
}

// LoadingOverlay.propTypes = {
//   loadingIcon: PropTypes.elementType,
// }
export default LoadingOverlay;
