import express from 'express';
import dotenv from 'dotenv/config';
import morgan from 'morgan';
import authRoutes from '../src/routes/auth.route.js'
import { connectDB } from './lib/db.js';

const PORT = process.env.PORT;
const app = express();
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);

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




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
