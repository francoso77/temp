import './style.css';
import { Link } from 'react-router-dom';
// ==> ul>li>a
//para montar a nav
export const Menu = () => {
  return (
    <nav className='menu'>
      <ul>
        <li>
          <Link to="/" state={'O ESTADO é do link HOME'}>Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/posts">Posts</Link>
        </li>
        <li>
          <Link to="/posts/10">Posts 10</Link>
        </li>
        <li>
          <Link to="/redirect">Redirect</Link>
        </li>
      </ul>
    </nav>
  );
};