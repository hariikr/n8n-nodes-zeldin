# Zeldin Architecture: Supabase + n8n + Flutter

This document explains exactly how the Zeldin system works, how Supabase connects to n8n, and what your senior needs to create in the backend.

---

## 🏗️ 1. High-Level Architecture

The system follows a 3-way synchronization loop:

1.  **Flutter App**: The User Interface. It creates/updates records in Supabase.
2.  **Supabase**: The Source of Truth. It stores all Zeldin data and sends "alerts" to n8n.
3.  **n8n**: The Automation Brain. It performs complex tasks (like sending emails or syncing to other CRM tools).

```mermaid
graph LR
    Flutter[Flutter App] -- CRUD -- UI --> Supabase
    Supabase -- Database Webhook --> n8n[n8n Zeldin Trigger]
    n8n -- API Request --> Supabase[n8n Zeldin Action]
```

---

## 🗄️ 2. Supabase Setup (What to Create)

To make the n8n nodes work, your senior needs to set up the following in Supabase:

### A. The Database Table (`properties`)
Create a table that stores your entities. For the **Property** example:
*   **Table Name**: `properties`
*   **Columns**:
    *   `id`: UUID (Primary Key)
    *   `title`: Text (e.g., "Luxury Villa")
    *   `price`: Numeric
    *   `status`: Text (e.g., "available", "sold")
    *   `created_at`: Timestamp

### B. Security (API Keys)
n8n needs permission to talk to Supabase. 
*   **Method**: Use the **`service_role`** key from the Supabase Dashboard (**Project Settings > API**).
*   **Why?**: The `service_role` key bypasses "Row Level Security" (RLS), which is what n8n needs to perform "Admin" tasks.

---

## ⚡ 3. How the n8n Nodes Work

### Node A: Zeldin Action (n8n → Supabase)
**Goal**: You want n8n to create or update something in Supabase automatically.

*   **Example**: "When a Lead comes from Facebook, create a **Property Inquiry** in Supabase."
*   **How it works**: n8n sends a `POST` or `PATCH` request to:
    `https://[id].supabase.co/rest/v1/properties`

### Node B: Zeldin Trigger (Supabase → n8n)
**Goal**: When a property is sold in the app, n8n should send a Slack message.

*   **How it works (Supabase Webhooks)**:
    1.  Go to **Supabase Dashboard > Database > Webhooks**.
    2.  Click **"Enable Webhooks"**.
    3.  Create a new Webhook:
        *   **Name**: `notify_n8n_property_change`
        *   **Events**: `INSERT`, `UPDATE`, `DELETE`
        *   **URL**: Paste your **n8n Webhook URL** here.
        *   **HTTP Method**: `POST`

---

## 📖 4. Step-by-Step Example: "The Property Flow"

Let's say a user adds a new villa in your **Flutter App**.

1.  **Flutter**: The app calls `supabase.from('properties').insert({...})`.
2.  **Supabase**: Saves the row. Immediately after, the "Database Webhook" sees the insert.
3.  **The Trigger**: Supabase sends a JSON "webhook" to your **n8n Zeldin Trigger**.
    *   **Payload sent to n8n**:
        ```json
        {
          "type": "INSERT",
          "table": "properties",
          "record": { "id": "123", "title": "Sea View Villa", "price": 500000 }
        }
        ```
4.  **n8n Workflow**: Your Zeldin node receives this data. You can then connect a "Slack" node to notify the Sales team: *"🏠 New Property Added: Sea View Villa ($500,000)!"*

---

## 👨‍💻 5. SQL Cookbook



### The Trigger Function
This uses Supabase's internal `net` extension to send the data as an `AFTER INSERT` event without slowing down the database.

```sql
-- 1. Create the function that talks to n8n
CREATE OR REPLACE FUNCTION notify_n8n_on_property()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM
    net.http_post(
      url:='https://your-n8n-url.com/webhook/zeldin',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer your_secret"}'::jsonb,
      body:=json_build_object(
        'event', 'entity.created',
        'entity', 'property',
        'record', row_to_json(NEW)
      )::jsonb
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Create the AFTER INSERT trigger
CREATE TRIGGER zeldin_property_inserted
AFTER INSERT ON properties
FOR EACH ROW
EXECUTE FUNCTION notify_n8n_on_property();
```


## 💡 Pro Tip: Custom API via Edge Functions
If the logic is too complex for a direct database table, your senior can create **Supabase Edge Functions**. 
*   n8n can call these functions using the same Zeldin Action node. 
*   **Path**: `https://[id].supabase.co/functions/v1/zeldin-api`
