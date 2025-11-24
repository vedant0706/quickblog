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

// ✅ CRITICAL: cookieParser MUST come before CORS
app.use(cookieParser());

// ✅ CORS Configuration - MUST allow credentials
const allowedOrigins = [
    'http://localhost:5173',
    // 'https://gemai-client.vercel.app'
];

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (mobile apps, Postman)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // ✅ CRITICAL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => res.send("API is Working"));
app.use('/api/admin', adminRouter);
app.use('/api/blog', blogRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/comment', commentRouter);

// Error handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ 
        success: false, 
        message: err.message 
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`✅ Allowed origins:`, allowedOrigins);
    console.log(`✅ Environment:`, process.env.NODE_ENV);
});

export default app;