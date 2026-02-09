# AI Project Builder

A production-ready AI-driven project generator built with **Next.js 16** and **Google Gemini AI**. This application helps users formulate scientific hypotheses, design experiments, and analyze data for the [Aladdin Platform](https://institute-for-future-intelligence.github.io/aladdin/).

> **Note**: This is a production-optimized environment. Development tools and hot-reloading have been removed for stability and performance.

## 📋 Prerequisites

Before installing the project, ensure you have **Node.js** (v18.17.0 or later) and **npm** installed on your system.

### Step 1: Install Node.js & npm

Choose your operating system below for detailed installation instructions.

#### 🪟 Windows

**Option A: Official Installer (Recommended)**
1. Visit the [Node.js Download Page](https://nodejs.org/).
2. Download the **LTS (Long Term Support)** version `.msi` installer.
3. Run the installer and follow the on-screen prompts. Ensure "Add to PATH" is selected.
4. Restart your computer or terminal.

**Option B: Using Winget**
Open PowerShell as Administrator and run:
```powershell
winget install OpenJS.NodeJS.LTS
```

**Verification:**
Open PowerShell or Command Prompt and run:
```powershell
node -v
npm -v
```
*You should see versions output (e.g., `v20.x.x` and `10.x.x`).*

---

#### 🍎 macOS

**Option A: Using Homebrew (Recommended)**
1. Open Terminal.
2. If you don't have Homebrew, install it from [brew.sh](https://brew.sh/).
3. Run the following command:
```bash
brew install node
```

**Option B: Official Installer**
1. Visit the [Node.js Download Page](https://nodejs.org/).
2. Download the **macOS Installer** (`.pkg`).
3. Run the installer and follow the instructions.

**Verification:**
Open Terminal and run:
```bash
node -v
npm -v
```

---

#### 🐧 Linux (Ubuntu/Debian)

**Option A: Using NodeSource (Recommended for latest LTS)**
1. Update your packages:
```bash
sudo apt update
sudo apt install -y curl
```
2. Setup the repository (for Node.js 20.x):
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
```
3. Install Node.js:
```bash
sudo apt install -y nodejs
```

**Verification:**
Open Terminal and run:
```bash
node -v
npm -v
```

---

## 🛠️ Installation & Setup

### 1. Clone or Download the Repository
Navigate to the project directory in your terminal:
```bash
cd ai-project-builder
```

### 2. Install Dependencies
Run the following command to install all production dependencies:
```bash
npm install
```
*This may take a minute. Ensure you have a stable internet connection.*

### 3. Configure API Keys (Critical Step)

This application requires a **Google Gemini API Key** to function.

**A. Obtain your API Key:**
1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Sign in with your Google account.
3. Click on **"Get API key"** and create a new key.

**B. Securely Store the Key:**
1. In the root directory of the project, create a new file named `.env.local`.
   - **Windows (PowerShell):** `New-Item .env.local -ItemType File`
   - **macOS/Linux:** `touch .env.local`
2. Open `.env.local` in a text editor (Notepad, VS Code, Nano).
3. Add the following line, replacing `YOUR_KEY_HERE` with your actual API key:

```env
GEMINI_API_KEY=AIzaSy...YourActualKeyHere
```

> **Security Warning**: NEVER commit your `.env.local` file to version control (Git). It contains sensitive credentials.

---

## 🔐 Supabase Setup (Auth + Chat History)

This project supports Supabase Authentication and can persist chat history to your Supabase database.

### 1. Create a Supabase Project
1. Create a new project in Supabase.
2. Go to **Project Settings → API** and copy:
   - Project URL
   - anon public key

### 2. Add Environment Variables
Add these to your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Create the Chat History Table + RLS Policies
Open Supabase **SQL Editor** and run the SQL in:
- `supabase_chat_schema.sql`

### 4. Configure Auth Redirects (Important)
In Supabase: **Authentication → URL Configuration**

Add the correct Redirect URLs:
- Local development:
  - `http://localhost:3000/auth/callback`
- Production:
  - `https://your-domain.com/auth/callback`

Set **Site URL** to:
- Local development: `http://localhost:3000`
- Production: `https://your-domain.com`

If you enable email confirmations, production must be HTTPS for reliable redirects/cookies.

---

## 🚀 Running the Application

Since this is a production environment, you must build the application before running it.

### 1. Build the Project
Compiles the application for production usage:
```bash
npm run build
```
*You should see output indicating "Compiled successfully" and "Generating static pages".*

### 2. Start the Server
Launches the production server:
```bash
npm run start
```

### 3. Access the App
Open your web browser and navigate to:
**[http://localhost:3000](http://localhost:3000)**

---

## 🌐 Deploying (Make It Available as a Website with SSL)

Email confirmation redirects and Supabase auth cookies are meant to run on HTTPS in production.

### Option A: Vercel (Recommended)
1. Push the repo to GitHub.
2. Import the project into Vercel.
3. Add environment variables in Vercel:
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (set to your deployed URL, e.g. `https://your-domain.com`)
4. Deploy. Vercel provides HTTPS automatically.
5. Update Supabase **Site URL** + **Redirect URLs** to match your Vercel domain.

### Option B: Netlify
1. Deploy the Next.js app (App Router supported).
2. Add the same environment variables in Netlify.
3. Ensure the site is served on HTTPS, then update Supabase URLs accordingly.

### Option C: Self-Host (VPS) with Automatic HTTPS
Use a reverse proxy that can issue Let’s Encrypt certificates automatically (recommended):
- Caddy
- Nginx + certbot

Point your domain to the server, enable HTTPS, then set:
- `NEXT_PUBLIC_SITE_URL=https://your-domain.com`
- Supabase **Site URL** + **Redirect URLs** to the same domain.

### Temporary HTTPS for Testing
If you want email confirmations to work before deploying:
- Use a tunnel such as Cloudflare Tunnel or ngrok to get a temporary HTTPS URL.
- Set `NEXT_PUBLIC_SITE_URL` to that HTTPS URL.
- Add the HTTPS callback URL to Supabase Redirect URLs.

## ❓ Troubleshooting

### Common Issues

**1. `command not found: npm` or `node`**
- **Cause**: Node.js is not installed or not in your system PATH.
- **Fix**: Reinstall Node.js using the instructions in "Step 1" and restart your terminal.

**2. API Errors / Chat not responding**
- **Cause**: Missing or incorrect API key.
- **Fix**: Check your `.env.local` file. Ensure the variable name is exactly `GEMINI_API_KEY` and there are no extra spaces or quotes around the key. Restart the server (`Ctrl+C` then `npm run start`) after changing the `.env.local` file.

**3. Port 3000 is in use**
- **Cause**: Another application is running on port 3000.
- **Fix**:
  - **Windows**: `netstat -ano | findstr :3000` to find the PID, then `taskkill /PID <PID> /F`.
  - **macOS/Linux**: `lsof -i :3000` then `kill -9 <PID>`.
  - **Alternative**: Run on a different port: `npm run start -- -p 4000`.

**4. `npm run dev` fails**
- **Cause**: Development scripts have been removed.
- **Fix**: Use `npm run build` followed by `npm run start`.

## ✅ System Verification

To confirm everything is working correctly:
1. Start the app (`npm run start`).
2. Go to `http://localhost:3000`.
3. In the chat interface, type "Hello".
4. If you receive a response from the AI, your **Node.js environment**, **Dependencies**, and **API Key** are all configured correctly.
