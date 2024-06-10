import { Outlet } from 'react-router-dom';
import LabelBottomNavigation from '../BottomNavigation';

function Layout() {
  return (
    <div className="layout">
      <main className="layout-content">
        <Outlet />
      </main>
      {/* <footer>
        <LabelBottomNavigation></LabelBottomNavigation>
      </footer> */}
    </div>
  );
}

export default Layout;
