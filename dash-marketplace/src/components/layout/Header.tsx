import React from 'react';
import { 
  Layout, 
  Button, 
  Space, 
  Avatar, 
} from 'antd';
import { 
  UserOutlined,
  ShoppingCartOutlined,
  GlobalOutlined,
  MenuOutlined,
} from '@ant-design/icons';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  cartCount: number;
  onLogoClick: () => void;
  onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onLogoClick, onCartClick }) => {
  return (
    <AntHeader className="premium-header">
      <div className="header-inner-content">
        {/* Left: Brand */}
        <div className="header-left-section" onClick={onLogoClick} style={{ cursor: 'pointer' }}>
          <div className="brand-logo-wrapper">
            <span className="logo-text">dash</span>
          </div>
        </div>

        {/* Center: Navigation */}
        <div className="header-center-section">
          <div className="center-nav-item active">
            <span>Homes</span>
          </div>
          <div className="center-nav-item">
            <span>Experiences</span>
            <span className="dot-new"></span>
          </div>
          <div className="center-nav-item">
            <span>Services</span>
            <span className="dot-new"></span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="header-right-section">
          <Space size={20}>
            <Button type="text" className="nav-action-link">Switch to hosting</Button>
            <Button type="text" icon={<GlobalOutlined />} className="nav-utility-icon" />
            
            <div className="user-menu-pill">
              <MenuOutlined style={{ fontSize: 16 }} />
              <Avatar size={30} icon={<UserOutlined />} className="user-avatar-small" />
            </div>

            <Button 
              type="text" 
              icon={<ShoppingCartOutlined style={{ fontSize: 24 }} />} 
              className="cart-btn-premium"
              onClick={onCartClick}
            >
              {cartCount > 0 && <span className="cart-badge-premium">{cartCount}</span>}
            </Button>
          </Space>
        </div>
      </div>
    </AntHeader>
  );
};

export default Header;
