import api from './api';
import type { MediaUploadResponse } from '../types/media';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const mediaService = {
  async uploadImage(
    file: File,
    onProgress?: (progressPercent: number) => void
  ): Promise<MediaUploadResponse> {
    if (USE_MOCK) {
      // Simulate uploading steps
      if (onProgress) {
        onProgress(15);
        await delay(200);
        onProgress(55);
        await delay(200);
        onProgress(100);
        await delay(100);
      }

      // Read selected image file as a DataURL to display realistic previews without a backend
      return new Promise<MediaUploadResponse>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            url: reader.result as string,
            filename: file.name,
            size: file.size,
          });
        };
        reader.onerror = () => {
          reject(new Error('Failed to read file for mock upload'));
        };
        reader.readAsDataURL(file);
      });
    }

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
};
