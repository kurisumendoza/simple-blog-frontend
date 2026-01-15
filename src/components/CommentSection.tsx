import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { Link } from '@tanstack/react-router';

const CommentSection = ({
  blogId,
  ownerId,
}: {
  blogId: number;
  ownerId: string;
}) => {
  const { user: currentUser, authId: currentUserAuthId } = useSelector(
    (state: RootState) => state.auth
  );

  const isOwner = currentUserAuthId === ownerId;

  return (
    <div className="mt-5">
      <h3 className="text-xl font-bold mt-3">Comments</h3>
      {!currentUser && (
        <div className="flex items-center gap-5 my-2">
          <p>Login to leave a comment</p>
          <Link
            to="/login"
            className="bg-blue-400 px-3 py-0.5 rounded-md text-gray-800 cursor-pointer hover:bg-blue-800 hover:text-gray-100 transition"
          >
            Login
          </Link>
        </div>
      )}
      {/* {!isOwner && <p>not my blog</p>}
      {isOwner && <p>my blog</p>} */}
    </div>
  );
};

export default CommentSection;
