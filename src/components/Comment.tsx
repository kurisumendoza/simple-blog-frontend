import { useSelector } from 'react-redux';
import { supabase } from '@/lib/supabase-client';
import type { RootState } from '@/store/store';
import type { CommentEntry } from '@/types/CommentEntry';
import { useState } from 'react';
import toast from 'react-hot-toast';

type CommentProps = {
  comment: CommentEntry;
  commentIndex: number;
};

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const Comment = ({ comment, commentIndex }: CommentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [body, setBody] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error('Comment image must be smaller than 2MB');
      return;
    }

    setNewImage(file);
  };

  const handleDeleteImage = async () => {
    if (!image) return setNewImage(null);

    const { error } = await supabase.storage
      .from('comment-images')
      .remove([comment.image_path]);

    if (error) {
      toast.error(`Failed to delete image. ${error.message}`);
      return;
    }

    const removeImagePath = {
      image_path: null,
    };

    const { error: removeError } = await supabase
      .from('comments')
      .update(removeImagePath)
      .eq('id', comment.id);

    if (removeError) {
      toast.error(`Failed to remove image path. ${removeError.message}`);
      return;
    }

    setImage(null);
    setNewImage(null);
  };

  const handleImageUpload = async (file: File | null) => {
    if (!file) return;

    const ext = file.name.split('.').pop();
    const newFileName = `${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage
      .from('comment-images')
      .upload(`public/${newFileName}`, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      toast.error(`Failed to upload image. ${error.message}`);
      return;
    }

    return newFileName;
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let imagePath: string | null = null;

    if (newImage) {
      const fileName = await handleImageUpload(newImage);
      if (!fileName) return;

      imagePath = `public/${fileName}`;
    }

    const newComment = {
      image_path: imagePath,
      body: body.trim(),
    };

    const { error } = await supabase
      .from('comments')
      .update(newComment)
      .eq('id', comment.id);

    if (error) {
      toast.error(`Failed to post a comment: ${error.message}`);
      return;
    }

    setBody('');
    setImage(null);

    toast.success('Comment updated!');
  };

  const handleEditButton = () => {
    const thumbnail = fetchImage() || null;
    setIsEditing(true);
    setBody(comment.body);
    setImage(thumbnail);
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

      {!isEditing && (
        <>
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
              <button
                onClick={handleEditButton}
                className="text-sm bg-blue-400 px-2 py-0.5 w-18 rounded-md text-gray-800 cursor-pointer hover:bg-blue-800 hover:text-gray-100 transition"
              >
                Edit
              </button>
              <button className="text-sm bg-red-400 px-2 py-0.5 w-18 rounded-md text-gray-800 cursor-pointer hover:bg-red-800 hover:text-gray-100 transition">
                Delete
              </button>
            </div>
          )}
        </>
      )}

      {isEditing && (
        <>
          <form onSubmit={handleUpdate} className="flex flex-col gap-2 my-3">
            <textarea
              name=""
              value={body}
              placeholder="Update your comment"
              maxLength={300}
              onChange={(e) => setBody(e.target.value)}
              className="w-full border rounded-md py-2 px-3 resize-none"
              required
            />

            <div className="flex items-center gap-5">
              {!image && !newImage && (
                <>
                  <p className="text-sm">Add image (optional)</p>
                  <label
                    htmlFor="edit-comment-image"
                    className="text-sm bg-blue-300 rounded-md text-gray-950 px-2 py-1 cursor-pointer"
                  >
                    Choose File
                  </label>
                  <input
                    id="edit-comment-image"
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </>
              )}
              {(image || newImage) && (
                <>
                  <img
                    src={
                      image
                        ? image
                        : newImage
                          ? URL.createObjectURL(newImage)
                          : undefined
                    }
                    alt="Preview"
                    className="mt-1 h-10 w-18 rounded-md object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleDeleteImage}
                    className="text-sm bg-red-400 rounded-md text-white px-2 py-1 cursor-pointer text-nowrap"
                  >
                    Delete Image
                  </button>
                </>
              )}
            </div>

            <button className="text-sm bg-blue-400 w-18 px-2 py-1 rounded-md text-gray-800 cursor-pointer hover:bg-blue-800 hover:text-gray-100 transition">
              Update
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Comment;
