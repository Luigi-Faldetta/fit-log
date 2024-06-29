import { Outlet } from 'react-router-dom';
import LabelBottomNavigation from '../BottomNavigation';

function Layout() {
  return (
    <div className="layout">
      <main className="layout-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
