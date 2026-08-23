import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, Typography, Breadcrumb, message, Result, Button } from 'antd';
import { itemService } from '../../services/itemService';
import { useAuth } from '../../contexts/AuthContext';
import ItemForm from '../../components/forms/ItemForm';
import type { ItemFormData } from '../../components/forms/ItemForm';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import type { Item } from '../../types/item';

const { Title, Paragraph } = Typography;

const EditItem: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        setHasError(false);
        const data = await itemService.getItemById(id);
        setItem(data);
      } catch (err) {
        console.error('Failed to load item for edit:', err);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (isLoading) {
    return <LoadingState message="Loading item details..." fullPage />;
  }

  if (hasError || !item) {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 24px' }}>
        <ErrorState
          title="Listing Not Found"
          message="The listing you are trying to edit could not be loaded."
          onGoBack={() => navigate('/items')}
        />
      </div>
    );
  }

  // Security authorization check: Only owner can edit (handling number/string ID comparison safely)
  const isOwner = currentUser && Number(item.reportedBy) === Number(currentUser.id);
  if (!isOwner) {
    return (
      <div style={{ maxWidth: '800px', margin: '80px auto', padding: '0 24px' }}>
        <Result
          status="403"
          title="Access Denied"
          subTitle="You do not have permission to edit this listing because you are not the owner."
          extra={
            <Button type="primary" onClick={() => navigate(`/items/${item.id}`)} shape="round">
              Back to Details
            </Button>
          }
        />
      </div>
    );
  }

  const handleFormSubmit = async (data: ItemFormData & { formattedDate: string }) => {
    setIsUpdating(true);
    try {
      await itemService.updateItem(item.id, {
        title: data.title,
        description: data.description,
        type: data.type,
        category: data.category as any,
        location: data.location,
        imageUrls: data.imageUrls,
        date: data.formattedDate,
        ownerName: item.ownerName || currentUser?.name || currentUser?.name,
        ownerEmail: item.ownerEmail || currentUser?.email,
        ownerPhone: item.ownerPhone || currentUser?.phone,
      });

      message.success('Listing details updated successfully!');
      navigate(`/items/${item.id}`);
    } catch (err: any) {
      console.error(err);
      message.error(err.response?.data?.message || err.message || 'Failed to update report. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Convert Item to ItemForm format using imageUrls list
  const formInitialValues = {
    title: item.title,
    description: item.description,
    type: item.type,
    category: item.category,
    location: item.location,
    dateString: item.date || item.createdAt,
    imageUrls: item.imageUrls || [],
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 24px 64px 24px', width: '100%' }}>
      
      {/* BREADCRUMB */}
      <Breadcrumb style={{ marginBottom: '16px' }}>
        <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
        <Breadcrumb.Item><Link to="/items">Items</Link></Breadcrumb.Item>
        <Breadcrumb.Item><Link to={`/items/${item.id}`}>{item.title}</Link></Breadcrumb.Item>
        <Breadcrumb.Item>Edit</Breadcrumb.Item>
      </Breadcrumb>

      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, fontWeight: 700, color: '#1f1f1f' }}>
          Edit Item Details
        </Title>
        <Paragraph style={{ color: '#595959', margin: '4px 0 0 0' }}>
          Update the attributes, status, or description for your reported item.
        </Paragraph>
      </div>

      <Card
        style={{
          borderRadius: '16px',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.03)',
          border: '1px solid #f0f0f0',
        }}
        styles={{ body: { padding: '32px' } }}
      >
        <ItemForm
          initialValues={formInitialValues}
          onSubmit={handleFormSubmit}
          isSubmitting={isUpdating}
          submitButtonText="Save Changes"
        />
      </Card>
      
    </div>
  );
};

export default EditItem;