require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Upstream API Details (Hardcoded Base URL)
const UPSTREAM_URL = 'https://opencode.ai/zen/v1';
const UPSTREAM_API_KEY = process.env.UPSTREAM_API_KEY || 'your_secret_upstream_key';

// Allowed API keys that you issue to your users (comma-separated in .env)
// If left empty in .env, it will allow anyone (public API). 
const ALLOWED_KEYS_STRING = process.env.ALLOWED_KEYS || '';
const ALLOWED_KEYS = ALLOWED_KEYS_STRING.split(',').map(k => k.trim()).filter(Boolean);

app.use(cors());

// 1. Authentication Middleware
app.use('/v1', (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    // Check if header exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: {
                message: "You didn't provide an API key. You need to provide your API key in an Authorization header using Bearer auth (i.e. Authorization: Bearer YOUR_KEY).",
                type: "invalid_request_error",
                param: null,
                code: null
            }
        });
    }

    const providedKey = authHeader.split(' ')[1];

    // Verify key if we have keys configured
    if (ALLOWED_KEYS.length > 0 && !ALLOWED_KEYS.includes(providedKey)) {
        return res.status(401).json({
            error: {
                message: "Incorrect API key provided.",
                type: "invalid_request_error",
                param: null,
                code: "invalid_api_key"
            }
        });
    }

    next();
});

// 2. Proxy Middleware
const apiProxy = createProxyMiddleware({
    target: UPSTREAM_URL,
    changeOrigin: true,
    // Strip /v1 from the incoming request so it appends correctly to UPSTREAM_URL
    pathRewrite: {
        '^/v1': '', 
    },
    on: {
        proxyReq: (proxyReq, req, res) => {
            // Remove the user's API key completely (case-insensitive in Node headers)
            proxyReq.removeHeader('authorization');
            proxyReq.removeHeader('Authorization');
            
            // Inject your real upstream API key secretly
            proxyReq.setHeader('Authorization', `Bearer ${UPSTREAM_API_KEY}`);
        },
        error: (err, req, res) => {
            console.error("Proxy Error:", err);
            if (!res.headersSent) {
                res.status(502).json({
                    error: {
                        message: "Bad gateway: Unable to reach the upstream AI provider.",
                        type: "api_error"
                    }
                });
            }
        }
    }
});

// Apply proxy to all /v1 requests
app.use('/v1', apiProxy);

// Basic health check route
app.get('/', (req, res) => {
    res.json({ 
        status: "active",
        message: "AI Proxy Server is running.",
        base_url: "/v1",
        models: [
            "big-pickle",
            "deepseek-v4-flash-free",
            "mimo-v2.5-free",
            "qwen3.6-plus-free",
            "minimax-m3-free",
            "nemotron-3-ultra-free",
            "north-mini-code-free"
        ]
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ AI Proxy running on port ${PORT}`);
    console.log(`🔗 Forwarding traffic to: ${UPSTREAM_URL}`);
    console.log(`🔑 Protected by API Keys: ${ALLOWED_KEYS.length > 0 ? 'Yes' : 'No (Public)'}`);
});
