import React, { useState, useRef, useEffect } from 'react';
import { 
  SearchOutlined, 
  StarFilled, 
  HeartOutlined, 
  HeartFilled,
  HomeOutlined,
  TableOutlined,
  BankOutlined,
  SafetyCertificateOutlined,
  ApartmentOutlined,
  FireOutlined,
  ThunderboltOutlined,
  CrownOutlined,
  EnvironmentOutlined,
  PlusOutlined,
  MinusOutlined,
  AimOutlined,
  CoffeeOutlined,
  SunOutlined,
  TeamOutlined,
  ShopOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Popover, Button as AntButton, Divider, Select } from 'antd';
import { sections, propertyCategories } from '../constants';
import MainFooter from '../components/layout/MainFooter';

interface MarketplaceProps {
  onStoreSelect: (store: any) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  HomeOutlined: <HomeOutlined />,
  TableOutlined: <TableOutlined />,
  BankOutlined: <BankOutlined />,
  SafetyCertificateOutlined: <SafetyCertificateOutlined />,
  ApartmentOutlined: <ApartmentOutlined />,
  FireOutlined: <FireOutlined />,
  ThunderboltOutlined: <ThunderboltOutlined />,
  CrownOutlined: <CrownOutlined />,
  EnvironmentOutlined: <EnvironmentOutlined />,
  CoffeeOutlined: <CoffeeOutlined />,
  SunOutlined: <SunOutlined />,
  TeamOutlined: <TeamOutlined />,
  ShopOutlined: <ShopOutlined />,
  AppstoreOutlined: <AppstoreOutlined />
};

const suggestedDestinations = [
  { id: 'near', title: 'Nearby', sub: "Find what's around you", icon: <AimOutlined /> },
  { id: 'byo', title: 'Bulawayo, Zimbabwe', sub: "For a trip abroad", icon: <ApartmentOutlined /> },
  { id: 'san', title: 'Sandton, South Africa', sub: "For sights like Sandton City", icon: <BankOutlined /> },
  { id: 'vic', title: 'Victoria Falls, Zimbabwe', sub: "For nature-lovers", icon: <HomeOutlined /> },
  { id: 'nya', title: 'Nyanga, Zimbabwe', sub: "For a trip abroad", icon: <EnvironmentOutlined /> },
];

