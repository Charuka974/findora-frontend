import React from 'react';
import { Spin, Typography } from 'antd';

const { Text } = Typography;

interface LoadingStateProps {
  message?: string;
  fullPage?: boolean;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Loading...', fullPage = false }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
        minHeight: fullPage ? '80vh' : '250px',
        width: '100%',
      }}
    >
      <Spin size="large" style={{ marginBottom: '1.5rem' }} />
      <Text type="secondary" style={{ fontSize: '1rem' }}>{message}</Text>
    </div>
  );
};

export default LoadingState;
