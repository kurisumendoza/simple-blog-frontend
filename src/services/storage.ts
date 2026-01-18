import { supabase } from '@/lib/supabase-client';

export const fetchImage = (folder: string, path: string | null) => {
  if (!path) return;

  const { data } = supabase.storage.from(folder).getPublicUrl(path);

  return data.publicUrl;
};

export const deleteImage = async (folder: string, path: string) => {
  const { error } = await supabase.storage.from(folder).remove([path]);

  if (error) return { success: false, message: error.message };

  return { success: true };
};

export const uploadImage = async (
  folder: string,
  filename: string,
  file: File
) => {
  const { error } = await supabase.storage
    .from(folder)
    .upload(`public/${filename}`, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) return { success: false, message: error.message };

  return { success: true };
};
