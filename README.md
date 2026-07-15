<h1 align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=timeGradient&height=250&section=header&text=AI%20Proxy%20Node&fontSize=80&animation=fadeIn&fontAlignY=35&desc=Stateless,%20Secure,%20and%20Blazing%20Fast%20AI%20Proxy&descAlignY=55&descAlign=50" />
</h1>

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=26&pause=1000&color=00FFFB&center=true&vCenter=true&width=600&lines=Welcome+to+AI+Proxy+Node;A+Stateless+Express.js+Proxy;Zero+Database+Overhead;Absolute+IP+Privacy;Deploy+Now+on+Render+or+Heroku" alt="Typing SVG" />
</p>

<p align="center">
  <a href="https://github.com/SUDEEPBOTS/ai-proxy/stargazers"><img src="https://img.shields.io/github/stars/SUDEEPBOTS/ai-proxy?color=blue&logo=github&logoColor=white&style=for-the-badge" alt="Stars" /></a>
  <a href="https://github.com/SUDEEPBOTS/ai-proxy/network/members"> <img src="https://img.shields.io/github/forks/SUDEEPBOTS/ai-proxy?color=blue&logo=github&logoColor=white&style=for-the-badge" /></a>
  <a href="https://github.com/SUDEEPBOTS/ai-proxy/issues"> <img src="https://img.shields.io/github/issues/SUDEEPBOTS/ai-proxy?color=blue&logo=github&logoColor=white&style=for-the-badge" /></a>
</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">
</p>

<h2 align="center"> ⚡️ ᴀᴡᴇsᴏᴍᴇ ғᴇᴀᴛᴜʀᴇs ⚡️ </h2>

> 🎸 **AI Proxy Node** is a highly optimized reverse proxy for AI APIs (like OpenCode or OpenAI). It ensures complete anonymity by stripping client IPs and handling dynamic key substitution in memory.

- **🔥 100% Sᴛᴀᴛᴇʟᴇss:** No databases, no caching. Everything exists only in memory during the request.
- **🛡️ Iᴘ Pʀɪᴠᴀᴄʏ:** Completely strips `x-forwarded-for` and `x-real-ip` headers. Upstream providers will NEVER see your users' IPs.
- **✨ Sᴍᴀʀᴛ Kᴇʏ Iɴᴊᴇᴄᴛɪᴏɴ:** Validates user API keys at the edge, and silently replaces them with your master `UPSTREAM_API_KEY`.
- **🚀 Oᴘᴛɪᴍɪᴢᴇᴅ:** Built on Express.js and `http-proxy-middleware` for instant streaming capabilities.

<p align="center">
  <img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">
</p>

<h2 align="center"> 🚀 ᴏɴᴇ-ᴄʟɪᴄᴋ ᴅᴇᴘʟᴏʏᴍᴇɴᴛ 🚀 </h2>

<h3 align="center">☁️ ᴅᴇᴘʟᴏʏ ᴏɴ ᴄʟᴏᴜᴅ ☁️</h3>

<p align="center">
<a href="https://dashboard.heroku.com/new?template=https://github.com/SUDEEPBOTS/ai-proxy">
  <img src="https://img.shields.io/badge/Deploy%20On%20Heroku-008000?style=for-the-badge&logo=heroku" width="200" height="45"/>
</a>
<a href="https://render.com/deploy?repo=https://github.com/SUDEEPBOTS/ai-proxy">
  <img src="https://img.shields.io/badge/Deploy%20to%20Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" width="200" height="45"/>
</a>
<br>
<a href="https://railway.app/template?gh_repo=SUDEEPBOTS/ai-proxy">
  <img src="https://img.shields.io/badge/Deploy%20on%20Railway-131415?style=for-the-badge&logo=railway&logoColor=white" width="200" height="45"/>
</a>
</p>

<details>
<summary><h3 align="left">💻 ᴅᴇᴘʟᴏʏ ᴏɴ ᴠᴘs / ʟᴏᴄᴀʟ</h3></summary>
<br>

**1. Clone the Repository:**
```bash
git clone https://github.com/SUDEEPBOTS/ai-proxy.git
cd ai-proxy
```

**2. Install Dependencies:**
```bash
npm install
```

**3. Configure Environment Variables (`.env`):**
```env
UPSTREAM_API_KEY=your_secret_upstream_key
ALLOWED_KEYS=sk-sudeep,sk-test
```

**4. Start the Server:**
```bash
npm start
```
</details>

<p align="center">
  <img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">
</p>

<h2 align="center"> 📞 ᴀᴘɪ ᴜsᴀɢᴇ 📞 </h2>

Once deployed, you can use your proxy exactly like the official OpenAI API:

```bash
curl -X POST https://your-app.up.railway.app/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-sudeep" \
  -d '{
    "model": "deepseek-v4-flash-free",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=20&pause=1000&color=F700FF&center=true&vCenter=true&width=435&lines=Made+with+❤️+by+SUDEEPBOTS" alt="Made by" />
</p>
