// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { 
//   Tabs, 
//   Table, 
//   Tag, 
//   Button, 
//   Space, 
//   Typography, 
//   Row, 
//   Col, 
//   Grid, 
//   Tooltip, 
//   message 
// } from 'antd';
// import { 
//   Eye, 
//   Edit, 
//   Trash2, 
//   CheckCircle2, 
//   MapPin,
//   XCircle,
//   PlusCircle
// } from 'lucide-react';
// import dayjs from 'dayjs';
// import { useAuth } from '../../contexts/AuthContext';
// import { itemService } from '../../services/itemService';
// import type { Item, ItemStatus, ItemType } from '../../types/item';
// import ItemCard from '../../components/items/ItemCard';
// import ConfirmDialog from '../../components/common/ConfirmDialog';
// import LoadingState from '../../components/common/LoadingState';
// import ErrorState from '../../components/common/ErrorState';
// import EmptyState from '../../components/common/EmptyState';

// const { Title, Paragraph, Text } = Typography;
// const { useBreakpoint } = Grid;

// const MyItems: React.FC = () => {
//   const navigate = useNavigate();
//   const { user: currentUser } = useAuth();
//   const screens = useBreakpoint();

//   const [allItems, setAllItems] = useState<Item[]>([]);
//   const [filteredItems, setFilteredItems] = useState<Item[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [hasError, setHasError] = useState<boolean>(false);
  
//   const [activeTab, setActiveTab] = useState<string>('all');

//   // Deletion and status modal states
//   const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
//   const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
//   const [isResolveOpen, setIsResolveOpen] = useState<boolean>(false);
//   const [isActionLoading, setIsActionLoading] = useState<boolean>(false);

//   const fetchUserItems = async () => {
//     if (!currentUser) return;
//     try {
//       setIsLoading(true);
//       setHasError(false);
//       // Fetch all items to allow filtering for both reported and claimed items
//       const data = await itemService.getItems();
//       setAllItems(data);
//     } catch (err) {
//       console.error('Failed to load user listings:', err);
//       setHasError(true);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUserItems();
//   }, [currentUser]);

//   // Apply tab filtering locally
//   useEffect(() => {
//     if (!currentUser) return;
//     let items = [];
//     if (activeTab === 'claims') {
//       items = allItems.filter((i) => i.claims?.some(c => Number(c.claimerId) === Number(currentUser.id)));
//     } else {
//       // For all other tabs, only show items reported by the current user
//       const userReportedItems = allItems.filter(i => Number(i.reportedBy) === Number(currentUser.id));
//       if (activeTab === 'lost') {
//         items = userReportedItems.filter((i) => i.type === 'LOST');
//       } else if (activeTab === 'found') {
//         items = userReportedItems.filter((i) => i.type === 'FOUND');
//       } else if (activeTab === 'resolved') {
//         items = userReportedItems.filter((i) => i.status === 'RESOLVED');
//       } else {
//         items = userReportedItems;
//       }
//     }
//     setFilteredItems(items);
//   }, [allItems, activeTab, currentUser]);

//   const handleDeleteTrigger = (id: string) => {
//     setSelectedItemId(id);
//     setIsDeleteOpen(true);
//   };

//   const handleResolveTrigger = (id: string) => {
//     setSelectedItemId(id);
//     setIsResolveOpen(true);
//   };

//   const handleDeleteConfirm = async () => {
//     if (!selectedItemId) return;
//     setIsActionLoading(true);
//     try {
//       await itemService.deleteItem(selectedItemId);
//       message.success('Listing deleted.');
//       setAllItems((prev) => prev.filter((i) => i.id !== selectedItemId));
//       setIsDeleteOpen(false);
//     } catch (err) {
//       message.error('Failed to delete listing.');
//     } finally {
//       setIsActionLoading(false);
//       setSelectedItemId(null);
//     }
//   };

//   const handleResolveConfirm = async () => {
//     if (!selectedItemId) return;
//     const targetItem = allItems.find((i) => i.id === selectedItemId);
//     if (!targetItem) return;

