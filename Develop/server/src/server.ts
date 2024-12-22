import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import mongoose from 'mongoose';
import routes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables first
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// MongoDB connection setup
const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks';

console.log('Connection check:', {
  exists: !!process.env.MONGODB_URI,
  uriValue: process.env.MONGODB_URI,
  usingUri: uri
});

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Connect to MongoDB
const db = mongoose.connection;
mongoose.connect(uri)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB.');
    console.log('Connected to:', process.env.MONGODB_URI ? 'MongoDB Atlas' : 'Local MongoDB');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
  });

app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});