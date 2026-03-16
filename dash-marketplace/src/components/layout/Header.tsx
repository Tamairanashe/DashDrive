import React from 'react';
import { 
  Layout, 
  Input, 
  Button, 
  Space, 
  Avatar, 
  Dropdown, 
  type MenuProps,
} from 'antd';
import { 
  SearchOutlined,
  UserOutlined,
  EnvironmentFilled,
  ShoppingCartOutlined,
  FileTextOutlined,
  DownOutlined,
  ShoppingOutlined,
  CarOutlined,
  ThunderboltFilled,
  MedicineBoxOutlined
} from '@ant-design/icons';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  cartCount: number;
  onLogoClick: () => void;
  onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onLogoClick, onCartClick }) => {
  const serviceItems: MenuProps['items'] = [
    { key: 'market', icon: <ShoppingOutlined />, label: 'Dash @Market' },
    { key: 'ride', icon: <CarOutlined />, label: 'Dash Ride' },
    { key: 'parcel', icon: <ThunderboltFilled />, label: 'Dash Parcel' },
    { key: 'pharmacy', icon: <MedicineBoxOutlined />, label: 'Dash Pharmacy' },
  ];

  return (
    <AntHeader className="yandex-header">
      <div className="container header-inner">
        <div className="header-left">
          <Dropdown menu={{ items: serviceItems }} trigger={['click']}>
            <Button type="text" className="service-switcher">
              <Space size={4}>
                <div className="yandex-logo" onClick={(e) => {
                  e.stopPropagation();
                  onLogoClick();
                }}>
                  <span className="logo-brand">Dash</span>
                  <span className="logo-eats">@Market</span>
                </div>
                <DownOutlined style={{ fontSize: 10, color: '#888' }} />
              </Space>
            </Button>
          </Dropdown>
        </div>

        <div className="header-center">
          <div className="header-search-wrapper">
            <Input
              placeholder="Search restaurants or products"
              prefix={<SearchOutlined style={{ color: '#888' }} />}
              className="yandex-search-header"
            />
          </div>
          <Button 
            type="primary" 
            icon={<EnvironmentFilled />} 
            className="address-btn-header shadow-sm"
          >
            Enter address
          </Button>
        </div>

        <div className="header-right">
          <Space size={16}>
            <Button type="text" icon={<FileTextOutlined />} className="header-nav-btn">
              Orders
            </Button>
            <Button 
              type="primary" 
              icon={<ShoppingCartOutlined />} 
              className="header-cart-btn"
              onClick={onCartClick}
            >
              {cartCount > 0 && <span className="cart-badge-header">{cartCount}</span>}
              <span>Cart</span>
            </Button>
            <Avatar icon={<UserOutlined />} className="user-avatar-header" />
          </Space>
        </div>
      </div>
    </AntHeader>
  );
};

export default Header;