//     setIsActionLoading(true);
//     const newStatus: ItemStatus = targetItem.status === 'OPEN' ? 'RESOLVED' : 'OPEN';
//     try {
//       const updated = await itemService.updateItemStatus(selectedItemId, newStatus);
//       message.success(`Status updated to ${newStatus}.`);
//       setAllItems((prev) =>
//         prev.map((item) => (item.id === selectedItemId ? updated : item))
//       );
//       setIsResolveOpen(false);
//     } catch (err) {
//       message.error('Failed to update listing status.');
//     } finally {
//       setIsActionLoading(false);
//       setSelectedItemId(null);
//     }
//   };

//   // Ant Design Table Columns for Desktop
//   const tableColumns = [
//     {
//       title: 'Item',
//       key: 'item',
//       render: (_: any, record: Item) => {
//         const itemImage = record.imageUrls && record.imageUrls.length > 0 
//           ? record.imageUrls[0] 
//           : 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=100&auto=format&fit=crop&q=80';
//         return (
//           <Space size="middle">
//             <img 
//               src={itemImage} 
//               alt={record.title} 
//               style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e8e8e8' }} 
//             />
//             <div>
//               <div style={{ fontWeight: 600, color: '#262626' }}>{record.title}</div>
//               <Text type="secondary" style={{ fontSize: '12px' }}>{record.category}</Text>
//             </div>
//           </Space>
//         );
//       }
//     },
//     {
//       title: 'Location',
//       dataIndex: 'location',
//       key: 'location',
//       render: (loc: string) => (
//         <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
//           <MapPin size={13} style={{ color: '#8c8c8c' }} /> {loc}
//         </span>
//       )
//     },
//     {
//       title: 'Type',
//       dataIndex: 'type',
//       key: 'type',
//       render: (type: ItemType) => (
//         <Tag color={type === 'LOST' ? '#ff4d4f' : '#52c41a'} style={{ fontWeight: 600 }}>
//           {type}
//         </Tag>
//       )
//     },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       key: 'status',
//       render: (status: ItemStatus) => (
//         <Tag color={status === 'OPEN' ? '#1890ff' : '#8c8c8c'} style={{ fontWeight: 600 }}>
//           {status}
//         </Tag>
//       )
//     },
//     {
//       title: activeTab === 'claims' ? 'My Claim Status' : 'Claims Verification',
//       key: 'claims',
//       render: (_: any, record: Item) => {
//         if (activeTab === 'claims') {
//           // Show the current user's claim status on this item
//           const myClaim = record.claims?.find(c => Number(c.claimerId) === Number(currentUser?.id));
//           if (!myClaim) return <Text type="secondary">-</Text>;
//           return (
//             <Space direction="vertical" size={2}>
//               <Tag color={myClaim.status === 'APPROVED' ? 'green' : myClaim.status === 'REJECTED' ? 'red' : 'gold'} style={{ fontWeight: 600 }}>
//                 {myClaim.status}
//               </Tag>
//               <Link to={`/items/${record.id}`}>
//                 <Button type="link" size="small" style={{ padding: 0, height: 'auto', fontSize: '12px' }}>
//                   View Details &rarr;
//                 </Button>
//               </Link>
//             </Space>
//           );
//         }

//         if (record.type !== 'FOUND') return <Text type="secondary">-</Text>;
//         const claims = record.claims || [];
//         const pendingCount = claims.filter(c => c.status === 'PENDING').length;
        
//         if (claims.length === 0) return <Text type="secondary">No claims yet</Text>;

