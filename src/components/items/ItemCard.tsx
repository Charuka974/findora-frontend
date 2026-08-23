import React from 'react';
import { Card, Tag, Button, Typography, Space } from 'antd';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Tag as CategoryIcon, ArrowRight } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { Item } from '../../types/item';

dayjs.extend(relativeTime);
const { Title, Text } = Typography;

interface ItemCardProps {
  item: Item;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const { id, title, type, category, status, location, imageUrls, createdAt } = item;
  
  const isLost = type === 'LOST';
  const isOpen = status === 'OPEN';
  const itemImage = imageUrls && imageUrls.length > 0 
    ? imageUrls[0] 
    : 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=600&auto=format&fit=crop&q=80'; // fallback placeholder image for items

  return (
    <Card
      hoverable
      cover={
        <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
          <img
            alt={title}
            src={itemImage}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
          {/* BADGES ON COVER */}
          <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px', flexDirection: 'column' }}>
            <Tag 
              color={isLost ? '#ff4d4f' : '#52c41a'} 
              style={{ 
                margin: 0, 
                fontWeight: 700, 
                borderRadius: '4px',
                border: 'none',
                boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                padding: '2px 8px'
              }}
            >
              {type}
            </Tag>
            <Tag 
              color={isOpen ? '#1890ff' : '#8c8c8c'} 
              style={{ 
                margin: 0, 
                fontWeight: 600, 
                borderRadius: '4px',
                border: 'none',
                boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                padding: '2px 8px'
              }}
            >
              {status}
            </Tag>
          </div>
        </div>
      }
      styles={{ body: { padding: '16px', display: 'flex', flexDirection: 'column', height: '210px', justifyContent: 'space-between' } }}
      style={{ 
        borderRadius: '12px', 
        overflow: 'hidden', 
        border: '1px solid #f0f0f0',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
      }}
    >
      <div>
        {/* CATEGORY & TITLE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
          <CategoryIcon size={13} style={{ color: '#8c8c8c' }} />
          <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {category}
          </Text>
        </div>
        
        <Title 
          level={5} 
          ellipsis={{ rows: 2 }} 
          style={{ 
            margin: '0 0 10px 0', 
            fontSize: '16px', 
            fontWeight: 600, 
            lineHeight: 1.3,
            color: '#1f1f1f' 
          }}
        >
          {title}
        </Title>

        {/* METADATA: LOCATION & DATE */}
        <Space direction="vertical" size={4} style={{ width: '100%', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#595959', fontSize: '13px' }}>
            <MapPin size={14} style={{ flexShrink: 0, color: '#8c8c8c' }} />
            <Text ellipsis style={{ margin: 0, fontSize: '13px', color: '#595959' }}>{location}</Text>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#595959', fontSize: '13px' }}>
            <Calendar size={14} style={{ flexShrink: 0, color: '#8c8c8c' }} />
            <Text style={{ margin: 0, fontSize: '13px', color: '#595959' }}>
              Reported {dayjs(createdAt).fromNow()}
            </Text>
          </div>
        </Space>
      </div>

      {/* VIEW DETAILS BUTTON */}
      <Link to={`/items/${id}`} style={{ width: '100%', display: 'block' }}>
        <Button 
          type="default" 
          block 
          shape="round" 
          icon={<ArrowRight size={14} />} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '4px',
            fontWeight: 500,
            border: '1px solid #d9d9d9',
          }}
        >
          View Details
        </Button>
      </Link>
    </Card>
  );
};

export default ItemCard;