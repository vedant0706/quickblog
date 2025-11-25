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

// ✅ cookieParser MUST come first
app.use(cookieParser());

// ✅ CORS Configuration - Now allows same-origin requests from proxy
const allowedOrigins = [
    'http://localhost:5173',
    'https://gem-ai-bay.vercel.app',
    process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
    origin: function(origin, callback) {
        // ✅ Allow requests with no origin (proxied requests, Postman, etc.)
        if (!origin) {
            console.log('✅ Allowing request with no origin (likely proxied)');
            return callback(null, true);
        }
        
        // Check if origin is in allowed list
        if (allowedOrigins.includes(origin)) {
            console.log('✅ Allowing origin:', origin);
            callback(null, true);
        } else {
            console.log('❌ Blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // ✅ CRITICAL for cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Add request logging middleware for debugging
app.use((req, res, next) => {
    console.log('📍', req.method, req.path);
    console.log('🌐 Origin:', req.headers.origin || 'no origin');
    console.log('🍪 Cookies:', req.cookies);
    next();
});

// Routes
app.get('/', (req, res) => res.send("API is Working"));
app.use('/api/admin', adminRouter);
app.use('/api/blog', blogRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/comment', commentRouter);

// ✅ 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.path} not found`
    });
});

// ✅ Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err.message);
    console.error('Stack:', err.stack);
    res.status(500).json({ 
        success: false, 
        message: err.message || 'Internal Server Error' 
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`✅ NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`✅ Allowed origins:`, allowedOrigins);
    console.log(`✅ Client URL: ${process.env.CLIENT_URL}`);
});

export default app;