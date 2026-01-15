import { useSelector } from 'react-redux';
import { supabase } from '@/lib/supabase-client';
import type { RootState } from '@/store/store';
import type { CommentEntry } from '@/types/CommentEntry';

type CommentProps = {
  comment: CommentEntry;
  commentIndex: number;
};

const Comment = ({ comment, commentIndex }: CommentProps) => {
  const currentUserAuthId = useSelector(
    (state: RootState) => state.auth.authId
  );

  const isCommenter = currentUserAuthId === comment.user_id;

  const fetchImage = () => {
    if (!comment.image_path) return;

    const { data } = supabase.storage
      .from('comment-images')
      .getPublicUrl(comment.image_path);

    return data.publicUrl;
  };

  return (
    <div className="flex flex-col gap-2 py-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <div className="bg-gray-500 py-0.5 px-1 text-xs italic rounded">
            {`#${String(commentIndex + 1).padStart(2, '0')}`}
          </div>
          <p className="font-bold text-blue-300">{comment.user}</p>
        </div>
        <p className="italic text-sm text-gray-300">
          {new Date(comment.created_at).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          })}
        </p>
      </div>
      <div className="flex">
        <p>{comment.body}</p>
        <img
          src={fetchImage()}
          alt=""
          className="ml-auto max-w-20 rounded-md"
        />
      </div>
      {isCommenter && (
        <div className="flex gap-2">
          <button className="text-sm bg-blue-400 px-2 py-0.5 w-18 rounded-md text-gray-800 cursor-pointer hover:bg-blue-800 hover:text-gray-100 transition">
            Edit
          </button>
          <button className="text-sm bg-red-400 px-2 py-0.5 w-18 rounded-md text-gray-800 cursor-pointer hover:bg-red-800 hover:text-gray-100 transition">
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default Comment;
