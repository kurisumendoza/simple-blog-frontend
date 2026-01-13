import { Link } from '@tanstack/react-router';

const BackButton = () => {
  return (
    <>
      <Link
        to="/"
        className="text-blue-400 font-semibold cursor-pointer hover:font-bold"
      >
        ← Back to Home
      </Link>
    </>
  );
};

export default BackButton;
