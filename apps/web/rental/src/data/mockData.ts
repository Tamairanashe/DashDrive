export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  type: string;
  pricePerDay: number;
  rating: number;
  trips: number;
  distance: string;
  images: string[];
  hostId?: string;
  host: {
    name: string;
    avatar: string;
    joined: string;
    responseRate: number;
    responseTime: string;
  };
  features: string[];
  description: string;
  location: string;
}

export const MOCK_CARS: Car[] = [
  {
    id: '1',
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    type: 'Electric',
    pricePerDay: 85,
    rating: 4.9,
    trips: 124,
    distance: '2.5 miles away',
    images: [
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&q=80&w=1000'
    ],
    host: {
      name: 'Sarah M.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      joined: 'Oct 2021',
      responseRate: 100,
      responseTime: 'within an hour'
    },
    features: ['Autopilot', 'Bluetooth', 'Backup camera', 'Heated seats', 'USB input'],
    description: 'Experience the future of driving with this pristine 2023 Tesla Model 3. Perfect for city cruising or weekend getaways. The car is thoroughly cleaned and sanitized before every trip.',
    location: 'San Francisco, CA'
  },
  {
    id: '2',
    make: 'Porsche',
    model: '911 Carrera',
    year: 2022,
    type: 'Sports',
    pricePerDay: 250,
    rating: 5.0,
    trips: 45,
    distance: '5.1 miles away',
    images: [
      'https://images.unsplash.com/photo-1503376760366-5a4d3972741f?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1000'
    ],
    host: {
      name: 'David L.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
      joined: 'Mar 2020',
      responseRate: 98,
      responseTime: 'within a few hours'
    },
    features: ['Apple CarPlay', 'Leather seats', 'Convertible', 'Premium audio', 'GPS'],
    description: 'Turn heads in this stunning Porsche 911. Whether you are celebrating a special occasion or just want to enjoy a beautiful drive along the coast, this car delivers an unforgettable experience.',
    location: 'San Francisco, CA'
  },
  {
    id: '3',
    make: 'Jeep',
    model: 'Wrangler',
    year: 2021,
    type: 'SUV',
    pricePerDay: 95,
    rating: 4.8,
    trips: 210,
    distance: '1.2 miles away',
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&q=80&w=1000'
    ],
    host: {
      name: 'Mike T.',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150',
      joined: 'Jan 2019',
      responseRate: 95,
      responseTime: 'within an hour'
    },
    features: ['4WD', 'Bluetooth', 'Removable top', 'All-terrain tires', 'USB input'],
    description: 'Ready for an adventure? This Jeep Wrangler is perfect for exploring the outdoors. Take the top off and enjoy the sunshine. Great for camping trips or beach days.',
    location: 'San Francisco, CA'
  },
  {
    id: '4',
    make: 'BMW',
    model: 'M4',
    year: 2023,
    type: 'Luxury',
    pricePerDay: 180,
    rating: 4.9,
    trips: 88,
    distance: '3.8 miles away',
    images: [
      'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&q=80&w=1000'
    ],
    host: {
      name: 'Jessica W.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
      joined: 'Aug 2022',
      responseRate: 100,
      responseTime: 'within an hour'
    },
    features: ['Apple CarPlay', 'Heated seats', 'Sunroof', 'Blind spot warning', 'Keyless entry'],
    description: 'Experience luxury and performance combined. This BMW M4 offers a thrilling ride with all the premium comforts you expect. Perfect for business trips or a stylish weekend.',
    location: 'San Francisco, CA'
  }
];
