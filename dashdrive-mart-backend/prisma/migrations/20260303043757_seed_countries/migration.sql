-- Seed countries
INSERT INTO "Country" (id, name, code, currency, timezone, "isActive")
VALUES 
('493c52e6-9975-470a-9d62-108bb6b38c23', 'Zimbabwe', 'ZW', 'USD', 'Africa/Harare', true),
('56c22f0c-99d8-4d5c-9c9c-8519e98424a1', 'Zambia', 'ZM', 'ZMW', 'Africa/Lusaka', true),
('70d859fa-1fbe-4767-850d-6547198424a1', 'South Africa', 'ZA', 'ZAR', 'Africa/Johannesburg', true),
('8b3d596a-2d3b-4c5c-9c9c-7c09e98424a1', 'Nigeria', 'NG', 'NGN', 'Africa/Lagos', true)
ON CONFLICT (code) DO NOTHING;