//         return (
//           <Space direction="vertical" size={2}>
//             <Tag color={pendingCount > 0 ? 'gold' : 'green'} style={{ fontWeight: 600 }}>
//               {claims.length} Claim{claims.length !== 1 ? 's' : ''} ({pendingCount} pending)
//             </Tag>
//             <Link to={`/items/${record.id}`}>
//               <Button type="link" size="small" style={{ padding: 0, height: 'auto', fontSize: '12px' }}>
//                 Manage Claims &rarr;
//               </Button>
//             </Link>
//           </Space>
//         );
//       }
//     },
//     {
//       title: 'Reported Date',
//       dataIndex: 'createdAt',
//       key: 'createdAt',
//       render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
//     },
//     {
//       title: 'Actions',
//       key: 'actions',
//       render: (_: any, record: Item) => (
//         <Space size="middle">
//           <Tooltip title="View listing details page">
//             <Link to={`/items/${record.id}`}>
//               <Button type="text" shape="circle" icon={<Eye size={16} />} />
//             </Link>
//           </Tooltip>
//           <Tooltip title="Edit item attributes">
//             <Link to={`/items/${record.id}/edit`}>
//               <Button type="text" shape="circle" icon={<Edit size={16} />} />
//             </Link>
//           </Tooltip>
//           <Tooltip title={record.status === 'OPEN' ? 'Mark as Resolved' : 'Reopen Listing'}>
//             <Button 
//               type="text" 
//               shape="circle" 
//               icon={record.status === 'OPEN' ? <CheckCircle2 size={16} style={{ color: '#52c41a' }} /> : <XCircle size={16} style={{ color: '#1890ff' }} />} 
//               onClick={() => handleResolveTrigger(record.id)}
//             />
//           </Tooltip>
//           <Tooltip title="Delete listing permanently">
//             <Button 
//               type="text" 
//               danger 
//               shape="circle" 
//               icon={<Trash2 size={16} />} 
//               onClick={() => handleDeleteTrigger(record.id)}
//             />
//           </Tooltip>
//         </Space>
//       )
//     }
//   ];

//   // Mobile layout component
//   const renderMobileCards = () => (
//     <Row gutter={[16, 16]}>
//       {filteredItems.map((item) => {
//         const pendingClaimsCount = item.claims?.filter(c => c.status === 'PENDING').length || 0;
//         return (
//           <Col key={item.id} xs={24} sm={12}>
//             <div style={{ position: 'relative' }}>
//               <ItemCard item={item} />
              
//               {/* Claims Badge for Mobile */}
//               {activeTab === 'claims' ? (() => {
//                 const myClaim = item.claims?.find(c => Number(c.claimerId) === Number(currentUser?.id));
//                 if (!myClaim) return null;
//                 return (
//                   <div style={{ padding: '8px 12px', background: '#e6f7ff', borderTop: '1px solid #91caff', fontSize: '13px' }}>
//                     <Text strong>Claim Status: </Text>
//                     <Tag color={myClaim.status === 'APPROVED' ? 'green' : myClaim.status === 'REJECTED' ? 'red' : 'gold'}>
//                       {myClaim.status}
//                     </Tag>
//                     <Link to={`/items/${item.id}`} style={{ display: 'block', marginTop: '4px', fontSize: '12px' }}>
//                       View Details &rarr;
//                     </Link>
//                   </div>
//                 );
//               })() : (
//                 item.type === 'FOUND' && item.claims && item.claims.length > 0 && (
//                   <div style={{ padding: '8px 12px', background: '#fffbe6', borderTop: '1px solid #ffe58f', fontSize: '13px' }}>
//                     <Text strong>{item.claims.length} Claim(s)</Text> {pendingClaimsCount > 0 && <Tag color="gold" style={{ marginLeft: '8px' }}>{pendingClaimsCount} Pending</Tag>}
//                     <Link to={`/items/${item.id}`} style={{ display: 'block', marginTop: '4px', fontSize: '12px' }}>
//                       View & Manage Claims &rarr;
//                     </Link>
//                   </div>
//                 )
//               )}

//               <div 
//                 style={{ 
//                   position: 'absolute', 
//                   bottom: '16px', 
//                   right: '16px', 
//                   zIndex: 10,
//                   display: 'flex',
//                   gap: '8px'
//                 }}
//               >
//                 <Link to={`/items/${item.id}/edit`}>
//                   <Button size="small" icon={<Edit size={12} />} style={{ display: 'flex', alignItems: 'center' }}>
//                     Edit
//                   </Button>
//                 </Link>
//                 <Button 
//                   danger 
//                   size="small" 
//                   icon={<Trash2 size={12} />} 
//                   onClick={() => handleDeleteTrigger(item.id)}
//                   style={{ display: 'flex', alignItems: 'center' }}
//                 >
//                   Delete
//                 </Button>
//               </div>
//             </div>
//           </Col>
//         );
//       })}
//     </Row>
//   );

//   return (
//     <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 24px 64px 24px', width: '100%' }}>
      
