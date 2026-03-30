
import React, { useState, useEffect } from 'react';
import { Car, Navigation, Search, GraduationCap } from 'lucide-react';
import RidePage from './RidePage';
import TaxiPage from './TaxiPage';
import RentalPage from './RentalPage';
import SchoolRidesPage from './SchoolRidesPage';

const MobilityPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'ride' | 'taxi' | 'rental' | 'school'>('ride');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  if (activeTab === 'ride') {
    return (
      <RidePage
        onBack={onBack}
        onTaxiClick={() => setActiveTab('taxi')}
        onRentalClick={() => setActiveTab('rental')}
        onSchoolClick={() => setActiveTab('school')}
      />
    );
  }

  if (activeTab === 'taxi') {
    return (
      <TaxiPage
        onBack={onBack}
        onRideClick={() => setActiveTab('ride')}
        onRentalClick={() => setActiveTab('rental')}
        onSchoolClick={() => setActiveTab('school')}
      />
    );
  }

  if (activeTab === 'rental') {
    return (
      <RentalPage
        onBack={onBack}
        onRideClick={() => setActiveTab('ride')}
        onTaxiClick={() => setActiveTab('taxi')}
        onSchoolClick={() => setActiveTab('school')}
      />
    );
  }

  if (activeTab === 'school') {
    return (
      <SchoolRidesPage
        onBack={onBack}
        onRideClick={() => setActiveTab('ride')}
        onTaxiClick={() => setActiveTab('taxi')}
        onRentalClick={() => setActiveTab('rental')}
      />
    );
  }

  return null;
};

export default MobilityPage;
