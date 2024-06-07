import { Outlet } from 'react-router-dom';
// import NavigationBar from './NavigationBar';

function Layout() {
  return (
    <div className="layout">
      {/* <header className="layout-header">
        <div className="logo">
          <img className="logo-img" src="/logo.png" alt="Logo" />
        </div>
      </header> */}
      <main className="layout-content">
        <Outlet />
      </main>
      <footer className="layout-footer">
        {/* <NavigationBar /> */}
        <h5>Hello</h5>
      </footer>
    </div>
  );
}

export default Layout;