//       {/* HEADER SECTION */}
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
//         <div>
//           <Title level={2} style={{ margin: 0, fontWeight: 700, color: '#1f1f1f' }}>
//             My Reported Items
//           </Title>
//           <Paragraph style={{ color: '#595959', margin: '4px 0 0 0' }}>
//             Manage listings you have reported, update statuses, or delete active posts.
//           </Paragraph>
//         </div>
//         <Space>
//           <Link to="/report/lost">
//             <Button type="primary" danger shape="round" icon={<PlusCircle size={16} style={{ marginRight: '6px' }} />}>
//               Report Lost Item
//             </Button>
//           </Link>
//           <Link to="/report/found">
//             <Button type="primary" shape="round" icon={<PlusCircle size={16} style={{ marginRight: '6px' }} />} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}>
//               Report Found Item
//             </Button>
//           </Link>
//         </Space>
//       </div>

//       {/* FILTER TABS */}
//       <Tabs
//         activeKey={activeTab}
//         onChange={(key) => setActiveTab(key)}
//         style={{ marginBottom: '20px' }}
//         items={[
//           { label: 'My Reported Items', key: 'all' },
//           { label: 'My Lost Items', key: 'lost' },
//           { label: 'My Found Items', key: 'found' },
//           { label: 'Resolved', key: 'resolved' },
//           { label: 'My Claims', key: 'claims' },
//         ]}
//       />

//       {/* RENDER LISTS */}
//       {isLoading ? (
//         <LoadingState message="Loading your items list..." />
//       ) : hasError ? (
//         <ErrorState onRetry={fetchUserItems} />
//       ) : filteredItems.length === 0 ? (
//         <EmptyState 
//           message={`No items found in this tab. Click below to create a listing.`} 
//           actionText="Report Lost Item" 
//           onAction={() => navigate('/report/lost')} 
//         />
//       ) : (
//         /* RESPONSIVE LAYOUT TOGGLER (TABLE VS CARDS) */
//         screens.xs || screens.sm ? (
//           renderMobileCards()
//         ) : (
//           <Table 
//             dataSource={filteredItems.map(item => ({ ...item, key: item.id }))} 
//             columns={tableColumns} 
//             pagination={{ pageSize: 8 }}
//             style={{ 
//               backgroundColor: '#fff', 
//               borderRadius: '12px', 
//               overflow: 'hidden', 
//               boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
//               border: '1px solid #f0f0f0' 
//             }}
//           />
//         )
//       )}

//       {/* CONFIRM DELETE MODAL */}
//       <ConfirmDialog
//         open={isDeleteOpen}
//         title="Delete Listing permanently?"
//         content="Are you sure you want to delete this listing from Findora? Other users will no longer be able to search or match against this item description."
//         okText="Delete Listing"
//         danger
//         confirmLoading={isActionLoading}
//         onConfirm={handleDeleteConfirm}
//         onCancel={() => {
//           setIsDeleteOpen(false);
//           setSelectedItemId(null);
//         }}
//       />

//       {/* CONFIRM RESOLVE STATUS MODAL */}
//       <ConfirmDialog
//         open={isResolveOpen}
//         title="Update Listing Status?"
//         content="Would you like to toggle the status of this item listing between OPEN and RESOLVED? Reopened items appear in public queries; resolved items are archived."
//         okText="Update Status"
//         confirmLoading={isActionLoading}
//         onConfirm={handleResolveConfirm}
//         onCancel={() => {
//           setIsResolveOpen(false);
//           setSelectedItemId(null);
//         }}
//       />
      
//     </div>
//   );
// };

// export default MyItems;

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Tabs, 
  Table, 
  Tag, 
  Button, 
  Space, 
  Typography, 
  Row, 
  Col, 
  Grid, 
  Tooltip, 
  message 
} from 'antd';
import { 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  MapPin,
  XCircle,
  PlusCircle
} from 'lucide-react';
import dayjs from 'dayjs';
import { useAuth } from '../../contexts/AuthContext';
import { itemService } from '../../services/itemService';
import type { Item, ItemStatus, ItemType } from '../../types/item';
import ItemCard from '../../components/items/ItemCard';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

const { Title, Paragraph, Text } = Typography;
const { useBreakpoint } = Grid;

