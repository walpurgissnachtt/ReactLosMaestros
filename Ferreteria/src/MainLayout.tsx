import { Link, Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <>
      <nav style={{ display: 'flex', gap: '10px', justifyContent: 'center', margin: '20px' }}>
        <Link to="/admin">Admin site</Link>
        <Link to="/login">Login</Link>
      </nav>
      <Outlet />
    </>
  );
}
