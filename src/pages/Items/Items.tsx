import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Input, 
  Select, 
  Segmented, 
  Button, 
  Space, 
  Typography, 
  Card, 
  Skeleton,
  Breadcrumb
} from 'antd';
import { Search, MapPin, ArrowUpDown, Filter, RotateCcw } from 'lucide-react';
import { itemService } from '../../services/itemService';
import { ITEM_CATEGORIES } from '../../types/item';
import type { Item, ItemType, ItemStatus } from '../../types/item';
import ItemCard from '../../components/items/ItemCard';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

const { Title, Paragraph, Text } = Typography;

const Items: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  // Extract parameters from URL query params
  const typeParam = (searchParams.get('type') as ItemType | '') || '';
  const categoryParam = searchParams.get('category') || '';
  const statusParam = (searchParams.get('status') as ItemStatus | '') || '';
  const searchParam = searchParams.get('search') || '';
  const locationParam = searchParams.get('location') || '';
  const sortParam = searchParams.get('sort') || 'newest';

  // Local state mirror for input fields to allow typing before submitting
  const [searchInput, setSearchInput] = useState(searchParam);
  const [locationInput, setLocationInput] = useState(locationParam);

  // Sync input values when query params change
  useEffect(() => {
    setSearchInput(searchParam);
    setLocationInput(locationParam);
  }, [searchParam, locationParam]);

  // Fetch items based on URL search params
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        const data = await itemService.getItems({
          type: typeParam,
          category: categoryParam,
          status: statusParam,
          location: locationParam,
        });

        // Optional frontend filtering for search keywords if backend search endpoint filters locally
        let filteredData = data;
        if (searchParam) {
          const query = searchParam.toLowerCase();
          filteredData = data.filter(
            (item) =>
              item.title.toLowerCase().includes(query) ||
              item.description.toLowerCase().includes(query)
          );
        }

        // Apply sorting (newest/oldest)
        filteredData.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return sortParam === 'oldest' ? dateA - dateB : dateB - dateA;
        });

        setItems(filteredData);
      } catch (err) {
        console.error('Failed to retrieve items directory:', err);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [typeParam, categoryParam, statusParam, searchParam, locationParam, sortParam]);

  // Helper to update individual query params
  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  // Trigger search on inputs submit
  const handleInputsSubmit = () => {
    const newParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      newParams.set('search', searchInput.trim());
    } else {
      newParams.delete('search');
    }
    if (locationInput.trim()) {
      newParams.set('location', locationInput.trim());
    } else {
      newParams.delete('location');
    }
    setSearchParams(newParams);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchInput('');
    setLocationInput('');
    setSearchParams(new URLSearchParams());
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 24px 64px 24px', width: '100%' }}>
      
      {/* BREADCRUMB */}
      <Breadcrumb 
        style={{ marginBottom: '16px' }}
        items={[
          { title: <Link to="/">Home</Link> },
          { title: 'Browse Directory' }
        ]}
      />

      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, fontWeight: 700, color: '#002c8c' }}>
          Lost & Found Directory
        </Title>
        <Paragraph style={{ color: '#595959', margin: '4px 0 0 0' }}>
          Browse reports, search locations, and filter categories to locate matching items.
        </Paragraph>
      </div>

      {/* FILTER PANEL GRID */}
      <Card 
        style={{ 
          marginBottom: '24px', 
          borderRadius: '12px', 
          boxShadow: '0 4px 12px rgba(24, 144, 255, 0.02)',
          border: '1px solid #f0f0f0' 
        }}
        styles={{ body: { padding: '20px' } }}
      >
        <Row gutter={[16, 16]} align="middle">
          
          {/* SEARCH KEYWORDS */}
          <Col xs={24} md={8}>
            <Input
              placeholder="Search keyword (e.g. phone, wallet)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onPressEnter={handleInputsSubmit}
              prefix={<Search size={16} style={{ color: '#bfbfbf', marginRight: '6px' }} />}
              size="large"
            />
          </Col>

          {/* LOCATION KEYWORDS */}
          <Col xs={24} md={6}>
            <Input
              placeholder="Location (e.g. Library)..."
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              onPressEnter={handleInputsSubmit}
              prefix={<MapPin size={16} style={{ color: '#bfbfbf', marginRight: '6px' }} />}
              size="large"
            />
          </Col>

          {/* SUBMIT INPUTS */}
          <Col xs={24} sm={12} md={4}>
            <Button type="primary" block size="large" onClick={handleInputsSubmit} icon={<Filter size={16} />}>
              Apply Search
            </Button>
          </Col>

          {/* RESET BUTTON */}
          <Col xs={24} sm={12} md={4}>
            <Button block size="large" onClick={handleResetFilters} icon={<RotateCcw size={16} />}>
              Reset All
            </Button>
          </Col>
        </Row>

        <div style={{ height: '1px', backgroundColor: '#f0f0f0', margin: '16px 0' }} />

        {/* SELECT FILTERS Row */}
        <Row gutter={[16, 16]} align="middle">
          
          {/* TYPE FILTER: ALL / LOST / FOUND */}
          <Col xs={24} sm={12} md={6}>
            <Space direction="vertical" size={2} style={{ width: '100%' }}>
              <Text style={{ fontSize: '12px' }} type="secondary" strong>Item Type</Text>
              <Segmented
                value={typeParam || 'ALL'}
                onChange={(val) => updateFilter('type', val === 'ALL' ? '' : val.toString())}
                options={[
                  { label: 'All Items', value: 'ALL' },
                  { label: 'Lost', value: 'LOST' },
                  { label: 'Found', value: 'FOUND' },
                ]}
                block
                size="large"
              />
            </Space>
          </Col>

          {/* CATEGORIES FILTER */}
          <Col xs={24} sm={12} md={6}>
            <Space direction="vertical" size={2} style={{ width: '100%' }}>
              <Text style={{ fontSize: '12px' }} type="secondary" strong>Category</Text>
              <Select
                value={categoryParam || 'All'}
                onChange={(val) => updateFilter('category', val === 'All' ? '' : val)}
                size="large"
                style={{ width: '100%' }}
              >
                <Select.Option value="All">All Categories</Select.Option>
                {ITEM_CATEGORIES.map((cat) => (
                  <Select.Option key={cat} value={cat}>
                    {cat}
                  </Select.Option>
                ))}
              </Select>
            </Space>
          </Col>

          {/* STATUS FILTER */}
          <Col xs={24} sm={12} md={6}>
            <Space direction="vertical" size={2} style={{ width: '100%' }}>
              <Text style={{ fontSize: '12px' }} type="secondary" strong>Listing Status</Text>
              <Segmented
                value={statusParam || 'ALL'}
                onChange={(val) => updateFilter('status', val === 'ALL' ? '' : val.toString())}
                options={[
                  { label: 'All Statuses', value: 'ALL' },
                  { label: 'Open', value: 'OPEN' },
                  { label: 'Resolved', value: 'RESOLVED' },
                ]}
                block
                size="large"
              />
            </Space>
          </Col>

          {/* SORT FILTER */}
          <Col xs={24} sm={12} md={6}>
            <Space direction="vertical" size={2} style={{ width: '100%' }}>
              <Text style={{ fontSize: '12px' }} type="secondary" strong>Sort Order</Text>
              <Select
                value={sortParam}
                onChange={(val) => updateFilter('sort', val)}
                size="large"
                style={{ width: '100%' }}
                suffixIcon={<ArrowUpDown size={15} />}
              >
                <Select.Option value="newest">Newest First</Select.Option>
                <Select.Option value="oldest">Oldest First</Select.Option>
              </Select>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* ITEMS LIST AREA */}
      {isLoading ? (
        <Row gutter={[24, 24]}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Col key={n} xs={24} sm={12} lg={8}>
              <Card style={{ borderRadius: '12px' }}>
                <Skeleton.Image style={{ width: '100%', height: '200px', borderRadius: '8px', marginBottom: '16px' }} active />
                <Skeleton active paragraph={{ rows: 3 }} />
              </Card>
            </Col>
          ))}
        </Row>
      ) : hasError ? (
        <ErrorState message="Could not retrieve items from the directory." />
      ) : items.length === 0 ? (
        <EmptyState 
          message="No items match your active filters. Try broadening your keywords." 
        />
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <Text type="secondary" style={{ fontSize: '15px', fontWeight: 500 }}>
              Found {items.length} {items.length === 1 ? 'item' : 'items'}
            </Text>
          </div>
          
          <Row gutter={[24, 24]}>
            {items.map((item) => (
              <Col key={item.id} xs={24} sm={12} lg={8}>
                <ItemCard item={item} />
              </Col>
            ))}
          </Row>
        </div>
      )}
      
    </div>
  );
};

export default Items;