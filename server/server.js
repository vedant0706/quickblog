import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './configs/db.js';
import adminRouter from './routes/adminRoutes.js';
import blogRouter from './routes/blogRoutes.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import commentRouter from './routes/commentRoutes.js';

const app = express();

await connectDB();

// ✅ CORS Configuration
const allowedOrigins = [
    'http://localhost:5173',
    'https://gemai-client.vercel.app',
    process.env.CLIENT_URL
].filter(Boolean);

const corsOptions = {
    origin: function(origin, callback) {
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin) || origin.includes('.vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
    preflightContinue: false,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get('/', (req, res) => res.send("API is Working"));
app.use('/api/admin', adminRouter);
app.use('/api/blog', blogRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/comment', commentRouter);

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ 
        success: false, 
        message: err.message || 'Internal Server Error' 
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`✅ Allowed origins:`, allowedOrigins);
});

export default app;