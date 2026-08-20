import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '70vh', 
        width: '100%' 
      }}
    >
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist on Findora."
        extra={
          <Button type="primary" onClick={() => navigate('/')} shape="round" size="large">
            Back to Home
          </Button>
        }
      />
    </div>
  );
};

export default NotFound;
