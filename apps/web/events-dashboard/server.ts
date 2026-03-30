import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";

const app = express();
const PORT = 3000;
const ACCESS_SECRET = "access_secret_123";
const REFRESH_SECRET = "refresh_secret_456";

app.use(express.json());
app.use(cookieParser());

// In-memory database
const users: any[] = [];
const events = [
  { id: 1, name: "The Eras Tour", venue: "Wembley Stadium", date: "2026-08-15", totalSeats: 16, category: "POP", image: "https://picsum.photos/seed/eras/600/400" },
  { id: 2, name: "Champions League Final", venue: "Allianz Arena", date: "2026-05-30", totalSeats: 16, category: "SPORT", image: "https://picsum.photos/seed/champions/600/400" },
  { id: 3, name: "Hamilton", venue: "Victoria Palace Theatre", date: "2026-04-10", totalSeats: 16, category: "THEATRE", image: "https://picsum.photos/seed/hamilton/600/400" },
  { id: 4, name: "Jill Scott", venue: "The O2", date: "2026-07-20", totalSeats: 16, category: "R&B", image: "https://picsum.photos/seed/jill/600/400" },
  { id: 5, name: "Tom Jones", venue: "Cardiff Castle", date: "2026-06-12", totalSeats: 16, category: "POP", image: "https://picsum.photos/seed/tom/600/400" },
  { id: 6, name: "Nations Championship", venue: "Twickenham", date: "2026-11-27", totalSeats: 16, category: "RUGBY", image: "https://picsum.photos/seed/rugby/600/400" },
];

// Generate seats for events
const seats: Record<number, any[]> = {};
events.forEach(event => {
  seats[event.id] = [];
  const rows = ['A', 'B', 'C', 'D'];
  rows.forEach(row => {
    for (let i = 1; i <= 4; i++) {
      seats[event.id].push({
        id: `${row}${i}`,
        row,
        number: i,
        status: "available", // available, locked, sold
        lockedBy: null,
        lockExpiry: null
      });
    }
  });
});

const orders: any[] = [];

// Queue System
const MAX_ACTIVE_USERS = 2; // Low limit to demonstrate queuing
const queues: Record<number, { activeUsers: Set<string>, waitingUsers: string[] }> = {};
events.forEach(e => {
  queues[e.id] = { activeUsers: new Set(), waitingUsers: [] };
});

const promoteUsers = (eventId: number) => {
  const queue = queues[eventId];
  if (!queue) return;
  while (queue.activeUsers.size < MAX_ACTIVE_USERS && queue.waitingUsers.length > 0) {
    const nextUser = queue.waitingUsers.shift();
    if (nextUser) queue.activeUsers.add(nextUser);
  }
};

// Auth Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, ACCESS_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// API Routes
app.get("/api/events", (req, res) => {
  res.json(events);
});

app.post("/api/events", authenticateToken, (req, res) => {
  const { name, venue, date, category, image, seats: newSeats } = req.body;
  const newEvent = {
    id: events.length + 1,
    name,
    venue,
    date,
    category: category.toUpperCase(),
    totalSeats: newSeats.length,
    image
  };

  events.push(newEvent);
  
  // Register seats for the new event
  seats[newEvent.id] = newSeats.map((s: any) => ({
    id: s.id,
    row: s.row,
    number: s.number,
    status: "available",
    lockedBy: null,
    lockExpiry: null,
    price: s.price
  }));

  // Initialize queue for the new event
  queues[newEvent.id] = { activeUsers: new Set(), waitingUsers: [] };

  res.json({ success: true, event: newEvent });
});

// Auth Routes
app.post("/api/auth/register", async (req, res) => {
  const { email, password, firstName, lastName, country, zip, role } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ 
    email, 
    password: hashedPassword, 
    firstName, 
    lastName, 
    country, 
    zip, 
    role: role || "individual" 
  });
  res.json({ success: true, message: "User created" });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  const accessToken = jwt.sign({ email: user.email, role: user.role }, ACCESS_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ email: user.email }, REFRESH_SECRET, { expiresIn: "7d" });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  });

  res.json({ 
    accessToken, 
    user: { 
      email: user.email, 
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      country: user.country,
      zip: user.zip
    } 
  });
});

app.post("/api/auth/refresh", (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);

  try {
    const data: any = jwt.verify(token, REFRESH_SECRET);
    const user = users.find(u => u.email === data.email);
    if (!user) return res.sendStatus(403);

    const accessToken = jwt.sign({ email: user.email, role: user.role }, ACCESS_SECRET, { expiresIn: "15m" });
    res.json({ accessToken });
  } catch (err) {
    res.sendStatus(403);
  }
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ success: true });
});

