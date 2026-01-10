const Navbar = ({ user = 'Guest' }: { user?: string }) => {
  return (
    <div className="flex justify-between fixed top-0 left-0 w-full bg-gray-500 py-2 px-10 md:px-30 lg:px-60 text-white">
      <div>
        <p>Hi, {user}</p>
      </div>
      <ul className="flex justify-between gap-5">
        <li>Register</li>
        <li>Login</li>
      </ul>
    </div>
  );
};

export default Navbar;