const MyItems: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const screens = useBreakpoint();

  const [allItems, setAllItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  
  const [activeTab, setActiveTab] = useState<string>('all');

  // Deletion and status modal states
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isResolveOpen, setIsResolveOpen] = useState<boolean>(false);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);

  const fetchUserItems = async () => {
    if (!currentUser) return;
    try {
      setIsLoading(true);
      setHasError(false);
      // Fetch all items to allow filtering for both reported and claimed items
      const data = await itemService.getItems();
      setAllItems(data);
    } catch (err) {
      console.error('Failed to load user listings:', err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserItems();
  }, [currentUser]);

  // Apply tab filtering locally
  useEffect(() => {
    if (!currentUser) return;
    let items = [];
    if (activeTab === 'claims') {
      items = allItems.filter((i) => i.claims?.some(c => Number(c.claimerId) === Number(currentUser.id)));
    } else {
      // For all other tabs, only show items reported by the current user
      const userReportedItems = allItems.filter(i => Number(i.reportedBy) === Number(currentUser.id));
      if (activeTab === 'lost') {
        items = userReportedItems.filter((i) => i.type === 'LOST');
      } else if (activeTab === 'found') {
        items = userReportedItems.filter((i) => i.type === 'FOUND');
      } else if (activeTab === 'resolved') {
        items = userReportedItems.filter((i) => i.status === 'RESOLVED');
      } else {
        items = userReportedItems;
      }
    }
    setFilteredItems(items);
  }, [allItems, activeTab, currentUser]);

  const handleDeleteTrigger = (id: string) => {
    setSelectedItemId(id);
    setIsDeleteOpen(true);
  };

  const handleResolveTrigger = (id: string) => {
    setSelectedItemId(id);
    setIsResolveOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItemId) return;
    setIsActionLoading(true);
    try {
      await itemService.deleteItem(selectedItemId);
      message.success('Listing deleted.');
      setAllItems((prev) => prev.filter((i) => i.id !== selectedItemId));
      setIsDeleteOpen(false);
    } catch (err) {
      message.error('Failed to delete listing.');
    } finally {
      setIsActionLoading(false);
      setSelectedItemId(null);
    }
  };

  const handleResolveConfirm = async () => {
    if (!selectedItemId) return;
    const targetItem = allItems.find((i) => i.id === selectedItemId);
    if (!targetItem) return;

    setIsActionLoading(true);
    const newStatus: ItemStatus = targetItem.status === 'OPEN' ? 'RESOLVED' : 'OPEN';
    try {
      const updated = await itemService.updateItemStatus(selectedItemId, newStatus);
      message.success(`Status updated to ${newStatus}.`);
      setAllItems((prev) =>
        prev.map((item) => (item.id === selectedItemId ? updated : item))
      );
      setIsResolveOpen(false);
    } catch (err) {
      message.error('Failed to update listing status.');
    } finally {
      setIsActionLoading(false);
      setSelectedItemId(null);
    }
  };

  // Ant Design Table Columns for Desktop
  const tableColumns = [
    {
      title: 'Item',
      key: 'item',
      render: (_: any, record: Item) => {
        const itemImage = record.imageUrls && record.imageUrls.length > 0 
          ? record.imageUrls[0] 
          : 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=100&auto=format&fit=crop&q=80';
        return (
          <Space size="middle">
            <img 
              src={itemImage} 
              alt={record.title} 
              style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e8e8e8' }} 
            />
            <div>
              <div style={{ fontWeight: 600, color: '#262626' }}>{record.title}</div>
              <Text type="secondary" style={{ fontSize: '12px' }}>{record.category}</Text>
            </div>
          </Space>
        );
      }
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (loc: string) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
          <MapPin size={13} style={{ color: '#8c8c8c' }} /> {loc}
        </span>
      )
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: ItemType) => (
        <Tag color={type === 'LOST' ? '#ff4d4f' : '#52c41a'} style={{ fontWeight: 600 }}>
          {type}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: ItemStatus) => (
        <Tag color={status === 'OPEN' ? '#1890ff' : '#8c8c8c'} style={{ fontWeight: 600 }}>
          {status}
        </Tag>
      )
    },
    {
      title: activeTab === 'claims' ? 'My Claim Status' : 'Claims Verification',
      key: 'claims',
      render: (_: any, record: Item) => {
        if (activeTab === 'claims') {
          const myClaim = record.claims?.find(c => Number(c.claimerId) === Number(currentUser?.id));
          if (!myClaim) return <Text type="secondary">-</Text>;
          return (
            <Space direction="vertical" size={2}>
              <Tag color={myClaim.status === 'APPROVED' ? 'green' : myClaim.status === 'REJECTED' ? 'red' : 'gold'} style={{ fontWeight: 600 }}>
                {myClaim.status}
              </Tag>
              <Link to={`/items/${record.id}`}>
                <Button type="link" size="small" style={{ padding: 0, height: 'auto', fontSize: '12px' }}>
                  View Details &rarr;
                </Button>
              </Link>
            </Space>
          );
        }

        if (record.type !== 'FOUND') return <Text type="secondary">-</Text>;
        const claims = record.claims || [];
        const pendingCount = claims.filter(c => c.status === 'PENDING').length;
        
        if (claims.length === 0) return <Text type="secondary">No claims yet</Text>;

        return (
          <Space direction="vertical" size={2}>
            <Tag color={pendingCount > 0 ? 'gold' : 'green'} style={{ fontWeight: 600 }}>
              {claims.length} Claim{claims.length !== 1 ? 's' : ''} ({pendingCount} pending)
            </Tag>
            <Link to={`/items/${record.id}`}>
              <Button type="link" size="small" style={{ padding: 0, height: 'auto', fontSize: '12px' }}>
                Manage Claims &rarr;
              </Button>
            </Link>
          </Space>
        );
      }
    },
    {
      title: 'Reported Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Item) => (
        <Space size="middle">
          <Tooltip title="View listing details page">
            <Link to={`/items/${record.id}`}>
              <Button type="text" shape="circle" icon={<Eye size={16} />} />
            </Link>
          </Tooltip>
          <Tooltip title="Edit item attributes">
            <Link to={`/items/${record.id}/edit`}>
              <Button type="text" shape="circle" icon={<Edit size={16} />} />
            </Link>
          </Tooltip>
          <Tooltip title={record.status === 'OPEN' ? 'Mark as Resolved' : 'Reopen Listing'}>
            <Button 
              type="text" 
              shape="circle" 
              icon={record.status === 'OPEN' ? <CheckCircle2 size={16} style={{ color: '#52c41a' }} /> : <XCircle size={16} style={{ color: '#1890ff' }} />} 
              onClick={() => handleResolveTrigger(record.id)}
            />
          </Tooltip>
          <Tooltip title="Delete listing permanently">
            <Button 
              type="text" 
              danger 
              shape="circle" 
              icon={<Trash2 size={16} />} 
              onClick={() => handleDeleteTrigger(record.id)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  // Mobile layout component with consistent card footer action alignment
  const renderMobileCards = () => (
    <Row gutter={[16, 16]}>
      {filteredItems.map((item) => {
        const pendingClaimsCount = item.claims?.filter(c => c.status === 'PENDING').length || 0;
        return (
          <Col key={item.id} xs={24} sm={12}>
            <div style={{ 
              background: '#fff', 
              borderRadius: '8px', 
              overflow: 'hidden', 
              border: '1px solid #f0f0f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}>
              <div style={{ flex: 1 }}>
                <ItemCard item={item} />
              </div>
              
              {/* Claims Section Banner */}
              {activeTab === 'claims' ? (() => {
                const myClaim = item.claims?.find(c => Number(c.claimerId) === Number(currentUser?.id));
                if (!myClaim) return null;
                return (
                  <div style={{ padding: '8px 12px', background: '#e6f7ff', borderTop: '1px solid #91caff', fontSize: '13px' }}>
                    <Text strong>Claim Status: </Text>
                    <Tag color={myClaim.status === 'APPROVED' ? 'green' : myClaim.status === 'REJECTED' ? 'red' : 'gold'}>
                      {myClaim.status}
                    </Tag>
                    <Link to={`/items/${item.id}`} style={{ display: 'block', marginTop: '4px', fontSize: '12px' }}>
                      View Details &rarr;
                    </Link>
                  </div>
                );
              })() : (
                item.type === 'FOUND' && item.claims && item.claims.length > 0 && (
                  <div style={{ padding: '8px 12px', background: '#fffbe6', borderTop: '1px solid #ffe58f', fontSize: '13px' }}>
                    <Text strong>{item.claims.length} Claim(s)</Text> {pendingClaimsCount > 0 && <Tag color="gold" style={{ marginLeft: '8px' }}>{pendingClaimsCount} Pending</Tag>}
                    <Link to={`/items/${item.id}`} style={{ display: 'block', marginTop: '4px', fontSize: '12px' }}>
                      View & Manage Claims &rarr;
                    </Link>
                  </div>
                )
              )}

              {/* Consistent Card Footer Actions */}
              <div style={{ 
                padding: '10px 16px', 
                background: '#fafafa', 
                borderTop: '1px solid #f0f0f0',
                display: 'flex', 
                justifyContent: 'flex-end', 
                alignItems: 'center',
                gap: '8px'
              }}>
                <Link to={`/items/${item.id}/edit`}>
                  <Button size="small" icon={<Edit size={12} />} style={{ display: 'flex', alignItems: 'center' }}>
                    Edit
                  </Button>
                </Link>
                <Button 
                  danger 
                  size="small" 
                  icon={<Trash2 size={12} />} 
                  onClick={() => handleDeleteTrigger(item.id)}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Col>
        );
      })}
    </Row>
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 24px 64px 24px', width: '100%' }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 700, color: '#1f1f1f' }}>
            My Reported Items
          </Title>
          <Paragraph style={{ color: '#595959', margin: '4px 0 0 0' }}>
            Manage listings you have reported, update statuses, or delete active posts.
          </Paragraph>
        </div>
        <Space>
          <Link to="/report/lost">
            <Button type="primary" danger shape="round" icon={<PlusCircle size={16} style={{ marginRight: '6px' }} />}>
              Report Lost Item
            </Button>
          </Link>
          <Link to="/report/found">
            <Button type="primary" shape="round" icon={<PlusCircle size={16} style={{ marginRight: '6px' }} />} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}>
              Report Found Item
            </Button>
          </Link>
        </Space>
      </div>

      {/* FILTER TABS */}
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
        style={{ marginBottom: '20px' }}
        items={[
          { label: 'My Reported Items', key: 'all' },
          { label: 'My Lost Items', key: 'lost' },
          { label: 'My Found Items', key: 'found' },
          { label: 'Resolved', key: 'resolved' },
          { label: 'My Claims', key: 'claims' },
        ]}
      />

      {/* RENDER LISTS */}
      {isLoading ? (
        <LoadingState message="Loading your items list..." />
      ) : hasError ? (
        <ErrorState onRetry={fetchUserItems} />
      ) : filteredItems.length === 0 ? (
        <EmptyState 
          message={`No items found in this tab. Click below to create a listing.`} 
          actionText="Report Lost Item" 
          onAction={() => navigate('/report/lost')} 
        />
      ) : (
        /* RESPONSIVE LAYOUT TOGGLER (TABLE VS CARDS) */
        screens.xs || screens.sm ? (
          renderMobileCards()
        ) : (
          <Table 
            dataSource={filteredItems.map(item => ({ ...item, key: item.id }))} 
            columns={tableColumns} 
            pagination={{ pageSize: 8 }}
            style={{ 
              backgroundColor: '#fff', 
              borderRadius: '12px', 
              overflow: 'hidden', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
              border: '1px solid #f0f0f0' 
            }}
          />
        )
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmDialog
        open={isDeleteOpen}
        title="Delete Listing permanently?"
        content="Are you sure you want to delete this listing from Findora? Other users will no longer be able to search or match against this item description."
        okText="Delete Listing"
        danger
        confirmLoading={isActionLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteOpen(false);
          setSelectedItemId(null);
        }}
      />

      {/* CONFIRM RESOLVE STATUS MODAL */}
      <ConfirmDialog
        open={isResolveOpen}
        title="Update Listing Status?"
        content="Would you like to toggle the status of this item listing between OPEN and RESOLVED? Reopened items appear in public queries; resolved items are archived."
        okText="Update Status"
        confirmLoading={isActionLoading}
        onConfirm={handleResolveConfirm}
        onCancel={() => {
          setIsResolveOpen(false);
          setSelectedItemId(null);
        }}
      />
      
    </div>
  );
};

export default MyItems;