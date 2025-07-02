import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './BackButton.scss';

const BackButton = () => {
  return (
    <Link to="/" className="back-button">
      <FontAwesomeIcon icon={faArrowLeft} />
      <span>Back</span>
    </Link>
  );
};

export default BackButton;
