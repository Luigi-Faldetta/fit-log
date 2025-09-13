import { Outlet } from 'react-router-dom';
import AnimatedBackground from '../ui/AnimatedBackground/AnimatedBackground';
import './Layout.css';

function Layout() {
  return (
    <div className="layout">
      <AnimatedBackground 
        variant="grid"
        intensity="medium"
        animated={true}
      />
      <main className="layout-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
