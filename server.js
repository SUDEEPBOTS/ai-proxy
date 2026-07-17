require('dotenv').config();
const express = require('express');
const { createProxyMiddleware, fixRequestBody } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Upstream API Details (Hardcoded Base URL)
const UPSTREAM_URL = 'https://opencode.ai/zen/v1';
const UPSTREAM_API_KEY = process.env.UPSTREAM_API_KEY || 'your_secret_upstream_key';

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || 'your_cloudflare_account_id';
const CLOUDFLARE_API_KEY = process.env.CLOUDFLARE_API_KEY || 'your_cloudflare_api_key';
const CLOUDFLARE_URL = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/v1`;

// Allowed API keys that you issue to your users (comma-separated in .env)
// Hardcoded as requested by the user
const ALLOWED_KEYS_STRING = process.env.ALLOWED_KEYS || 'sk-sudeep';
const ALLOWED_KEYS = ALLOWED_KEYS_STRING.split(',').map(k => k.trim()).filter(Boolean);

// Helper to safely log keys
const maskKey = (key) => {
    if (!key) return "NOT_SET";
    if (key === 'your_secret_upstream_key') return "DEFAULT_PLACEHOLDER_KEY";
    if (key.length <= 8) return "***";
    return key.substring(0, 4) + "..." + key.substring(key.length - 4);
};

app.use(cors());

// Parse JSON body for /v1 requests so we can inspect the model
app.use('/v1', express.json());

// 1. Authentication Middleware
app.use('/v1', (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    console.log(`\n[DEBUG] Incoming request to ${req.path}`);
    
    // Check if header exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log(`[DEBUG] Blocked: No API Key provided in header.`);
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
    console.log(`[DEBUG] Provided Key: ${maskKey(providedKey)}`);

    // Verify key if we have keys configured
    if (ALLOWED_KEYS.length > 0 && !ALLOWED_KEYS.includes(providedKey)) {
        console.log(`[DEBUG] Blocked: Key not in ALLOWED_KEYS list. (Allowed: ${ALLOWED_KEYS.map(maskKey).join(', ')})`);
        return res.status(401).json({
            error: {
                message: "Incorrect API key provided.",
                type: "invalid_request_error",
                param: null,
                code: "invalid_api_key"
            }
        });
    }

    console.log(`[DEBUG] Access Granted! Forwarding to Upstream...`);
    next();
});

// 2. Proxy Middleware
const apiProxy = createProxyMiddleware({
    target: UPSTREAM_URL,
    changeOrigin: true,
    router: (req) => {
        if (req.body && req.body.model) {
            const model = req.body.model.toLowerCase();
            if (model.includes('glm') || model.includes('kimi')) {
                return CLOUDFLARE_URL;
            }
        }
        return UPSTREAM_URL;
    },
    // Strip /v1 from the incoming request so it appends correctly to UPSTREAM_URL
    pathRewrite: {
        '^/v1': '', 
    },
    on: {
        proxyReq: (proxyReq, req, res) => {
            // Remove the user's API key completely (case-insensitive in Node headers)
            proxyReq.removeHeader('authorization');
            proxyReq.removeHeader('Authorization');
            
            // Remove IP tracking headers so OpenCode NEVER sees the Client IP
            proxyReq.removeHeader('x-forwarded-for');
            proxyReq.removeHeader('x-real-ip');
            proxyReq.removeHeader('forwarded');
            proxyReq.removeHeader('x-forwarded-host');
            proxyReq.removeHeader('x-forwarded-proto');
            
            const isCloudflare = req.body && req.body.model && 
                                 (req.body.model.toLowerCase().includes('glm') || req.body.model.toLowerCase().includes('kimi'));
            
            if (isCloudflare) {
                // Inject Cloudflare API key secretly
                proxyReq.setHeader('Authorization', `Bearer ${CLOUDFLARE_API_KEY}`);
                console.log(`[DEBUG] Routing to Cloudflare: ${req.body.model}`);
                console.log(`[DEBUG] ProxyReq Headers Sent -> Authorization: Bearer ${maskKey(CLOUDFLARE_API_KEY)}`);
            } else {
                // Inject OpenCode API key secretly
                proxyReq.setHeader('Authorization', `Bearer ${UPSTREAM_API_KEY}`);
                console.log(`[DEBUG] Routing to OpenCode: ${req.body?.model || 'unknown'}`);
                console.log(`[DEBUG] ProxyReq Headers Sent -> Authorization: Bearer ${maskKey(UPSTREAM_API_KEY)}`);
            }

            // Fix request body stream since it was consumed by express.json()
            if (req.body) {
                fixRequestBody(proxyReq, req);
            }
        },
        error: (err, req, res) => {
            console.error("[DEBUG] Proxy Error:", err);
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

// Server IP checking endpoint
app.get('/ip', async (req, res) => {
    try {
        // Fetch server's public IP using global fetch (available in Node 18+)
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        
        res.json({
            message: "IP Info",
            server_public_ip: data.ip,
            client_ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
        });
    } catch (error) {
        res.status(500).json({ error: "Could not fetch server IP", details: error.message });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ AI Proxy running on port ${PORT}`);
    console.log(`🔗 Forwarding traffic to: ${UPSTREAM_URL}`);
    console.log(`🔑 Protected by API Keys: ${ALLOWED_KEYS.length > 0 ? 'Yes' : 'No (Public)'}`);
});
