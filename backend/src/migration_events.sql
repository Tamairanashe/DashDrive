-- DashEvents Schema Migration
-- Designed for high-performance ticketing with explicit state management

-- 1. Venues Table
CREATE TABLE IF NOT EXISTS venues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Events Table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'UPCOMING',
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Sections Table
CREATE TABLE IF NOT EXISTS sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price_multiplier DECIMAL(3, 2) DEFAULT 1.0
);

-- 4. Seats Table
CREATE TABLE IF NOT EXISTS seats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
    row_number TEXT NOT NULL,
    seat_number INTEGER NOT NULL
);

-- 5. Event Seats Table (Availability tracking per Event)
CREATE TABLE IF NOT EXISTS event_seats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    seat_id UUID REFERENCES seats(id) ON DELETE CASCADE,
    price DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'AVAILABLE', -- AVAILABLE, LOCKED, SOLD
    locked_at TIMESTAMP WITH TIME ZONE,
    locked_by UUID, -- REFERENCES users(id)
    UNIQUE(event_id, seat_id)
);

-- 6. Reservations Table (Temporary seat locks)
CREATE TABLE IF NOT EXISTS reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- Simplified for now
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'ACTIVE', -- ACTIVE, EXPIRED, CONVERTED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    reservation_id UUID REFERENCES reservations(id),
    total_amount DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'PENDING', -- PENDING, PAID, FAILED, CANCELLED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Tickets Table
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_seat_id UUID REFERENCES event_seats(id),
    order_id UUID REFERENCES orders(id),
    qr_code TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'VALID', -- VALID, USED, CANCELLED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexing for performance
CREATE INDEX idx_event_seats_event ON event_seats(event_id);
CREATE INDEX idx_event_seats_status ON event_seats(status);
CREATE INDEX idx_reservations_expiry ON reservations(expires_at);
