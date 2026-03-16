export const promoBanners = [
  { 
    id: 1, 
    title: '2500 off', 
    subtitle: 'Discount and 0 delivery', 
    code: 'EDA25', 
    color: '#ffcc00', // Updated to Dash Yellow
    bg: '#1a1a1a',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 2, 
    title: '3500 off plus free delivery', 
    subtitle: 'Valid for your first order', 
    code: 'FIRST35', 
    color: '#ff4b2b', 
    bg: '#1a1a1a',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400'
  },
];

export const sections = [
  {
    id: 'special',
    title: 'Special for you',
    items: [
      { id: 's1', name: 'Tumanyan Shaurma', logo: 'TS', time: '20-30 min', rating: 4.8, textColor: '#ffffff', bg: '#ff4b2b', image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&q=80&w=600', badges: ['Discount ֏3500', 'Free delivery'], isFavorite: true },
      { id: 's2', name: 'Grill.am', logo: 'G', time: '35-45 min', rating: 4.8, textColor: '#ffffff', bg: '#1a1a1a', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600', badges: ['Payment by card only', 'Free delivery'], isFavorite: false },
    ]
  },
  {
    id: 'popular',
    title: 'Popular restaurants',
    items: [
      { id: 1, name: 'KFC', logo: 'KFC', time: '10-20 min', rating: 4.6, textColor: '#e41e26', bg: '#ffffff', image: 'https://images.unsplash.com/photo-1513639732840-c9d86f8979a1?auto=format&fit=crop&q=80&w=600', badges: ['Free delivery'], isFavorite: false },
      { id: 2, name: 'Sas Food Court', logo: 'SAS', time: '15-25 min', rating: 4.6, textColor: '#ffffff', bg: '#0054a6', image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&q=80&w=600', badges: ['Free delivery'], isFavorite: false },
    ]
  },
  {
    id: 'supermarkets',
    title: 'Grocery & Supermarkets',
    items: [
      { id: 'm1', name: 'Carrefour', logo: 'C', time: '20-40 min', rating: 4.5, textColor: '#000000', bg: '#ffffff', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600', badges: ['25% off'], isFavorite: false },
      { id: 'a4', name: 'Say Cheese', logo: 'SAY CHEESE', time: '20-30 min', rating: 4.6, textColor: '#8b4513', bg: '#fffbe6', image: 'https://images.unsplash.com/photo-1586201375761-83865007a08d?auto=format&fit=crop&q=80&w=600', badges: [], isFavorite: false },
    ]
  },
  {
    id: 'pharmacies',
    title: 'Pharmacies',
    items: [
      { id: 'p1', name: 'Alfa Pharm', logo: 'Alfa Pharm', time: '~1.5 h', rating: 4.8, textColor: '#2ecc71', bg: '#eefcf0', image: 'https://images.unsplash.com/photo-1585435557343-3b0920377fd6?auto=format&fit=crop&q=80&w=600', badges: [], isFavorite: false },
      { id: 'p2', name: 'Asteria Pharmacy', logo: 'Asteria', time: '~1.5 h', rating: 4.7, textColor: '#e74c3c', bg: '#ffffff', image: 'https://images.unsplash.com/photo-1585435557343-3b0920377fd6?auto=format&fit=crop&q=80&w=600', badges: [], isFavorite: false },
    ]
  }
];

export const menuCategories = ['Popular', 'Pizza', 'Sides', 'Desserts', 'Drinks'];

export const menuItems = [
  { id: 101, category: 'Pizza', name: 'Margherita', price: '3,200', description: 'Classic tomato sauce, mozzarella, fresh basil, and extra virgin olive oil.', image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?auto=format&fit=crop&q=80&w=400' },
  { id: 102, category: 'Pizza', name: 'Pepperoni Passion', price: '4,500', description: 'Double pepperoni and extra mozzarella for the ultimate meat lover.', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=400' },
  { id: 103, category: 'Sides', name: 'Garlic Knots', price: '1,200', description: 'Freshly baked knots with our signature garlic butter and herbs.', image: 'https://images.unsplash.com/photo-1619531043552-04e4e69d9e60?auto=format&fit=crop&q=80&w=400' },
];
