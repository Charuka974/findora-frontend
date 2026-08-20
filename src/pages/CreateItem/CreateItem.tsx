import React, { useState } from 'react';
import { Card, Typography, Breadcrumb, message } from 'antd';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import ItemForm from '../../components/forms/ItemForm';
import type { ItemFormData } from '../../components/forms/ItemForm';
import { itemService } from '../../services/itemService';

const { Title, Paragraph } = Typography;

const CreateItem: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Determine if reporting lost or found based on the route
  const isLostRoute = location.pathname.includes('/report/lost');
  const pageTitle = isLostRoute ? 'Report a Lost Item' : 'Report a Found Item';
  const pageSubtitle = isLostRoute
    ? 'Provide details about the item you lost so others can help you find it.'
    : 'Provide details about the item you found so its owner can get it back.';
  const submitText = isLostRoute ? 'Report Lost Item' : 'Report Found Item';
  const itemType = isLostRoute ? 'LOST' : 'FOUND';

  const handleFormSubmit = async (data: ItemFormData & { formattedDate: string }) => {
    setIsSubmitting(true);
    try {
      const createdItem = await itemService.createItem({
        title: data.title,
        description: data.description,
        type: itemType,
        category: data.category as any,
        location: data.location,
        media: data.media,
        createdAt: data.formattedDate,
      });

      // Show toast message
      message.success(`${pageTitle} submitted successfully!`);
      // Redirect to newly created item details page
      navigate(`/items/${createdItem.id}`);
    } catch (err: any) {
      console.error(err);
      message.error(err.response?.data?.message || err.message || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 24px 64px 24px', width: '100%' }}>
      
      {/* BREADCRUMB */}
      <Breadcrumb style={{ marginBottom: '16px' }}>
        <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
        <Breadcrumb.Item>Report</Breadcrumb.Item>
        <Breadcrumb.Item>{isLostRoute ? 'Lost' : 'Found'}</Breadcrumb.Item>
      </Breadcrumb>

      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, fontWeight: 700, color: '#1f1f1f' }}>
          {pageTitle}
        </Title>
        <Paragraph style={{ color: '#595959', margin: '4px 0 0 0' }}>
          {pageSubtitle}
        </Paragraph>
      </div>

      <Card
        style={{
          borderRadius: '16px',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.03)',
          border: '1px solid #f0f0f0',
        }}
        bodyStyle={{ padding: '32px' }}
      >
        <ItemForm
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
          submitButtonText={submitText}
          fixedType={itemType}
        />
      </Card>
      
    </div>
  );
};

export default CreateItem;
