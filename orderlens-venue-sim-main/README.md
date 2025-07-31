# 🟢 OrderLens – Real-Time Orderbook Viewer with Venue Simulation

A powerful, real-time trading simulator built using **React**, **TypeScript**, and **Tailwind CSS**. It simulates a real-world orderbook, allowing users to view buy/sell activity across multiple venues and test how their orders would impact the market.

---

## 🚀 Features

- ✅ **Live Orderbook Simulation** – Real-time updates of market depth with buy/sell orders
- 🧪 **Order Simulation Form** – Simulate custom orders and preview impact
- 📊 **Order Impact Analysis** – Visualize your simulated order's position and fill probability
- 🌐 **Venue Selector** – Switch between different trading venues
- 📉 **Depth Visualization** – Color-coded depth bars for clarity (green = buy, red = sell)
- 🔌 **Mock WebSocket Feed** – Generates realistic order updates every 1.5s
- 🎨 **Professional UI** – TradingView-inspired design with dark mode theme

---

## 🛠️ Tech Stack

| Technology     | Purpose                         |
|----------------|----------------------------------|
| React + Vite   | Frontend UI & App Architecture   |
| TypeScript     | Type Safety & Interfaces         |
| Tailwind CSS   | Modern and Fast Styling          |
| Zustand        | Lightweight State Management     |
| Recharts       | Dynamic Charting & Visualization |

---

## 📂 Folder Structure

```bash
src/
├── assets/                # Icons, images, logos
├── components/            # Reusable UI Components
├── hooks/                 # Custom Hooks (e.g., useWebSocket)
├── stores/                # Zustand state management
├── types/                 # TypeScript interfaces
├── App.tsx
├── main.tsx
