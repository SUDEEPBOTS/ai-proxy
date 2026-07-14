# AI Proxy Server 🚀

A high-performance, reverse-proxy API server built with Node.js and Express. It acts as an intermediary (API Gateway) between your users and an upstream OpenAI-compatible API provider (like OpenCode.ai). 

This allows you to:
- Issue **your own** API keys to your users.
- Hide your real upstream API key.
- Provide a completely transparent, seamless experience (Streaming SSE and OpenAI formats work perfectly 1:1).

## Features ✨
- **Transparent Proxying**: Forwards standard OpenAI requests (e.g. `/v1/chat/completions`) perfectly without breaking SSE (Server-Sent Events) streams.
- **Custom Authentication**: Require users to pass an API key that YOU provide.
- **Easy Deployment**: Ready to be deployed on Railway, Render, or any Node.js host.

## Available Models (Example)
- `big-pickle`
- `deepseek-v4-flash-free`
- `mimo-v2.5-free`
- `qwen3.6-plus-free`
- `minimax-m3-free`
- `nemotron-3-ultra-free`
- `north-mini-code-free`

## 🚄 Quick Deploy on Railway
1. Create a new Railway project and link this GitHub repo.
2. Go to **Variables** and add:
   - `UPSTREAM_URL`: `https://opencode.ai/zen/v1`
   - `UPSTREAM_API_KEY`: `your_real_opencode_api_key_here`
   - `ALLOWED_KEYS`: `sk-user1,sk-user2,sk-vip` (The API keys you want to issue to your friends/users. If you leave this blank, the API will be public!).
3. Deploy!

## 💻 Local Testing
1. Clone this repo and run `npm install`
2. Copy `.env.example` to `.env` and fill in your keys.
3. Run `npm start`
4. Send a test request:
```bash
curl -X POST http://localhost:3000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-user1" \
  -d '{
    "model": "big-pickle",
    "messages": [{"role": "user", "content": "Hello!"}],
    "stream": true
  }'
```
