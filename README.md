# Zoho Catalyst Web Application

A complete modern web application configured for deployment on **Zoho Catalyst**, featuring user authentication (Login/Logout) and a dynamic Home page dashboard.

---

## 📁 Project Structure

```
Catalyst/
├── catalyst.json                # Main Zoho Catalyst project config
├── README.md                    # Setup and deployment documentation
└── client/                      # Front-end Web Client directory
    ├── client-package.json      # Client entry configuration (homepage: index.html)
    ├── index.html               # Main HTML entry point with Login & Home page views
    ├── css/
    │   └── styles.css           # Modern stylesheet with Zoho Catalyst branding
    └── js/
        └── app.js               # Catalyst Web SDK auth & session controller
```

---

## 🚀 Key Features

1. **Authentication (Login Page)**:
   - Integrates with official **Zoho Catalyst Web SDK** (`catalystWebSDK.js` & `/__catalyst/sdk/init.js`).
   - Supports both Catalyst Hosted/Embedded Login widget and standard login form.
   - Built-in preview/demo login mode for offline/local testing before project linking.

2. **Home Page Dashboard**:
   - Protected view rendered upon successful authentication.
   - Displays user details (`Full Name`, `Email Address`, `User ID`, `Role`, `Session Status`).
   - Platform metrics and Zoho Catalyst services overview.
   - Logout button with session reset.

---

## 🛠️ Local Development & Testing

You can run a quick local web server to test the web client in your browser:

### Using Python:
```bash
python -m http.server 8000 --directory client
```
Then navigate to `http://localhost:8000` in your web browser.

### Using Node.js / npx:
```bash
npx http-server client -p 8000
```

---

## ☁️ How to Launch / Deploy to Zoho Catalyst

Follow these steps to deploy your application live onto Zoho Catalyst:

### Step 1: Install Zoho Catalyst CLI
Ensure Node.js is installed, then run:
```bash
npm install -g zcatalyst-cli
```

Verify installation:
```bash
catalyst --version
```

### Step 2: Login to Zoho Catalyst
Log into your Zoho Catalyst account from your terminal:
```bash
catalyst login
```
This opens your default browser for OAuth authentication.

### Step 3: Link or Initialize Your Catalyst Project
Navigate to your project root folder (`Catalyst/`):
```bash
cd Catalyst
```

Link an existing project from your Catalyst Console:
```bash
catalyst project:use
```
*(Alternatively, initialize a new project using `catalyst init` and select your client folder)*

### Step 4: Deploy the Web Application
Deploy the application components to Zoho Catalyst:
```bash
catalyst deploy
```

To deploy only the web client:
```bash
catalyst deploy --only client
```

Once deployment completes, the CLI will output your live project domain URL (e.g., `https://your-app.catalystserver.com`).

---

## ⚙️ Zoho Catalyst Authentication Configuration

To enable real user logins on your live deployment:
1. Open the [Zoho Catalyst Console](https://catalyst.zoho.com/).
2. Select your Project and navigate to **Authentication** in the sidebar.
3. Enable **Web Client Authentication**.
4. Register users under **Users** tab or invite users via email.
5. In **Domains / Redirect URLs**, ensure your deployed domain (or `http://localhost:8000` for local dev) is added.
