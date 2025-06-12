import express from 'express';
import passport from 'passport';
import session from 'express-session';
import dotenv from 'dotenv';
import conectDB from "./config/db_config.js"
import './config/passport.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from "./routes/userRoutes.js"
import path from "path"
import cors from "cors"

dotenv.config();
conectDB()
const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());

// Middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'secretkey',
  resave: false,
  saveUninitialized: false
}));

app.use(cors());
// Or for more control:
app.use(cors({
  origin: '*',  // Allow all domains
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(passport.initialize());
app.use(passport.session());


app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/auth', authRoutes);


//all user routes 
app.use("/api/users", userRoutes)

// email by id
app.use("/api/email", userRoutes)

app.get('/', (req, res) => {
  res.send('Welcome to Google Auth + Gmail API');
});



app.listen(PORT, () =>
  console.log(`SERVER IS RUNNING AT PORT ${PORT}`)
);


