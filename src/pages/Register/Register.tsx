import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, Form, Input, Button, Typography, Alert, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Phone, Key } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text } = Typography;

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address').min(1, 'Email is required'),
  phone: z.string().optional().refine((val) => !val || /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(val), {
    message: 'Please enter a valid phone number',
  }),
  password: z.string().min(6, 'Password must be at least 6 characters').min(1, 'Password is required'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [errorText, setErrorText] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setErrorText(null);
    setIsSubmitting(true);
    try {
      await register({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
      message.success('Account created! Welcome to Findora.');
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setErrorText(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '90vh',
        padding: '24px',
        background: '#f9fafb',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: '460px',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
          border: '1px solid #f0f0f0',
        }}
        bodyStyle={{ padding: '32px' }}
      >
        {/* LOGO AREA */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: '#fff',
              fontSize: '24px',
              boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)',
              marginBottom: '12px',
            }}
          >
            F
          </div>
          <Title level={3} style={{ margin: 0, fontWeight: 700, color: '#1f1f1f' }}>
            Create an Account
          </Title>
          <Text type="secondary" style={{ fontSize: '14px' }}>
            Join the Findora Lost & Found community
          </Text>
        </div>

        {/* ERROR DISPLAYS */}
        {errorText && (
          <Alert
            message="Registration Error"
            description={errorText}
            type="error"
            showIcon
            closable
            onClose={() => setErrorText(null)}
            style={{ marginBottom: '20px', borderRadius: '8px' }}
          />
        )}

        {/* REGISTRATION FORM */}
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          
          <Form.Item
            label="Full Name"
            validateStatus={errors.name ? 'error' : ''}
            help={errors.name?.message}
            required
          >
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="e.g. John Doe"
                  prefix={<User size={16} style={{ color: '#bfbfbf', marginRight: '6px' }} />}
                  size="large"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Email Address"
            validateStatus={errors.email ? 'error' : ''}
            help={errors.email?.message}
            required
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="e.g. johndoe@domain.com"
                  prefix={<Mail size={16} style={{ color: '#bfbfbf', marginRight: '6px' }} />}
                  size="large"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Phone Number (Optional)"
            validateStatus={errors.phone ? 'error' : ''}
            help={errors.phone?.message}
          >
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="e.g. +1 (555) 123-4567"
                  prefix={<Phone size={16} style={{ color: '#bfbfbf', marginRight: '6px' }} />}
                  size="large"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password?.message}
            required
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  placeholder="Minimum 6 characters"
                  prefix={<Key size={16} style={{ color: '#bfbfbf', marginRight: '6px' }} />}
                  size="large"
                />
              )}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: '28px', marginBottom: '8px' }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              shape="round"
              loading={isSubmitting}
              icon={<UserPlus size={18} style={{ marginRight: '6px' }} />}
              style={{ fontWeight: 600 }}
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        {/* REDIRECT TO LOGIN */}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Text type="secondary" style={{ fontSize: '14px' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 600 }}>
              Log In
            </Link>
          </Text>
        </div>

      </Card>
    </div>
  );
};

export default Register;
