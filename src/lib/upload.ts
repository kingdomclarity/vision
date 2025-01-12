import { createClient } from '@supabase/supabase-js';
import { analytics } from './analytics';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export async function uploadFile(
  file: File,
  bucket: string,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  try {
    // First check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(b => b.name === bucket);

    if (!bucketExists) {
      throw new Error(`Storage bucket "${bucket}" not found. Please ensure the bucket is created in Supabase.`);
    }

    // Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        onUploadProgress: (progress) => {
          onProgress?.(Math.round((progress.loaded / progress.total) * 100));
        }
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    analytics.trackEvent('file_upload_success', {
      bucket,
      fileType: file.type,
      fileSize: file.size
    });

    return publicUrl;
  } catch (error) {
    analytics.trackError(error as Error, {
      context: 'file_upload',
      bucket,
      fileType: file.type,
      fileSize: file.size
    });
    throw error;
  }
}