const Marketplace: React.FC<MarketplaceProps> = ({ onStoreSelect }) => {
  const [activeCategory, setActiveCategory] = useState('All Stays');
  const [activeSearchSection, setActiveSearchSection] = useState<string | null>(null);
  const [guestCount, setGuestCount] = useState({ adults: 0, children: 0, infants: 0, pets: 0 });
  const [whenMode, setWhenMode] = useState<'dates' | 'pick'>('dates');
  const [stayLength, setStayLength] = useState<'weekend' | 'week' | 'month' | 'other'>('week');
  const [otherNights, setOtherNights] = useState(1);
  const [checkInDay, setCheckInDay] = useState('Monday');
  const sliderRef = useRef<HTMLDivElement>(null);
  const monthSliderRef = useRef<HTMLDivElement>(null);

  // Arrow Visibility States
  const [showCatLeft, setShowCatLeft] = useState(false);
  const [showCatRight, setShowCatRight] = useState(true);
  const [showMonthLeft, setShowMonthLeft] = useState(false);
  const [showMonthRight, setShowMonthRight] = useState(true);

  const checkArrowVisibility = (ref: React.RefObject<HTMLDivElement | null>, setLeft: (v: boolean) => void, setRight: (v: boolean) => void) => {
    if (ref.current) {
      const { scrollLeft, scrollWidth, clientWidth } = ref.current;
      setLeft(scrollLeft > 10); // Show left if scrolled more than 10px
      setRight(scrollLeft < scrollWidth - clientWidth - 10); // Show right if not at the end
    }
  };

  useEffect(() => {
    // Initial checks
    checkArrowVisibility(sliderRef, setShowCatLeft, setShowCatRight);
    
    const catSlider = sliderRef.current;
    const handleCatScroll = () => checkArrowVisibility(sliderRef, setShowCatLeft, setShowCatRight);
    
    catSlider?.addEventListener('scroll', handleCatScroll);
    return () => catSlider?.removeEventListener('scroll', handleCatScroll);
  }, []);

  // Effect for Month Slider (needs to watch stayLength because ref might be null initially)
  useEffect(() => {
    if (stayLength === 'other' || stayLength) { // Re-check when stayLength changes
      const timer = setTimeout(() => {
        checkArrowVisibility(monthSliderRef, setShowMonthLeft, setShowMonthRight);
        
        const monthSlider = monthSliderRef.current;
        const handleMonthScroll = () => checkArrowVisibility(monthSliderRef, setShowMonthLeft, setShowMonthRight);
        
        monthSlider?.addEventListener('scroll', handleMonthScroll);
        return () => monthSlider?.removeEventListener('scroll', handleMonthScroll);
      }, 100); // Small delay to ensure ref is attached
      return () => clearTimeout(timer);
    }
  }, [stayLength, whenMode]);

  const scrollSlider = (offset: number) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const scrollMonthSlider = (offset: number) => {
    if (monthSliderRef.current) {
      monthSliderRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (catName: string) => {
    setActiveCategory(catName);
    const map: Record<string, string> = {
      'All Stays': 'trending',
      'Cabins': 'cabins',
      'Villas': 'villas',
    };
    if (map[catName]) {
      const element = document.getElementById(map[catName]);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const updateGuests = (type: keyof typeof guestCount, delta: number) => {
    setGuestCount(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta)
    }));
  };

  const whereContent = (
    <div className="search-popover-content where-popover">
      <div className="popover-header">Suggested destinations</div>
      <div className="suggestions-list">
        {suggestedDestinations.map(dest => (
          <div key={dest.id} className="suggestion-item">
            <div className="suggestion-icon-wrapper">{dest.icon}</div>
            <div className="suggestion-info">
              <div className="suggestion-title">{dest.title}</div>
              <div className="suggestion-sub">{dest.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const months = [
    { name: 'March', year: '2026' },
    { name: 'April', year: '2026' },
    { name: 'May', year: '2026' },
    { name: 'June', year: '2026' },
    { name: 'July', year: '2026' },
    { name: 'August', year: '2026' },
  ];

  const whenContent = (
    <div className="search-popover-content when-popover">
      <div className="when-mode-pill-container">
        <div className="when-mode-pills">
          <div className={`mode-pill ${whenMode === 'dates' ? 'active' : ''}`} onClick={() => setWhenMode('dates')}>Dates</div>
          <div className={`mode-pill ${whenMode === 'pick' ? 'active' : ''}`} onClick={() => setWhenMode('pick')}>Pick</div>
        </div>
      </div>

      {whenMode === 'dates' ? (
        <div className="calendar-view">
          <div className="month-grid">
            <div className="month-header">
              <span className="month-name">March 2026</span>
            </div>
            <div className="calendar-days">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
              {Array.from({ length: 31 }).map((_, i) => (
                <span key={i} className="day-val">{i + 1}</span>
              ))}
            </div>
          </div>
          <div className="month-grid">
            <div className="month-header">
              <span className="month-name">April 2026</span>
            </div>
            <div className="calendar-days">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
              {Array.from({ length: 30 }).map((_, i) => (
                <span key={i} className="day-val">{i + 1}</span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="pick-view">
          <div className="stay-length-section">
            <div className="section-title">How long would you like to stay?</div>
            <div className="stay-pills">
              {(['weekend', 'week', 'month', 'other'] as const).map(l => (
                <div 
                  key={l} 
                  className={`stay-pill ${stayLength === l ? 'active' : ''}`}
                  onClick={() => setStayLength(l)}
                >
                  {l.charAt(0).toUpperCase() + l.slice(1)}
                </div>
              ))}
            </div>
          </div>

          {stayLength === 'other' && (
            <div className="other-config-panel">
              <div className="config-row">
                <div className="config-label">
                  <div className="label-main">Number of nights</div>
                  <div className="label-sub">{otherNights} {otherNights === 1 ? 'night' : 'nights'}</div>
                </div>
                <div className="guest-ctrl">
                  <AntButton shape="circle" icon={<MinusOutlined />} onClick={() => setOtherNights(Math.max(1, otherNights - 1))} />
                  <span className="count-val">{otherNights}</span>
                  <AntButton shape="circle" icon={<PlusOutlined />} onClick={() => setOtherNights(otherNights + 1)} />
                </div>
              </div>
              
              <div className="config-row" style={{ marginTop: '16px' }}>
                <div className="config-label">
                  <div className="label-main">Check-in day</div>
                  <div className="label-sub">Starts on {checkInDay}</div>
                </div>
                <Select 
                  value={checkInDay} 
                  onChange={setCheckInDay}
                  style={{ width: 120 }}
                  className="premium-select"
                  options={[
                    { value: 'Monday', label: 'Monday' },
                    { value: 'Tuesday', label: 'Tuesday' },
                    { value: 'Wednesday', label: 'Wednesday' },
                    { value: 'Thursday', label: 'Thursday' },
                    { value: 'Friday', label: 'Friday' },
                    { value: 'Saturday', label: 'Saturday' },
                    { value: 'Sunday', label: 'Sunday' },
                  ]}
                />
              </div>
            </div>
          )}

          <div className="month-selector-section">
            <div className="section-title">Pick your Season</div>
            <div className="month-cards-wrapper">
              {showMonthLeft && (
                <AntButton 
                  className="month-nav-btn left" 
                  shape="circle" 
                  size="small"
                  icon={<LeftOutlined style={{ fontSize: '10px' }} />} 
                  onClick={() => scrollMonthSlider(-240)}
                />
              )}
              <div className="month-cards-scroll" ref={monthSliderRef}>
                {months.map(m => (
                  <div key={m.name} className="month-card">
                    <div className="month-icon"><CalendarOutlined /></div>
                    <div className="month-card-name">{m.name}</div>
                    <div className="month-card-year">{m.year}</div>
                  </div>
                ))}
              </div>
              {showMonthRight && (
                <AntButton 
                  className="month-nav-btn right" 
                  shape="circle" 
                  size="small"
                  icon={<RightOutlined style={{ fontSize: '10px' }} />} 
                  onClick={() => scrollMonthSlider(240)}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const whoContent = (
    <div className="search-popover-content who-popover">
      {(['adults', 'children', 'infants', 'pets'] as const).map(type => (
        <div key={type} className="guest-row">
          <div className="guest-info">
            <div className="guest-type" style={{ textTransform: 'capitalize' }}>{type}</div>
            <div className="guest-desc">
              {type === 'adults' ? 'Ages 13 or above' : 
               type === 'children' ? 'Ages 2-12' : 
               type === 'infants' ? 'Under 2' : 'Bringing a service animal?'}
            </div>
          </div>
          <div className="guest-ctrl">
            <AntButton shape="circle" icon={<MinusOutlined />} onClick={() => updateGuests(type, -1)} />
            <span className="count-val">{guestCount[type]}</span>
            <AntButton shape="circle" icon={<PlusOutlined />} onClick={() => updateGuests(type, 1)} />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="marketplace-layout">
      {/* Search Hub */}
      <div className="hero-container">
        <motion.div 
          className="floating-search-hub"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Popover 
            content={whereContent} 
            trigger="click" 
            placement="bottomLeft" 
            overlayClassName="search-hub-popover"
            onOpenChange={(v) => setActiveSearchSection(v ? 'where' : null)}
          >
            <div className={`search-section ${activeSearchSection === 'where' ? 'active' : ''}`}>
              <span className="section-label">Where</span>
              <span className="section-placeholder">Search destinations</span>
            </div>
          </Popover>

          <Divider type="vertical" style={{ height: '32px', margin: 0 }} />

          <Popover 
            content={whenContent} 
            trigger="click" 
            placement="bottom" 
            overlayClassName="search-hub-popover"
            onOpenChange={(v) => setActiveSearchSection(v ? 'when' : null)}
          >
            <div className={`search-section ${activeSearchSection === 'when' ? 'active' : ''}`}>
              <span className="section-label">When</span>
              <span className="section-placeholder">Add dates</span>
            </div>
          </Popover>

          <Divider type="vertical" style={{ height: '32px', margin: 0 }} />

          <Popover 
            content={whoContent} 
            trigger="click" 
            placement="bottomRight" 
            overlayClassName="search-hub-popover"
            onOpenChange={(v) => setActiveSearchSection(v ? 'who' : null)}
          >
            <div className={`search-section ${activeSearchSection === 'who' ? 'active' : ''}`}>
              <span className="section-label">Who</span>
              <span className="section-placeholder">
                {guestCount.adults + guestCount.children > 0 ? `${guestCount.adults + guestCount.children} guests` : 'Add guests'}
              </span>
            </div>
          </Popover>

          <AntButton className="search-trigger-btn" icon={<SearchOutlined />}>
            Search
          </AntButton>
        </motion.div>
      </div>

      {/* Category Slider */}
      <div className="category-slider-wrapper">
        {showCatLeft && (
          <AntButton 
            className="slider-nav-btn left" 
            shape="circle" 
            icon={<LeftOutlined />} 
            onClick={() => scrollSlider(-400)}
          />
        )}
        <div className="category-slider" ref={sliderRef}>
          {propertyCategories.map((cat) => (
            <div 
              key={cat.id} 
              className={`category-item ${activeCategory === cat.name ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat.name)}
            >
              <span className="category-icon">{iconMap[cat.icon] || cat.icon}</span>
              <span className="category-label">{cat.name}</span>
            </div>
          ))}
        </div>
        {showCatRight && (
          <AntButton 
            className="slider-nav-btn right" 
            shape="circle" 
            icon={<RightOutlined />} 
            onClick={() => scrollSlider(400)}
          />
        )}
      </div>

      {/* Property Listing Section */}
      <div className="marketplace-content">
        {sections.map((section) => (
          <div className="section-wrapper" key={section.id} id={section.id}>
            <div className="premium-grid">
              {section.items.map((property: any) => (
                <div key={property.id} className="property-card-v2" onClick={() => onStoreSelect(property)}>
                  <div className="card-image-wrapper">
                    <img src={property.image} alt={property.name} className="card-image" />
                    <div className="heart-action">
                      {property.isFavorite ? <HeartFilled style={{ color: '#ff385c' }} /> : <HeartOutlined />}
                    </div>
                    {property.badges && property.badges.includes('Superhost') && (
                      <div className="guest-favorite-badge">Guest favorite</div>
                    )}
                  </div>
                  
                  <div className="card-info">
                    <div className="info-header">
                      <span className="property-location">{property.name}</span>
                      <span className="property-rating">
                        <StarFilled style={{ fontSize: '12px' }} /> {property.rating}
                      </span>
                    </div>
                    <span className="property-subtitle">{property.time}</span>
                    <span className="property-dates">Mar 20 – 25</span>
                    <div className="property-price">
                      <span className="price-bold">${property.price}</span> night
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <MainFooter />
    </div>
  );
};

export default Marketplace;
