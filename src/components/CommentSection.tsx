import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const CommentSection = ({
  blogId,
  ownerId,
}: {
  blogId: number;
  ownerId: string;
}) => {
  const [body, setBody] = useState('');
  const [image, setImage] = useState('');

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

      {currentUser && (
        <form className="flex flex-col gap-2 my-3">
          <textarea
            name=""
            value={body}
            placeholder="Leave a comment"
            maxLength={300}
            onChange={(e) => setBody(e.target.value)}
            className="w-full border rounded-md py-2 px-3 resize-none"
            required
          />

          <div className="flex items-center">
            <p>Add image (optional)</p>
            <label
              htmlFor="image"
              className="bg-blue-300 rounded-md text-gray-950 px-3 py-1 ml-5 cursor-pointer"
            >
              {image ? 'Change Image' : 'Choose File'}
            </label>
            <input
              id="image"
              type="file"
              accept="image/png, image/jpeg"
              onChange={() => {}}
              className="hidden"
            />
          </div>

          <button className="bg-blue-400 w-[40%] px-3 py-0.5 rounded-md text-gray-800 cursor-pointer hover:bg-blue-800 hover:text-gray-100 transition">
            Submit
          </button>
        </form>
      )}

      {/* {!isOwner && <p>not my blog</p>}
      {isOwner && <p>my blog</p>} */}
    </div>
  );
};

export default CommentSection;
