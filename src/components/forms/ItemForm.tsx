import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, Input, Select, DatePicker, Button, Radio, Space, Row, Col } from 'antd';
import dayjs from 'dayjs';
import { ITEM_CATEGORIES, type ItemType } from '../../types/item';
import MediaUploader from './MediaUploader';

const { TextArea } = Input;

// Schema Validation using Zod
const itemFormSchema = z.object({
  type: z.enum(['LOST', 'FOUND'], {
    message: 'Please select if the item is Lost or Found',
  }),
  title: z.string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  category: z.string().min(1, 'Please select a category'),
  description: z.string()
    .min(1, 'Description is required')
    .max(1000, 'Description cannot exceed 1000 characters'),
  location: z.string().min(1, 'Location is required'),
  date: z.any().refine((val) => val !== null && val !== undefined, {
    message: 'Date is required',
  }),
  media: z.array(z.string()),
});

export type ItemFormData = z.infer<typeof itemFormSchema>;

interface ItemFormProps {
  initialValues?: Partial<ItemFormData & { dateString?: string }>;
  onSubmit: (data: ItemFormData & { formattedDate: string }) => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
  fixedType?: ItemType;
}

const ItemForm: React.FC<ItemFormProps> = ({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitButtonText = 'Submit Report',
  fixedType,
}) => {
  // Transform initial values (e.g. date conversion for Dayjs)
  const defaultValues: ItemFormData = {
    type: fixedType || initialValues?.type || 'LOST',
    title: initialValues?.title || '',
    category: initialValues?.category || '',
    description: initialValues?.description || '',
    location: initialValues?.location || '',
    date: initialValues?.date 
      ? dayjs(initialValues.date) 
      : initialValues?.dateString 
        ? dayjs(initialValues.dateString) 
        : dayjs(),
    media: initialValues?.media || [],
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemFormSchema),
    defaultValues,
  });

  const onFormSubmit = (data: ItemFormData) => {
    const formattedDate = dayjs(data.date).toISOString();
    onSubmit({
      ...data,
      formattedDate,
    });
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit(onFormSubmit)}>
      <Row gutter={24}>
        
        {/* LEFT COLUMN: BASIC METADATA */}
        <Col xs={24} lg={14}>
          
          {/* TYPE FIELD */}
          {!fixedType && (
            <Form.Item
              label="Report Type"
              validateStatus={errors.type ? 'error' : ''}
              help={errors.type?.message}
              required
            >
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Radio.Group {...field} buttonStyle="solid" style={{ width: '100%' }}>
                    <Radio.Button value="LOST" style={{ width: '50%', textAlign: 'center', borderColor: '#ff4d4f', backgroundColor: field.value === 'LOST' ? '#ff4d4f' : '' }}>
                      <span style={{ color: field.value === 'LOST' ? '#fff' : '#ff4d4f', fontWeight: 600 }}>LOST ITEM</span>
                    </Radio.Button>
                    <Radio.Button value="FOUND" style={{ width: '50%', textAlign: 'center', borderColor: '#52c41a', backgroundColor: field.value === 'FOUND' ? '#52c41a' : '' }}>
                      <span style={{ color: field.value === 'FOUND' ? '#fff' : '#52c41a', fontWeight: 600 }}>FOUND ITEM</span>
                    </Radio.Button>
                  </Radio.Group>
                )}
              />
            </Form.Item>
          )}

          {/* TITLE FIELD */}
          <Form.Item
            label="Item Title"
            validateStatus={errors.title ? 'error' : ''}
            help={errors.title?.message}
            required
          >
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="e.g. iPhone 15 Pro, Black Trifold Wallet" maxLength={100} size="large" />
              )}
            />
          </Form.Item>

          {/* CATEGORY & DATE */}
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Category"
                validateStatus={errors.category ? 'error' : ''}
                help={errors.category?.message}
                required
              >
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} placeholder="Select item category" size="large">
                      {ITEM_CATEGORIES.map((cat) => (
                        <Select.Option key={cat} value={cat}>
                          {cat}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                />
              </Form.Item>
            </Col>
            
            <Col xs={24} sm={12}>
              <Form.Item
                label="Date Lost / Found"
                validateStatus={errors.date ? 'error' : ''}
                help={errors.date?.message as string}
                required
              >
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker 
                      {...field} 
                      style={{ width: '100%' }} 
                      size="large" 
                      maxDate={dayjs()} 
                      format="YYYY-MM-DD"
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* LOCATION FIELD */}
          <Form.Item
            label="Location"
            validateStatus={errors.location ? 'error' : ''}
            help={errors.location?.message}
            required
          >
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="e.g. Science Library, 2nd floor study area" size="large" />
              )}
            />
          </Form.Item>

          {/* DESCRIPTION FIELD */}
          <Form.Item
            label="Detailed Description"
            validateStatus={errors.description ? 'error' : ''}
            help={errors.description?.message}
            required
          >
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextArea
                  {...field}
                  placeholder="Provide distinct characteristics (colors, stickers, brand, case, or contents of the bag/wallet) to help others identify the item."
                  rows={6}
                  maxLength={1000}
                  showCount
                />
              )}
            />
          </Form.Item>
        </Col>

        {/* RIGHT COLUMN: MEDIA UPLOAD */}
        <Col xs={24} lg={10}>
          <Form.Item
            label="Upload Images"
            validateStatus={errors.media ? 'error' : ''}
            help={errors.media?.message}
          >
            <Controller
              name="media"
              control={control}
              render={({ field }) => (
                <MediaUploader
                  value={field.value}
                  onChange={field.onChange}
                  maxCount={5}
                />
              )}
            />
          </Form.Item>

          {/* ACTIONS */}
          <div style={{ marginTop: '24px', textAlign: 'right' }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit" loading={isSubmitting} block>
                {submitButtonText}
              </Button>
            </Space>
          </div>
        </Col>

      </Row>
    </Form>
  );
};

export default ItemForm;