---
description: How to manage the Fintech Partner Hub ecosystem
---

# Managing the Fintech Partner Hub

This guide details the standard operating procedures for managing financial partners, API configurations, and technical oversight.

## 1. Onboarding a New Partner
To register a new financial institution or fintech provider:
1. Navigate to the **Provider Registry** tab.
2. Click the **Onboard Provider** button in the top-right header.
3. Enter the Partner Name, Select the Provider Type (Bank, Insurance, or Digital Wallet).
4. Provide the **Production API Gateway** URL.
5. Click **Register Partner**. 
   > [!NOTE]
   > This creates a secure configuration entry in the database.

## 2. Managing API Technical Settings
For existing partners, you must configure their production credentials and callbacks:
1. Locate the partner in the Registry table.
2. Click **Manage API**.
3. Update the following fields:
   - **Production Gateway URL**: The base URL for API requests.
   - **Integration ID**: Your unique partner-assigned ID.
   - **Integration Key**: Your secure production secret.
   - **Callback Webhook**: The URL where DashDrive receives status updates (e.g., payment success).
4. Click **Save Changes**. These settings take effect immediately for all live transactions.

## 3. Technical Oversight (Deep Dive)
To inspect a partner's performance and live technical health:
1. Click **View API** on any partner row.
2. **Performance Stats**: Review conversion rates, default rates, and active marketplace products.
3. **Resilience Metrics**: Monitor P95 latency and real-time success rates.
4. **Live Payload Monitor**: Observe active handshakes and JSON payloads sent between DashDrive and the partner.

## 4. Real-time Monitoring & Labs
- **Monitoring Tab**: Use the **Real-time Monitoring** tab to observe incoming webhooks and their response codes in real-time.
- **Product Labs Tab**: Use the **Product Labs** tab to review pending product submissions from partners before they go live on the Marketplace.

## 5. Emergency Procedures
- **Reversal Handling**: Use the "Lookup Wallet" search to find specific transactions and initiate a **Manual Reversal** via the **Wallet & Settlements** tab if a reconciliation error occurs.
- **Maintenance Mode**: If a partner's API becomes unstable, use the **Manage API** modal to update their status (logic handled via backend `isActive` flag).
