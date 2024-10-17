import LabelBottomNavigation from './BottomNavigation';

const SignedInFooter = ({ value, onChange }) => (
  <footer className="footer-2">
    <LabelBottomNavigation value={value} onChange={onChange} />
  </footer>
);

export default SignedInFooter;
