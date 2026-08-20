import React from 'react';
import { Modal } from 'antd';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  content: string;
  okText?: string;
  cancelText?: string;
  confirmLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  content,
  okText = 'Confirm',
  cancelText = 'Cancel',
  confirmLoading = false,
  onConfirm,
  onCancel,
  danger = false,
}) => {
  return (
    <Modal
      open={open}
      title={title}
      okText={okText}
      cancelText={cancelText}
      confirmLoading={confirmLoading}
      onOk={onConfirm}
      onCancel={onCancel}
      okButtonProps={{ danger: danger, type: 'primary' }}
      destroyOnClose
    >
      <p style={{ fontSize: '0.95rem', color: '#4a5568', margin: '1rem 0' }}>{content}</p>
    </Modal>
  );
};

export default ConfirmDialog;
