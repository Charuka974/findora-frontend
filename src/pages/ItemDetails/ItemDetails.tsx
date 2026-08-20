import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Tag, 
  Button, 
  Typography, 
  Space, 
  Card, 
  Carousel, 
  Divider, 
  Descriptions, 
  Modal, 
  message,
  Breadcrumb,
  Alert
} from 'antd';
import { 
  MapPin, 
  Calendar, 
  Tag as CategoryIcon, 
  Mail, 
  Phone, 
  User, 
  ChevronLeft,
  Edit,
  Trash2,
  CheckCircle,
  Flag,
  Share2
} from 'lucide-react';
import dayjs from 'dayjs';
import { itemService } from '../../services/itemService';
import type { Item, ItemStatus } from '../../types/item';
import { useAuth } from '../../contexts/AuthContext';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';

const { Title, Paragraph, Text } = Typography;

const ItemDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useAuth();

  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  
  // Modals / Dialogs states
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isResolveOpen, setIsResolveOpen] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [isSubmittingAction, setIsSubmittingAction] = useState<boolean>(false);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        setHasError(false);
        const data = await itemService.getItemById(id);
        setItem(data);
      } catch (err) {
        console.error('Failed to load item detail details:', err);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (isLoading) {
    return <LoadingState message="Fetching item details..." fullPage />;
  }

  if (hasError || !item) {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 24px' }}>
        <ErrorState 
          title="Item Not Found"
          message="The item listing you are looking for may have been deleted, resolved, or is temporarily unavailable."
          onGoBack={() => navigate('/items')}
        />
      </div>
    );
  }

  // Permission Check
  const isOwner = currentUser && item.userId === currentUser.id;
  const isLost = item.type === 'LOST';
  const isOpen = item.status === 'OPEN';

  const handleDeleteConfirm = async () => {
    setIsSubmittingAction(true);
    try {
      await itemService.deleteItem(item.id);
      message.success('Item listing deleted successfully.');
      setIsDeleteOpen(false);
      navigate('/my-items');
    } catch (err) {
      message.error('Failed to delete item listing.');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleResolveConfirm = async () => {
    setIsSubmittingAction(true);
    const newStatus: ItemStatus = item.status === 'OPEN' ? 'RESOLVED' : 'OPEN';
    try {
      const updated = await itemService.updateItem(item.id, { status: newStatus });
      setItem(updated);
      message.success(`Listing status marked as ${newStatus}.`);
      setIsResolveOpen(false);
    } catch (err) {
      message.error('Failed to update listing status.');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleReportListing = () => {
    message.info('Thank you. A moderator has been notified about this listing.');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    message.success('Link copied to clipboard!');
  };

  // Image assets gallery logic
  const imageGallery = item.media && item.media.length > 0
    ? item.media
    : ['https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=800&auto=format&fit=crop&q=80'];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 24px 64px 24px', width: '100%' }}>
      
      {/* BREADCRUMBS & BACK BUTTON */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to="/items">Browse Directory</Link></Breadcrumb.Item>
          <Breadcrumb.Item>{item.title}</Breadcrumb.Item>
        </Breadcrumb>
        <Button 
          type="text" 
          icon={<ChevronLeft size={16} />} 
          onClick={() => navigate(-1)}
          style={{ display: 'flex', alignItems: 'center', fontWeight: 500 }}
        >
          Back
        </Button>
      </div>

      <Row gutter={[32, 32]}>
        {/* LEFT PANEL: IMAGE GALLERIES */}
        <Col xs={24} md={12}>
          <Card 
            bodyStyle={{ padding: '8px' }} 
            style={{ 
              borderRadius: '16px', 
              overflow: 'hidden', 
              boxShadow: '0 6px 18px rgba(0,0,0,0.03)',
              border: '1px solid #f0f0f0' 
            }}
          >
            {imageGallery.length > 1 ? (
              <Carousel arrows infinite={false} style={{ background: '#000', borderRadius: '12px', overflow: 'hidden' }}>
                {imageGallery.map((url, idx) => (
                  <div key={idx} style={{ height: '400px', width: '100%' }}>
                    <img 
                      src={url} 
                      alt={`${item.title} gallery ${idx + 1}`} 
                      style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#000' }} 
                    />
                  </div>
                ))}
              </Carousel>
            ) : (
              <div style={{ height: '400px', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
                <img 
                  src={imageGallery[0]} 
                  alt={item.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
            )}
          </Card>
        </Col>

        {/* RIGHT PANEL: INFO & ACTIONS */}
        <Col xs={24} md={12}>
          <Card 
            style={{ 
              borderRadius: '16px', 
              boxShadow: '0 6px 18px rgba(0,0,0,0.03)',
              border: '1px solid #f0f0f0',
              height: '100%'
            }}
            bodyStyle={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}
          >
            <div>
              {/* STATUS & TYPE BADGES */}
              <Space style={{ marginBottom: '16px' }} size="small">
                <Tag color={isLost ? '#ff4d4f' : '#52c41a'} style={{ fontWeight: 700, padding: '4px 12px', borderRadius: '4px', fontSize: '13px', border: 'none' }}>
                  {item.type}
                </Tag>
                <Tag color={isOpen ? '#1890ff' : '#8c8c8c'} style={{ fontWeight: 600, padding: '4px 12px', borderRadius: '4px', fontSize: '13px', border: 'none' }}>
                  {item.status}
                </Tag>
              </Space>

              {/* TITLE */}
              <Title level={2} style={{ margin: '0 0 8px 0', fontWeight: 700, color: '#1f1f1f' }}>
                {item.title}
              </Title>

              {/* CATEGORY & LOCATION */}
              <Space direction="vertical" style={{ width: '100%', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#595959', fontSize: '14px' }}>
                  <CategoryIcon size={16} style={{ color: '#8c8c8c' }} />
                  <Text type="secondary" style={{ textTransform: 'uppercase', fontSize: '13px', fontWeight: 600, letterSpacing: '0.5px' }}>
                    {item.category}
                  </Text>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#595959', fontSize: '14px' }}>
                  <MapPin size={16} style={{ color: '#8c8c8c' }} />
                  <Text strong>{item.location}</Text>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8c8c8c', fontSize: '14px' }}>
                  <Calendar size={16} />
                  <Text type="secondary">
                    Reported {dayjs(item.createdAt).format('MMMM DD, YYYY [at] h:mm A')}
                  </Text>
                </div>
              </Space>

              <Divider style={{ margin: '16px 0' }} />

              {/* DESCRIPTION */}
              <Title level={5} style={{ color: '#262626', fontWeight: 600, marginBottom: '8px' }}>
                Description
              </Title>
              <Paragraph style={{ color: '#595959', fontSize: '15px', lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: '24px' }}>
                {item.description}
              </Paragraph>
              
              {!isOpen && (
                <Alert 
                  message={`This item listing is RESOLVED. It has been successfully returned or matched.`} 
                  type="success" 
                  showIcon 
                  style={{ marginBottom: '24px', borderRadius: '8px' }}
                />
              )}
            </div>

            <div>
              {/* ACTION BUTTONS */}
              {isOwner ? (
                /* OWNER CONTROLS */
                <Card style={{ background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '12px' }} bodyStyle={{ padding: '16px' }}>
                  <Text type="secondary" style={{ display: 'block', marginBottom: '12px', fontWeight: 500, fontSize: '13px' }}>
                    You created this listing. Manage status or edit details below:
                  </Text>
                  <Row gutter={[12, 12]}>
                    <Col xs={24} sm={8}>
                      <Button 
                        type="primary" 
                        block 
                        icon={<CheckCircle size={16} style={{ marginRight: '4px' }} />}
                        onClick={() => setIsResolveOpen(true)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: isOpen ? '#52c41a' : '#1890ff', borderColor: isOpen ? '#52c41a' : '#1890ff' }}
                      >
                        {isOpen ? 'Mark Resolved' : 'Reopen Post'}
                      </Button>
                    </Col>
                    <Col xs={12} sm={8}>
                      <Link to={`/items/${item.id}/edit`}>
                        <Button 
                          type="default" 
                          block 
                          icon={<Edit size={16} style={{ marginRight: '4px' }} />}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          Edit Details
                        </Button>
                      </Link>
                    </Col>
                    <Col xs={12} sm={8}>
                      <Button 
                        danger 
                        block 
                        icon={<Trash2 size={16} style={{ marginRight: '4px' }} />}
                        onClick={() => setIsDeleteOpen(true)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        Delete
                      </Button>
                    </Col>
                  </Row>
                </Card>
              ) : (
                /* GUEST ACTIONS */
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <Button 
                      type="primary" 
                      size="large" 
                      block 
                      shape="round"
                      disabled={!isOpen}
                      icon={<Mail size={18} style={{ marginRight: '6px' }} />}
                      onClick={() => {
                        if (isAuthenticated) {
                          setIsContactOpen(true);
                        } else {
                          message.warning('Please log in to contact the owner.');
                          navigate('/login', { state: { from: { pathname: `/items/${item.id}` } } });
                        }
                      }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}
                    >
                      Contact Owner
                    </Button>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Button 
                      size="large" 
                      block 
                      shape="round"
                      icon={<Share2 size={16} />}
                      onClick={handleShare}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      Share
                    </Button>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Button 
                      type="text" 
                      danger 
                      size="large" 
                      block 
                      icon={<Flag size={16} />}
                      onClick={handleReportListing}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      Report
                    </Button>
                  </Col>
                </Row>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        open={isDeleteOpen}
        title="Delete Listing?"
        content="Are you sure you want to delete this listing permanently? This action cannot be undone."
        okText="Yes, Delete"
        danger
        confirmLoading={isSubmittingAction}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteOpen(false)}
      />

      {/* CONFIRM RESOLVE DIALOG */}
      <ConfirmDialog
        open={isResolveOpen}
        title={isOpen ? 'Mark as Resolved?' : 'Reopen Listing?'}
        content={
          isOpen 
            ? 'Marking this item as resolved means you have successfully returned/located it. The listing will remain viewable but marked as completed.'
            : 'Would you like to reopen this listing for active match searches?'
        }
        okText={isOpen ? 'Resolve' : 'Reopen'}
        confirmLoading={isSubmittingAction}
        onConfirm={handleResolveConfirm}
        onCancel={() => setIsResolveOpen(false)}
      />

      {/* CONTACT OWNER MODAL */}
      <Modal
        open={isContactOpen}
        title="Contact Owner Info"
        onCancel={() => setIsContactOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsContactOpen(false)} shape="round">
            Close
          </Button>
        ]}
        destroyOnClose
      >
        <div style={{ padding: '16px 0' }}>
          <Paragraph>
            Get in touch with the listing creator to arrange a verify return.
          </Paragraph>
          <Descriptions column={1} bordered size="middle" style={{ marginTop: '16px' }}>
            <Descriptions.Item label={<span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><User size={14} /> Name</span>}>
              {item.ownerName || 'Verified User'}
            </Descriptions.Item>
            <Descriptions.Item label={<span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> Email</span>}>
              {item.ownerEmail ? (
                <a href={`mailto:${item.ownerEmail}?subject=Findora - Regarding ${item.title}`}>{item.ownerEmail}</a>
              ) : 'Not Provided'}
            </Descriptions.Item>
            <Descriptions.Item label={<span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} /> Phone</span>}>
              {item.ownerPhone ? (
                <a href={`tel:${item.ownerPhone}`}>{item.ownerPhone}</a>
              ) : 'Not Provided'}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </Modal>

    </div>
  );
};

export default ItemDetails;
