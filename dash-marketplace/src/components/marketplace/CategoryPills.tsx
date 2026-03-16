import React from 'react';
import { Space, Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';

interface CategoryPillsProps {
  categories: string[];
  activeCategory: string;
  onCategoryClick: (category: string) => void;
}

const CategoryPills: React.FC<CategoryPillsProps> = ({ categories, activeCategory, onCategoryClick }) => {
  return (
    <div className="categories-pills-wrapper">
      <div className="scroll-pills-container">
        <Space size={12} className="categories-pills">
          {categories.map((cat) => (
            <Button 
              key={cat} 
              shape="round" 
              className={`pill-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => onCategoryClick(cat)}
            >
              {cat}
            </Button>
          ))}
        </Space>
      </div>
      <Button shape="circle" icon={<RightOutlined />} className="pill-scroll-next" />
    </div>
  );
};

export default CategoryPills;
