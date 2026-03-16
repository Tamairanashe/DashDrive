export const promoBanners = [
  { 
    id: 1, 
    title: 'Up to 20% off', 
    subtitle: 'On your first weekend stay', 
    code: 'DASHSTAY20', 
    color: '#ffcc00', 
    bg: '#1a1a1a',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=600'
  },
  { 
    id: 2, 
    title: 'New Host Bonus', 
    subtitle: 'List your property and earn $50', 
    code: 'HOST50', 
    color: '#10b981', 
    bg: '#1a1a1a',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=600'
  },
];

export const sections = [
  {
    id: 'trending',
    title: 'Trending Stays',
    items: [
      { id: 'p1', name: 'Emerald Lake Cabin', logo: 'EL', time: 'Nyanga', rating: 4.95, textColor: '#ffffff', bg: '#064e3b', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600', badges: ['Superhost', 'Instant Book'], isFavorite: true, price: 120 },
      { id: 'p2', name: 'Modern City Loft', logo: 'ML', time: 'Harare CBD', rating: 4.82, textColor: '#ffffff', bg: '#1e1e1e', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=600', badges: ['City View'], isFavorite: false, price: 85 },
    ]
  },
  {
    id: 'cabins',
    title: 'Authentic Cabins',
    items: [
      { id: 'c1', name: 'The Pine Retreat', logo: 'PR', time: 'Vumba Mountains', rating: 4.75, textColor: '#ffffff', bg: '#451a03', image: 'https://images.unsplash.com/photo-1449156001437-3a1665cbbb2d?auto=format&fit=crop&q=80&w=600', badges: ['Fireplace'], isFavorite: false, price: 150 },
      { id: 'c2', name: 'Misty Peaks Lodge', logo: 'MP', time: 'Inyanga', rating: 4.88, textColor: '#ffffff', bg: '#0c4a6e', image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=600', badges: ['Panoramic View'], isFavorite: false, price: 210 },
    ]
  },
  {
    id: 'villas',
    title: 'Luxury Villas',
    items: [
      { id: 'v1', name: 'Zambezi Sunset Villa', logo: 'ZS', time: 'Victoria Falls', rating: 4.98, textColor: '#ffffff', bg: '#7c2d12', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600', badges: ['Private Pool', 'Chef Available'], isFavorite: true, price: 450 },
      { id: 'v2', name: 'Azure Coast Villa', logo: 'AC', time: 'Kariba Shore', rating: 4.65, textColor: '#000000', bg: '#f0f9ff', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=600', badges: ['Lakefront'], isFavorite: false, price: 320 },
    ]
  }
];

export const propertyCategories = [
  { id: '1', name: 'All Stays', icon: 'AppstoreOutlined' },
  { id: '2', name: 'Cabins', icon: 'TableOutlined' },
  { id: '3', name: 'Villas', icon: 'BankOutlined' },
  { id: '4', name: 'Beachfront', icon: 'SafetyCertificateOutlined' },
  { id: '5', name: 'Apartments', icon: 'ApartmentOutlined' },
  { id: '6', name: 'Trending', icon: 'FireOutlined' },
  { id: '7', name: 'Amazing Pools', icon: 'ThunderboltOutlined' },
  { id: '8', name: 'Luxe', icon: 'CrownOutlined' },
  { id: '9', name: 'Countryside', icon: 'EnvironmentOutlined' },
  { id: '10', name: 'House', icon: 'HomeOutlined' },
  { id: '11', name: 'Bed & breakfast', icon: 'CoffeeOutlined' },
  { id: '12', name: 'Farm', icon: 'SunOutlined' },
  { id: '13', name: 'Guest House', icon: 'TeamOutlined' },
  { id: '14', name: 'Hotel', icon: 'ShopOutlined' },
];

export const amenityIcons = {
  wifi: 'WifiOutlined',
  pool: 'PoolOutlined',
  parking: 'CarOutlined',
  kitchen: 'CoffeeOutlined',
  ac: 'CloudOutlined',
};
