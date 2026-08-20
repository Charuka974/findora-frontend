import React, { useState } from 'react';
import { Layout, Menu, Button, Drawer, Dropdown, Space, Avatar, Grid } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Search, 
  PlusCircle, 
  User, 
  FolderHeart, 
  LogOut, 
  Menu as MenuIcon
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const { Header, Content, Footer } = Layout;
const { useBreakpoint } = Grid;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  // Determine active keys based on current path
  const getActiveKey = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path === '/items') return 'all-items';
    if (path === '/items/lost') return 'lost-items';
    if (path === '/items/found') return 'found-items';
    if (path === '/my-items') return 'my-items';
    if (path === '/profile') return 'profile';
    return '';
  };

  // User Dropdown Menu for Desktop
  const userMenuItems = [
    {
      key: 'profile',
      label: <Link to="/profile">My Profile</Link>,
      icon: <User size={16} />,
    },
    {
      key: 'my-items',
      label: <Link to="/my-items">My Reported Items</Link>,
      icon: <FolderHeart size={16} />,
    },
    {
      key: 'report-lost',
      label: <Link to="/report/lost">Report Lost Item</Link>,
      icon: <PlusCircle size={16} style={{ color: '#ff4d4f' }} />,
    },
    {
      key: 'report-found',
      label: <Link to="/report/found">Report Found Item</Link>,
      icon: <PlusCircle size={16} style={{ color: '#52c41a' }} />,
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      label: <span onClick={handleLogout}>Log Out</span>,
      icon: <LogOut size={16} />,
      danger: true,
    },
  ];

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb' }}>
      {/* HEADER SECTION */}
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid #f0f2f5',
          padding: screens.xs ? '0 16px' : '0 40px',
          height: '64px',
        }}
      >
        {/* LOGO CONTAINER */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                color: '#fff',
                fontSize: '18px',
                boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)',
              }}
            >
              F
            </div>
            <span
              style={{
                fontSize: '20px',
                fontWeight: 700,
                background: 'linear-gradient(90deg, #096dd9 0%, #1890ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px',
              }}
            >
              Findora
            </span>
          </Link>
        </div>

        {/* CENTRAL NAVIGATION (DESKTOP) */}
        {!screens.xs && !screens.sm ? (
          <Menu
            mode="horizontal"
            selectedKeys={[getActiveKey()]}
            style={{
              flex: 1,
              justifyContent: 'center',
              border: 'none',
              background: 'transparent',
              fontSize: '15px',
            }}
          >
            <Menu.Item key="home" icon={<Home size={15} />}>
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="lost-items" icon={<Search size={15} style={{ color: '#ff4d4f' }} />}>
              <Link to="/items/lost">Lost Items</Link>
            </Menu.Item>
            <Menu.Item key="found-items" icon={<Search size={15} style={{ color: '#52c41a' }} />}>
              <Link to="/items/found">Found Items</Link>
            </Menu.Item>
            <Menu.Item key="all-items" icon={<Search size={15} />}>
              <Link to="/items">All Browse</Link>
            </Menu.Item>
          </Menu>
        ) : null}

        {/* RIGHT SIDE ACTIONS (DESKTOP) */}
        {!screens.xs && !screens.sm ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {isAuthenticated && user ? (
              <Space size="middle">
                <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <Avatar 
                      style={{ 
                        backgroundColor: '#1890ff', 
                        verticalAlign: 'middle', 
                        boxShadow: '0 2px 6px rgba(24,144,255,0.2)' 
                      }}
                    >
                      {user.name ? user.name[0].toUpperCase() : 'U'}
                    </Avatar>
                    <span style={{ fontWeight: 500, color: '#262626' }}>{user.name}</span>
                  </div>
                </Dropdown>
                <Link to="/report/lost">
                  <Button type="primary" shape="round" icon={<PlusCircle size={15} style={{ marginRight: '4px' }} />}>
                    Report Item
                  </Button>
                </Link>
              </Space>
            ) : (
              <Space size="middle">
                <Link to="/login">
                  <Button type="text" style={{ fontSize: '15px', fontWeight: 500 }}>Log In</Button>
                </Link>
                <Link to="/register">
                  <Button type="primary" shape="round" style={{ fontWeight: 500 }}>
                    Register
                  </Button>
                </Link>
              </Space>
            )}
          </div>
        ) : (
          /* MOBILE HAMBURGER BUTTON */
          <Button
            type="text"
            icon={<MenuIcon size={24} />}
            onClick={() => setIsMobileMenuOpen(true)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          />
        )}
      </Header>

      {/* MOBILE NAVIGATION DRAWER */}
      <Drawer
        title="Findora Menu"
        placement="right"
        onClose={() => setIsMobileMenuOpen(false)}
        open={isMobileMenuOpen}
        width={280}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            {isAuthenticated && user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '20px', borderBottom: '1px solid #f0f0f0', marginBottom: '20px' }}>
                <Avatar size="large" style={{ backgroundColor: '#1890ff' }}>
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </Avatar>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '16px' }}>{user.name}</div>
                  <div style={{ fontSize: '13px', color: '#8c8c8c' }}>{user.email}</div>
                </div>
              </div>
            )}

            <Menu
              mode="vertical"
              selectedKeys={[getActiveKey()]}
              style={{ border: 'none', fontSize: '16px' }}
              onClick={handleMobileLinkClick}
            >
              <Menu.Item key="home" icon={<Home size={18} />}>
                <Link to="/">Home</Link>
              </Menu.Item>
              <Menu.Item key="lost-items" icon={<Search size={18} style={{ color: '#ff4d4f' }} />}>
                <Link to="/items/lost">Lost Items</Link>
              </Menu.Item>
              <Menu.Item key="found-items" icon={<Search size={18} style={{ color: '#52c41a' }} />}>
                <Link to="/items/found">Found Items</Link>
              </Menu.Item>
              <Menu.Item key="all-items" icon={<Search size={18} />}>
                <Link to="/items">Browse All</Link>
              </Menu.Item>

              {isAuthenticated && (
                <>
                  <Menu.Divider />
                  <Menu.Item key="profile" icon={<User size={18} />}>
                    <Link to="/profile">My Profile</Link>
                  </Menu.Item>
                  <Menu.Item key="my-items" icon={<FolderHeart size={18} />}>
                    <Link to="/my-items">My Reported Items</Link>
                  </Menu.Item>
                  <Menu.Item key="report-lost-mob" icon={<PlusCircle size={18} style={{ color: '#ff4d4f' }} />}>
                    <Link to="/report/lost">Report Lost</Link>
                  </Menu.Item>
                  <Menu.Item key="report-found-mob" icon={<PlusCircle size={18} style={{ color: '#52c41a' }} />}>
                    <Link to="/report/found">Report Found</Link>
                  </Menu.Item>
                </>
              )}
            </Menu>
          </div>

          <div style={{ paddingBottom: '20px' }}>
            {isAuthenticated ? (
              <Button
                danger
                type="primary"
                block
                shape="round"
                icon={<LogOut size={16} />}
                onClick={handleLogout}
              >
                Log Out
              </Button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link to="/login" style={{ width: '100%' }} onClick={handleMobileLinkClick}>
                  <Button block shape="round">Log In</Button>
                </Link>
                <Link to="/register" style={{ width: '100%' }} onClick={handleMobileLinkClick}>
                  <Button type="primary" block shape="round">Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </Drawer>

      {/* CORE CONTENT LAYOUT */}
      <Content style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </Content>

      {/* FOOTER SECTION */}
      <Footer
        style={{
          textAlign: 'center',
          backgroundColor: '#ffffff',
          borderTop: '1px solid #f0f2f5',
          padding: '24px 40px',
          color: '#595959',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexFlow: 'row wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 700, color: '#1f1f1f' }}>Findora</span>
            <span>© 2026. Connecting lost items and their owners.</span>
          </div>
          <Space size="large">
            <Link to="/items" style={{ color: '#595959' }}>Search Directory</Link>
            <a href="#how" style={{ color: '#595959' }}>How It Works</a>
            <a href="#about" style={{ color: '#595959' }}>Privacy Policy</a>
          </Space>
        </div>
      </Footer>
    </Layout>
  );
};

export default AppLayout;
