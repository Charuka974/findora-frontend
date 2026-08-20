import React, { useState } from 'react';
import { Card, Descriptions, Avatar, Button, Modal, Form, Input, Typography, message, Space, Row, Col } from 'antd';
import { User, Mail, Phone, Calendar, Edit3, ShieldAlert } from 'lucide-react';
import dayjs from 'dayjs';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text, Paragraph } = Typography;

const Profile: React.FC = () => {
  const { user, updateUserContext } = useAuth();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [isSaving, setIsSaving] = useState(false);

  if (!user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
        <Text>Please log in to view this page.</Text>
      </div>
    );
  }

  const handleEditClick = () => {
    form.setFieldsValue({
      name: user.name,
      phone: user.phone || '',
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (values: { name: string; phone: string }) => {
    setIsSaving(true);
    try {
      // Create updated user record
      const updatedUser = {
        ...user,
        name: values.name,
        phone: values.phone,
      };

      // Since backend profile updating endpoint is unspecified, 
      // we save it in AuthContext/localStorage directly which supports 
      // fully functional mock and prototype editing.
      updateUserContext(updatedUser);
      
      message.success('Profile updated successfully!');
      setIsEditModalOpen(false);
    } catch (err: any) {
      message.error('Failed to update profile details.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 24px 64px 24px', width: '100%' }}>
      
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, fontWeight: 700, color: '#1f1f1f' }}>
          Account Profile
        </Title>
        <Paragraph style={{ color: '#595959', margin: '4px 0 0 0' }}>
          View and edit your personal profile details.
        </Paragraph>
      </div>

      <Row gutter={[24, 24]}>
        
        {/* AVATAR SUMMARY CARD */}
        <Col xs={24} md={8}>
          <Card 
            style={{ 
              textAlign: 'center', 
              borderRadius: '16px', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
              border: '1px solid #f0f0f0' 
            }}
            bodyStyle={{ padding: '32px 16px' }}
          >
            <Avatar 
              size={84} 
              style={{ 
                backgroundColor: '#1890ff', 
                fontSize: '32px',
                boxShadow: '0 4px 12px rgba(24,144,255,0.3)',
                marginBottom: '16px' 
              }}
            >
              {user.name ? user.name[0].toUpperCase() : 'U'}
            </Avatar>
            <Title level={4} style={{ margin: '0 0 4px 0', fontWeight: 700 }}>
              {user.name}
            </Title>
            <Text type="secondary" style={{ display: 'block', fontSize: '13px', marginBottom: '16px' }}>
              {user.email}
            </Text>
            
            <Button 
              type="default" 
              shape="round" 
              icon={<Edit3 size={14} style={{ marginRight: '6px' }} />}
              onClick={handleEditClick}
              block
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500 }}
            >
              Edit Profile
            </Button>
          </Card>
        </Col>

        {/* DETAILED INFORMATION CARD */}
        <Col xs={24} md={16}>
          <Card 
            style={{ 
              borderRadius: '16px', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
              border: '1px solid #f0f0f0',
              height: '100%' 
            }}
            bodyStyle={{ padding: '32px' }}
          >
            <Descriptions title="Profile Details" column={1} bordered size="middle">
              <Descriptions.Item 
                label={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><User size={15} style={{ color: '#8c8c8c' }} /> Display Name</span>}
              >
                <strong>{user.name}</strong>
              </Descriptions.Item>
              <Descriptions.Item 
                label={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={15} style={{ color: '#8c8c8c' }} /> Email Address</span>}
              >
                {user.email}
              </Descriptions.Item>
              <Descriptions.Item 
                label={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={15} style={{ color: '#8c8c8c' }} /> Contact Phone</span>}
              >
                {user.phone || <Text type="secondary">Not Specified</Text>}
              </Descriptions.Item>
              <Descriptions.Item 
                label={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={15} style={{ color: '#8c8c8c' }} /> Date Joined</span>}
              >
                {user.createdAt ? dayjs(user.createdAt).format('MMMM DD, YYYY') : 'August 15, 2026'}
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: '24px', backgroundColor: '#fffbe6', border: '1px solid #ffe58f', borderRadius: '8px', padding: '12px', display: 'flex', gap: '8px' }}>
              <ShieldAlert size={18} style={{ color: '#faad14', flexShrink: 0, marginTop: '2px' }} />
              <Text type="warning" style={{ fontSize: '13px', lineHeight: 1.4 }}>
                For security, Findora only shares phone and email credentials with users who view items you specifically report. Keep this contact info accurate so finders can reach you.
              </Text>
            </div>
          </Card>
        </Col>

      </Row>

      {/* EDIT PROFILE MODAL */}
      <Modal
        title="Edit Profile Information"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsEditModalOpen(false)} shape="round">
            Cancel
          </Button>,
          <Button key="submit" type="primary" loading={isSaving} onClick={() => form.submit()} shape="round">
            Save Details
          </Button>,
        ]}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSubmit}
          style={{ marginTop: '16px' }}
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[
              { required: true, message: 'Please enter your name' },
              { min: 2, message: 'Name must be at least 2 characters' }
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[
              { 
                pattern: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
                message: 'Please enter a valid phone number format'
              }
            ]}
          >
            <Input size="large" placeholder="e.g. +1 (555) 123-4567" />
          </Form.Item>
        </Form>
      </Modal>

    </div>
  );
};

export default Profile;
