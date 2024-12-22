import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express, { type Request, type Response } from 'express';
import mongoose from 'mongoose';
import routes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env first, before any other imports
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));
}

// API routes
app.use(routes);

// Catch-all route for any requests that don't match the above
app.use((_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

// MongoDB connection and server start
const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks';

console.log('Connection check:', {
  exists: !!process.env.MONGODB_URI,
  uriValue: process.env.MONGODB_URI,
  usingUri: uri
});

mongoose.connect(uri)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB.');
    console.log('Connected to:', process.env.MONGODB_URI ? 'MongoDB Atlas' : 'Local MongoDB');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
  });

const db = mongoose.connection;
db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});