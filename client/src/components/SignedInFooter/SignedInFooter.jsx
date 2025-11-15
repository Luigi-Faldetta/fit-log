import PropTypes from 'prop-types';
import LabelBottomNavigation from '../BottomNavigation/BottomNavigation';
import './SignedInFooter.css';

const SignedInFooter = ({ value, onChange }) => (
  <footer className="footer-2">
    <LabelBottomNavigation value={value} onChange={onChange} />
  </footer>
);

SignedInFooter.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SignedInFooter;
