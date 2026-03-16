import React from 'react';
import { Row, Col, Card, Typography, Button, Space, Input } from 'antd';
import { EnvironmentFilled, RightOutlined, ThunderboltFilled, StarFilled, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { promoBanners, sections } from '../constants';
import CategoryPills from '../components/marketplace/CategoryPills';

const { Title, Text } = Typography;

interface MarketplaceProps {
  onStoreSelect: (store: any) => void;
  scrollToSection: (id: string) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ onStoreSelect, scrollToSection }) => {
  const categoriesList = ['All', 'Restaurants', 'Supermarkets', 'Retail', 'Health', 'Lifestyle', 'Family', 'Restricted'];

  const handleAllClick = (currentIdx: number) => {
    if (currentIdx < sections.length - 1) {
      scrollToSection(sections[currentIdx + 1].id);
    }
  };

  return (
    <div className="marketplace-view">
      <div className="hero-landing">
        <div className="container">
          <motion.div 
            className="hero-landing-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Title level={1} className="hero-main-title">Directly to your door</Title>
            <div className="hero-address-bar glass-effect">
              <Input 
                size="large" 
                placeholder="Enter delivery address" 
                prefix={<EnvironmentFilled style={{ color: '#ffcc00' }} />}
                className="hero-input"
              />
              <Button type="primary" size="large" className="hero-submit">Let's go</Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container">
        <div className="promo-section">
          <Row gutter={[20, 20]} wrap={false} className="promo-scroll">
            {promoBanners.map((banner, idx) => (
              <Col key={banner.id} xs={20} md={12}>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="promo-card hover-lift" bordered={false} style={{ background: banner.bg }}>
                    <div className="promo-body">
                      <div className="promo-text">
                        <Title level={2} className="promo-title" style={{ color: banner.color }}>
                          {banner.title}
                        </Title>
                        <Text className="promo-subtitle">{banner.subtitle}</Text>
                        <div className="promo-code-wrapper">
                          <Text strong className="promo-code">{banner.code}</Text>
                          <Button size="small" className="copy-btn">Copy</Button>
                        </div>
                      </div>
                      <div className="promo-image">
                        <img src={banner.image} alt="Promo" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>

        <div className="categories-header-wrapper">
          <Title level={4}>What to order</Title>
        </div>
        <CategoryPills 
          categories={categoriesList}
          activeCategory="All"
          onCategoryClick={(cat) => {
            const map: Record<string, string> = {
              'All': 'special',
              'Restaurants': 'popular',
              'Supermarkets': 'supermarkets',
            };
            if (map[cat]) scrollToSection(map[cat]);
          }}
        />

              {sections.map((section, sIdx) => (
          <div className="shop-section" key={section.id} id={section.id}>
            <div className="section-title-wrapper">
              <Title level={2}>{section.title}</Title>
              <Button 
                type="link" 
                className="all-btn"
                onClick={() => handleAllClick(sIdx)}
              >
                View All <RightOutlined />
              </Button>
            </div>
            <Row gutter={[20, 24]}>
              {section.items.map((shop) => (
                <Col key={shop.id} xs={24} sm={12} md={8} lg={6}>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8 }} 
                    transition={{ duration: 0.3 }}
                    onClick={() => onStoreSelect(shop)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Card 
                      className="shop-card premium-card" 
                      bordered={false}
                      cover={
                        <div className="shop-card-cover">
                          {shop.image ? (
                            <img src={shop.image} alt={shop.name} className="shop-main-image" />
                          ) : (
                            <div className="shop-logo-box" style={{ background: shop.bg }}>
                              <span className="shop-logo-text" style={{ color: shop.textColor }}>
                                {shop.logo}
                              </span>
                            </div>
                          )}
                          <div className="favorite-btn-wrapper">
                            <Button 
                              shape="circle" 
                              icon={shop.isFavorite ? <HeartFilled style={{ color: '#ff4b2b' }} /> : <HeartOutlined />} 
                              className="heart-btn shadow-md"
                            />
                          </div>
                          {shop.badges && (
                            <div className="shop-badges-container">
                              {shop.badges.map((badge: string) => (
                                <span key={badge} className={`shop-badge ${badge.includes('off') || badge.includes('Discount') ? 'discount' : 'free'}`}>
                                  {badge}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      }
                    >
                      <div className="shop-info">
                        <Title level={5} className="shop-name">{shop.name}</Title>
                        <div className="shop-meta">
                          <Space size={12}>
                            <Space size={4}>
                              <ThunderboltFilled style={{ color: '#ffcc00' }} />
                              <Text type="secondary">{shop.time}</Text>
                            </Space>
                            <Space size={4}>
                              <StarFilled style={{ color: '#ffcc00' }} />
                              <Text type="secondary" style={{ fontWeight: 600 }}>{shop.rating}</Text>
                            </Space>
                          </Space>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
