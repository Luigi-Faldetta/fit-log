import { Outlet } from 'react-router-dom';
import AnimatedBackground from '../ui/AnimatedBackground/AnimatedBackground';
import './Layout.css';

function Layout() {
  return (
    <div className="layout">
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>
      <AnimatedBackground
        variant="grid"
        intensity="medium"
        animated={true}
      />
      <main id="main-content" className="layout-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
