import { supabase } from '@/lib/supabase-client';
import type { CommentEntry } from '@/types/CommentEntry';

type CommentProps = {
  isOwner: boolean;
  comment: CommentEntry;
  commentIndex: number;
};

const Comment = ({ isOwner, comment, commentIndex }: CommentProps) => {
  const fetchImage = () => {
    if (!comment.image_path) return;

    const { data } = supabase.storage
      .from('comment-images')
      .getPublicUrl(comment.image_path);

    return data.publicUrl;
  };

  return (
    <div className="py-3">
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
      <div className="flex mt-2">
        <p>{comment.body}</p>
        <img
          src={fetchImage()}
          alt=""
          className="ml-auto max-w-20 rounded-md"
        />
      </div>
    </div>
  );
};

export default Comment;
