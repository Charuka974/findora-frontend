import api from './api';
import type { MediaUploadResponse } from '../types/media';

export const mediaService = {
  
  async uploadImage(
    file: File,
    onProgress?: (progressPercent: number) => void
  ): Promise<MediaUploadResponse> {
    
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.post<MediaUploadResponse>('/api/v1/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });

    return res.data;
  },

  async deleteImage(objectName: string): Promise<void> {
    // Matches: DELETE /api/v1/media/{objectName}
    await api.delete(`/api/v1/media/${objectName}`);
  }
};