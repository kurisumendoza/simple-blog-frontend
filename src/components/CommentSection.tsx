import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { createComment, fetchComments } from '@/services/comments';
import { uploadImage } from '@/services/storage';
import type { RootState } from '@/store/store';
import type { CommentEntry } from '@/types/CommentEntry';
import Comment from './Comment';
import toast from 'react-hot-toast';
import { generateFilename } from '@/utils/generateFilename';

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const CommentSection = ({ blogId }: { blogId: number }) => {
  const [commentList, setCommentList] = useState<CommentEntry[] | null>(null);
  const [body, setBody] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const { user: currentUser, authId: currentUserAuthId } = useSelector(
    (state: RootState) => state.auth
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error('Comment image must be smaller than 2MB');
      return;
    }

    setImage(file);
  };

  const handleImageUpload = async (file: File | null) => {
    if (!file) return;

    const newFileName = generateFilename(file);
    const uploadRes = await uploadImage('comment-images', newFileName, file);

    if (!uploadRes.success) {
      toast.error(`Failed to upload image. ${uploadRes.message}`);
      return;
    }

    return newFileName;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let imagePath: string | null = null;

    if (image) {
      const fileName = await handleImageUpload(image);
      if (!fileName) return;

      imagePath = `public/${fileName}`;
    }

    const newComment = {
      user: currentUser,
      user_id: currentUserAuthId,
      blog_id: blogId,
      image_path: imagePath,
      body: body.trim(),
    };

    const commentRes = await createComment(newComment);

    if (!commentRes.success) {
      toast.error(`Failed to post a comment: ${commentRes.message}`);
      return;
    }

    setBody('');
    setImage(null);
    setCommentList((prevList) =>
      prevList ? [...prevList, commentRes.data] : [commentRes.data]
    );

    toast.success('Comment posted!');
  };

  const updateComment = (updatedComment: CommentEntry) => {
    setCommentList((prevList) => {
      if (!prevList) return prevList;

      return prevList?.map((oldComment) =>
        oldComment.id === updatedComment.id ? updatedComment : oldComment
      );
    });
  };

  const deleteComment = (commentId: number) => {
    setCommentList((prevList) => {
      if (!prevList) return prevList;

      return prevList.filter((comment) => comment.id !== commentId);
    });
  };

  useEffect(() => {
    const loadComments = async () => {
      const loadRes = await fetchComments(blogId);

      if (!loadRes.success) {
        toast.error(`Error loading comments: ${loadRes.message}`);
        return null;
      }

      if (loadRes.success) setCommentList(loadRes.data);
    };

    loadComments();
  }, []);

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
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 my-3">
          <textarea
            name=""
            value={body}
            placeholder="Leave a comment"
            maxLength={300}
            onChange={(e) => setBody(e.target.value.slice(0, 300))}
            className="w-full border rounded-md py-2 px-3 resize-none"
            required
          />

          <div className="flex items-center gap-5">
            {!image && (
              <>
                <p>Add image (optional)</p>
                <label
                  htmlFor="main-comment-image"
                  className="bg-blue-300 rounded-md text-gray-950 px-3 py-1 cursor-pointer"
                >
                  Choose File
                </label>
                <input
                  id="main-comment-image"
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </>
            )}
            {image && (
              <>
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="mt-1 h-12 w-20 rounded-md object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="bg-red-400 rounded-md text-white px-3 py-1 cursor-pointer text-nowrap"
                >
                  Remove Image
                </button>
              </>
            )}
          </div>

          <button className="bg-blue-400 w-[40%] px-3 py-0.5 rounded-md text-gray-800 cursor-pointer hover:bg-blue-800 hover:text-gray-100 transition">
            Submit
          </button>
        </form>
      )}

      {!commentList && (
        <p className="opacity-50">Be the first one to comment.</p>
      )}

      {commentList && (
        <div className="divide-y divide-solid divide-gray-500">
          {commentList.map((comment, i) => (
            <Comment
              key={comment.id}
              comment={comment}
              commentIndex={i}
              onUpdate={updateComment}
              onDelete={deleteComment}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
