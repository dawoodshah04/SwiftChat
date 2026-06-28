import express from 'express';
import dotenv from 'dotenv/config';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from '../src/routes/auth.route.js'
import userRoutes from '../src/routes/user.route.js'
import chatRoutes from '../src/routes/chat.route.js'
import { connectDB } from './lib/db.js';

const PORT = process.env.PORT || 5001;
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const app = express();
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes)
app.use('/api/chat', chatRoutes)



/*
app.get('/api/auth/signup', (req, res)=>{
  res.send('Signup route');
})

app.get('/api/auth/login', (req, res)=>{
  res.send('Login route');
})

app.get('/api/auth/logout', (req, res)=>{
  res.send('Logout route');
})
*/


const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
