import React from 'react';

const MainFooter: React.FC = () => {
  return (
    <footer className="premium-footer">
      <div className="footer-content">
        <div className="footer-col">
          <h4>Support</h4>
          <ul>
            <li>Help Center</li>
            <li>Get help with a safety issue</li>
            <li>AirCover</li>
            <li>Anti-discrimination</li>
            <li>Disability support</li>
            <li>Cancellation options</li>
            <li>Report neighborhood concern</li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Hosting</h4>
          <ul>
            <li>Airbnb your home</li>
            <li>Airbnb your experience</li>
            <li>Airbnb your service</li>
            <li>AirCover for Hosts</li>
            <li>Hosting resources</li>
            <li>Community forum</li>
            <li>Hosting responsibly</li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Airbnb</h4>
          <ul>
            <li>2025 Summer Release</li>
            <li>Newsroom</li>
            <li>Careers</li>
            <li>Investors</li>
            <li>Gift cards</li>
            <li>Airbnb.org emergency stays</li>
          </ul>
        </div>
        <div className="footer-col" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h4>Social</h4>
            <ul>
              <li>Facebook</li>
              <li>Twitter</li>
              <li>Instagram</li>
            </ul>
          </div>
          <div style={{ marginTop: 'auto', fontSize: '12px', color: '#717171' }}>
            © 2026 DashDrive Marketplace, Inc. · Privacy · Terms · Sitemap
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
