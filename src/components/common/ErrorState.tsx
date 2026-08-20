import React from 'react';
import { Result, Button } from 'antd';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onGoBack?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'Unable to connect to Findora. Please check your connection and try again.',
  onRetry,
  onGoBack,
}) => {
  return (
    <Result
      status="warning"
      title={title}
      subTitle={message}
      extra={
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          {onGoBack && (
            <Button onClick={onGoBack}>
              Go Back
            </Button>
          )}
          {onRetry && (
            <Button type="primary" onClick={onRetry}>
              Try Again
            </Button>
          )}
        </div>
      }
      style={{ padding: '3rem 1.5rem' }}
    />
  );
};

export default ErrorState;
