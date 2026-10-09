import { Link, Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <>
      <nav style={{ display: 'flex', gap: '10px', justifyContent: 'center', margin: '20px' }}>
        <Link to="/home">Home</Link>
        <Link to="/notes">Notes!</Link>
        <Link to="/exampleLong">Example!</Link>
        <Link to="/admin">Admin site</Link>
      </nav>
      <Outlet />
    </>
  );
}