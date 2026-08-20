import React from 'react';
import { Empty, Button } from 'antd';

interface EmptyStateProps {
  message?: string;
  actionText?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'No items found matching your criteria.',
  actionText,
  onAction,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '4rem 2rem',
        width: '100%',
      }}
    >
      <Empty
        description={message}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        style={{ margin: 0 }}
      >
        {actionText && onAction && (
          <Button type="primary" onClick={onAction} style={{ marginTop: '1rem' }}>
            {actionText}
          </Button>
        )}
      </Empty>
    </div>
  );
};

export default EmptyState;
