import LabelBottomNavigation from '../BottomNavigation/BottomNavigation';
import './SignedInFooter.css';

const SignedInFooter = ({ value, onChange }) => (
  <footer className="footer-2">
    <LabelBottomNavigation value={value} onChange={onChange} />
  </footer>
);

export default SignedInFooter;
