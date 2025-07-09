// Cloudinary service for file uploads
export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
}

export interface CloudinaryUploadResponse {
  success: boolean;
  data?: CloudinaryUploadResult;
  error?: string;
}

export const cloudinaryService = {
  /**
   * Upload file to Cloudinary using API route
   */
  async uploadFile(file: File, folder: string = 'payment-proofs'): Promise<CloudinaryUploadResponse> {
    try {
      // Validate file first
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error || 'File validation failed'
        };
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      console.log('Uploading file to API...', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        folder
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error('Upload API error:', {
          status: response.status,
          statusText: response.statusText,
          result
        });
        return {
          success: false,
          error: result.error || `Upload failed: ${response.status}`
        };
      }

      if (!result.success) {
        console.error('Upload result error:', result.error);
        return {
          success: false,
          error: result.error || 'Upload failed'
        };
      }

      console.log('Upload success:', result.data);

      return {
        success: true,
        data: result.data
      };
    } catch (error: any) {
      console.error('Error uploading file:', error);
      return {
        success: false,
        error: error.message || 'Failed to upload file',
      };
    }
  },

  /**
   * Delete file from Cloudinary
   */
  async deleteFile(publicId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Note: For security, deletion should be done from backend
      // This is just a placeholder for future implementation
      console.log('Delete file with public_id:', publicId);
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting from Cloudinary:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get optimized image URL
   */
  getOptimizedUrl(publicId: string, options: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
  } = {}): string {
    const { width, height, quality = 'auto', format = 'auto' } = options;
    
    let transformations = [];
    
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    if (quality) transformations.push(`q_${quality}`);
    if (format) transformations.push(`f_${format}`);
    
    const transformStr = transformations.length > 0 ? `${transformations.join(',')}` : '';
    
    return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${transformStr}/${publicId}`;
  },

  /**
   * Validate file before upload
   */
  validateFile(file: File): { isValid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Format file tidak didukung. Gunakan JPG, PNG, atau WEBP.',
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'Ukuran file terlalu besar. Maksimal 5MB.',
      };
    }

    return { isValid: true };
  },
};