// Queue Endpoints
app.post("/api/events/:id/queue/join", (req, res) => {
  const eventId = parseInt(req.params.id);
  const { userId } = req.body;
  const queue = queues[eventId];
  
  if (!queue) return res.status(404).json({ error: "Event not found" });

  if (queue.activeUsers.has(userId)) {
    return res.json({ status: 'active' });
  }

  const waitingIndex = queue.waitingUsers.indexOf(userId);
  if (waitingIndex !== -1) {
    return res.json({ status: 'waiting', position: waitingIndex + 1 });
  }

  if (queue.activeUsers.size < MAX_ACTIVE_USERS) {
    queue.activeUsers.add(userId);
    return res.json({ status: 'active' });
  } else {
    // Assign a random position in the queue
    const randomPos = Math.floor(Math.random() * (queue.waitingUsers.length + 1));
    queue.waitingUsers.splice(randomPos, 0, userId);
    return res.json({ status: 'waiting', position: queue.waitingUsers.indexOf(userId) + 1 });
  }
});

app.get("/api/events/:id/queue/status", (req, res) => {
  const eventId = parseInt(req.params.id);
  const userId = req.query.userId as string;
  const queue = queues[eventId];
  
  if (!queue) return res.status(404).json({ error: "Event not found" });

  if (queue.activeUsers.has(userId)) {
    return res.json({ status: 'active' });
  }

  const waitingIndex = queue.waitingUsers.indexOf(userId);
  if (waitingIndex !== -1) {
    return res.json({ status: 'waiting', position: waitingIndex + 1 });
  }

  return res.json({ status: 'none' });
});

app.post("/api/events/:id/queue/leave", (req, res) => {
  const eventId = parseInt(req.params.id);
  const { userId } = req.body;
  const queue = queues[eventId];
  
  if (!queue) return res.status(404).json({ error: "Event not found" });

  queue.activeUsers.delete(userId);
  const waitingIndex = queue.waitingUsers.indexOf(userId);
  if (waitingIndex !== -1) {
    queue.waitingUsers.splice(waitingIndex, 1);
  }

  promoteUsers(eventId);
  res.json({ success: true });
});

app.get("/api/events/:id/seats", (req, res) => {
  const eventId = parseInt(req.params.id);
  const eventSeats = seats[eventId] || [];
  
  // Clean up expired locks
  const now = Date.now();
  eventSeats.forEach(seat => {
    if (seat.status === "locked" && seat.lockExpiry && seat.lockExpiry < now) {
      seat.status = "available";
      seat.lockedBy = null;
      seat.lockExpiry = null;
    }
  });

  res.json(eventSeats);
});

app.post("/api/seats/lock", (req, res) => {
  const { eventId, seatId, userId } = req.body;
  const eventSeats = seats[eventId];
  if (!eventSeats) return res.status(404).json({ error: "Event not found" });

  const seat = eventSeats.find(s => s.id === seatId);
  if (!seat) return res.status(404).json({ error: "Seat not found" });

  // Clean up expired lock if any
  if (seat.status === "locked" && seat.lockExpiry && seat.lockExpiry < Date.now()) {
    seat.status = "available";
  }

  if (seat.status !== "available") {
    let reason = "unavailable";
    if (seat.status === "locked") reason = "already locked";
    if (seat.status === "sold") reason = "just sold";
    return res.status(400).json({ error: `Seat ${seat.id} is ${reason}` });
  }

  seat.status = "locked";
  seat.lockedBy = userId;
  seat.lockExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes

  res.json({ success: true, seat });
});

app.post("/api/orders", async (req, res) => {
  const { eventId, seatId, userId, email } = req.body;
  
  const eventSeats = seats[eventId];
  if (!eventSeats) return res.status(404).json({ error: "Event not found" });

  const seat = eventSeats.find(s => s.id === seatId);
  if (!seat) return res.status(404).json({ error: "Seat not found" });

  if (seat.status !== "locked" || seat.lockedBy !== userId) {
    return res.status(400).json({ error: "Seat is not locked by you or lock expired" });
  }

  // Mark as sold
  seat.status = "sold";
  seat.lockedBy = null;
  seat.lockExpiry = null;

  const orderId = uuidv4();
  const ticketData = {
    orderId,
    eventId,
    seatId,
    email
  };

  const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(ticketData));

  const order = {
    id: orderId,
    eventId,
    seatId,
    userId,
    email,
    status: "paid",
    qrCode: qrCodeDataUrl,
    createdAt: new Date().toISOString()
  };

  orders.push(order);

  // Leave queue after purchase
  const queue = queues[eventId];
  if (queue) {
    queue.activeUsers.delete(userId);
    promoteUsers(eventId);
  }

  res.json({ success: true, order });
});

async function startServer() {
  console.log("Starting server initialization...");
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    console.log("Creating Vite server...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    console.log("Vite server created, adding middleware...");
    app.use(vite.middlewares);
  } else {
    console.log("Production mode: serving static files...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
