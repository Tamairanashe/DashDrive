import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { walletService } from './services/wallet.service';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
import { prisma } from './lib/prisma';

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// --- Finance API Routes ---

/**
 * P2P Transfer with Bank Settlement
 * Triggered by the main Admin Backend / Logistics Engine
 */
app.post('/wallets/transfer', async (req, res) => {
  const { sender_id, receiver_id, amount, reference } = req.body;
  
  if (!sender_id || !receiver_id || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await walletService.transfer(sender_id, receiver_id, amount, reference);
    res.json({
      success: true,
      data: result
    });
  } catch (err: any) {
    console.error('Core transfer failure:', err);
    res.status(500).json({ error: err.message });
  }
});

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Basic error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Finance backend running at http://0.0.0.0:${port}`);
});

export { prisma };
