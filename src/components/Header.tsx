import { Link } from '@tanstack/react-router';

const Header = ({ user = 'Guest' }: { user?: string }) => {
  return (
    <div className="flex justify-between fixed top-0 left-0 w-full bg-gray-500 py-2 px-10 md:px-30 lg:px-60 text-white shadow-lg">
      <div>
        <p>Hi, {user}</p>
      </div>
      <ul className="flex justify-between gap-5">
        <li>
          <Link to="/register">Register</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
      </ul>
    </div>
  );
};

export default Header;
