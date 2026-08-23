import React, { useState } from 'react';
import { Upload, Progress, Typography, Card, message, Space } from 'antd';
import { UploadCloud, X } from 'lucide-react';
import { mediaService } from '../../services/mediaService';

const { Text } = Typography;

interface MediaUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxCount?: number;
}

interface UploadingFile {
  id: string;
  name: string;
  progress: number;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
  value = [],
  onChange,
  maxCount = 5,
}) => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

  const validateFile = (file: File): boolean => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const isAllowedType = allowedTypes.includes(file.type);
    if (!isAllowedType) {
      message.error(`${file.name} is not a supported file type (Allowed: JPEG, PNG, WEBP).`);
      return false;
    }

    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error(`Image ${file.name} is too large. It must be smaller than 10MB.`);
      return false;
    }

    return true;
  };

  const handleCustomUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    const fileObj = file as File;

    if (!validateFile(fileObj)) {
      onError(new Error('Validation failed'));
      return;
    }

    const fileId = 'upload_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    setUploadingFiles((prev) => [...prev, { id: fileId, name: fileObj.name, progress: 0 }]);

    try {
      const response = await mediaService.uploadImage(fileObj, (percent) => {
        setUploadingFiles((prev) =>
          prev.map((item) => (item.id === fileId ? { ...item, progress: percent } : item))
        );
      });

      const updatedUrls = [...value, response.url];
      onChange(updatedUrls);
      onSuccess(response.url);

      message.success(`${fileObj.name} uploaded successfully.`);
    } catch (err: any) {
      onError(err);
      message.error(`Failed to upload ${fileObj.name}.`);
    } finally {
      setUploadingFiles((prev) => prev.filter((item) => item.id !== fileId));
    }
  };

  const handleRemove = (urlToRemove: string) => {
    const updatedUrls = value.filter((url) => url !== urlToRemove);
    onChange(updatedUrls);
    message.success('Image removed');
  };

  return (
    <Card 
      size="small" 
      style={{ 
        border: '1px dashed #d9d9d9', 
        borderRadius: '8px', 
        backgroundColor: '#fafafa',
        padding: '8px'
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">

        {/* DRAG AND DROP AREA (Hidden if max count reached) */}
        {value.length < maxCount && (
          <Upload.Dragger
            multiple
            customRequest={handleCustomUpload}
            showUploadList={false}
            style={{ background: '#fff', borderRadius: '6px' }}
          >
            <div style={{ padding: '16px 0' }}>
              <p style={{ display: 'flex', justifyContent: 'center', color: '#1890ff', marginBottom: '8px' }}>
                <UploadCloud size={32} />
              </p>
              <p style={{ fontSize: '14px', fontWeight: 500, margin: '0 0 4px 0' }}>
                Click or drag images here to upload
              </p>
              <p style={{ fontSize: '12px', color: '#8c8c8c', margin: 0 }}>
                Up to {maxCount} files (Max 10MB each)
              </p>
            </div>
          </Upload.Dragger>
        )}

        {/* UPLOADING PROGRESS LIST */}
        {uploadingFiles.map((file) => (
          <div key={file.id} style={{ padding: '4px 8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <Text type="secondary" ellipsis style={{ maxWidth: '75%', fontSize: '12px' }}>
                Uploading {file.name}...
              </Text>
              <Text strong style={{ fontSize: '12px' }}>{file.progress}%</Text>
            </div>
            <Progress percent={file.progress} showInfo={false} size="small" strokeColor="#1890ff" />
          </div>
        ))}

        {/* PREVIEW GALLERY GRID */}
        {value.length > 0 && (
          <div>
            <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '8px' }}>
              Uploaded Images ({value.length}/{maxCount})
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {value.map((url, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    position: 'relative', 
                    width: '76px', 
                    height: '76px',
                    borderRadius: '6px',
                    border: '1px solid #d9d9d9',
                    overflow: 'hidden',
                    backgroundColor: '#000'
                  }}
                >
                  <img 
                    src={url} 
                    alt={`Preview ${idx + 1}`} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <button
                    type="button"
                    onClick={() => handleRemove(url)}
                    style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </Space>
    </Card>
  );
};

export default MediaUploader;