# Zeldin n8n Integration Nodes

This package provides custom n8n nodes for integrating with the **Zeldin API**. It allows you to automate workflows between Zeldin and hundreds of other apps like Slack, Zoho CRM, Facebook Lead Ads, and more.

---

## 🚀 Features

### 1. Zeldin Action Node
Perform operations on Zeldin entities directly from your workflows.
*   **Create**: Add new properties, inquiries, contacts, or deals.
*   **Get**: Fetch details of a specific entity by its ID.
*   **Update**: Modify existing entity data.
*   **Delete**: Remove entities from the Zeldin database.

### 2. Zeldin Trigger Node (Webhook based)
Start workflows automatically when events happen in Zeldin.
*   **Events**: Triggers on `entity.created`, `entity.updated`, and `entity.deleted`.
*   **Automatic Registration**: The node automatically registers your webhook URL with the Zeldin API when you activate the workflow and cleans it up when deactivated.
*   **Filtering**: Choose to trigger for specific entities (e.g., only for "Property") or for any entity.

---

## 🛠️ Prerequisites

*   **Node.js**: v18 or higher (v22 recommended).
*   **n8n**: Installed globally (`npm install -g n8n`).
*   **Zeldin API Key**: Required for authentication.

---

## 📂 Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-repo/n8n-nodes-zeldin.git
    cd n8n-nodes-zeldin
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

---

## 🔨 Development Workflow

### 1. Build the Node
Compile the TypeScript code and copy assets (like the logo) to the `dist/` folder:
```bash
npm run build
```

### 2. Run n8n with the Custom Node
To test the node locally without publishing it to npm, use the `N8N_CUSTOM_EXTENSIONS` environment variable:

**PowerShell (Windows):**
```powershell
$env:N8N_CUSTOM_EXTENSIONS="$(Get-Location)\dist"; n8n start
```

**Bash (Linux/Mac/Git Bash):**
```bash
export N8N_CUSTOM_EXTENSIONS="$PWD/dist"
n8n start
```

### 3. Watch Mode (Auto-rebuild)
Automatically recompile whenever you save a file:
```bash
npm run dev
```

---

## 🎨 Adding Your Logo

1.  Place your logo file as **`zeldin.svg`** in the `nodes/` directory.
2.  Run `npm run build`.
3.  The build script will automatically copy it to `dist/nodes/zeldin.svg` so n8n can load it.

---

## 🔌 Using the Trigger (Webhooks)

### How to Activate
1.  Drag the **Zeldin Trigger** node into an n8n workflow.
2.  Select your **Zeldin API Credentials**.
3.  Choose the **Event** (e.g., Entity Created) and **Entity Type** (e.g., Property).
4.  **Listen for Test Event**: Click the button in n8n.
5.  **Go Live**: Flip the "Active" switch at the top right of n8n. The node will automatically register the webhook with the Zeldin API!

---

## 🗄️ Project Structure

```text
n8n-nodes-zeldin
├── nodes
│   ├── Zeldin.node.ts        # Action Node logic
│   ├── ZeldinTrigger.node.ts # Trigger Node logic
│   └── zeldin.svg            # Custom icon
├── credentials
│   └── ZeldinApi.credentials.ts # API Key configuration
├── dist/                     # Compiled files (generated)
├── package.json              # Build scripts & n8n metadata
└── tsconfig.json             # TypeScript config
```

---

## 🤝 Contribution

Feel free to open issues or pull requests to improve the integration.
