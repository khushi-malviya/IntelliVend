# IntelliVend - AI-Powered Multi-Vendor E-Commerce Platform

IntelliVend is a cutting-edge, comprehensive e-commerce marketplace that bridges the gap between buyers and vendors using advanced Artificial Intelligence. Built with React, TypeScript, and Tailwind CSS, it features a complete multi-role ecosystem (Buyer, Vendor, Admin) and integrates Google's Gemini 2.5 Flash model to enhance the shopping and selling experience.

# Short Demo Preview: 

https://github.com/user-attachments/assets/4e22d5bd-bfa6-438f-bff9-571b50651617


## 🚀 Key Features

### 🤖 AI-Powered Capabilities (Google Gemini)
*   **Intelligent Shopping Assistant:** A context-aware chatbot that helps buyers find products, compare prices, and answer catalog-specific questions in real-time.
*   **AI Product Copywriter:** A tool for vendors to automatically generate SEO-friendly, professional product descriptions based on simple keywords and category selection.

### 🛍️ Buyer Experience
*   **Immersive UI:** Features a custom 3D rotating product showcase, glassmorphism effects, and fluid CSS animations.
*   **Advanced Discovery:** Real-time search, category filtering, and sorting (Price, Rating, Featured).
*   **Cart & Checkout:** Fully functional cart drawer with quantity management and a multi-step checkout modal (Shipping -> Payment -> Review).
*   **User Profile:** Order history tracking, wishlist management, and profile settings.

### 🏪 Vendor Dashboard
*   **Analytics Hub:** Visual data visualization using Recharts to track revenue, sales trends, and active inventory.
*   **Product Management:** Full CRUD (Create, Read, Update, Delete) capabilities for inventory.
*   **Storefront:** A dedicated public profile page for vendors showcasing their specific catalog and ratings.

### 🛡️ Admin Portal
*   **Platform Overview:** High-level metrics on total revenue, user distribution, and order volume.
*   **User Management:** Ability to verify vendors and manage user accounts.
*   **Content Moderation:** Tools to monitor and remove listings.

## 🛠️ Tech Stack

*   **Frontend:** React 19, TypeScript
*   **Styling:** Tailwind CSS (with custom animations and keyframes)
*   **AI Integration:** Google GenAI SDK (`@google/genai`)
*   **Icons:** Lucide React
*   **Charts:** Recharts
*   **State/Persistence:** React Hooks & LocalStorage Service (Simulating a database)

## 📦 Project Structure

```
├── components/       # Reusable UI components (Navbar, ProductCard, Charts)
├── services/         # API integrations (Gemini AI, Mock Database)
├── types.ts          # TypeScript interfaces for strict typing
├── constants.ts      # Mock data and configuration
└── App.tsx           # Main application routing and logic
```

## ⚡ Getting Started

1.  **Clone the repository**
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up Environment Variables:**
    Create a `.env` file and add your Google Gemini API Key:
    ```env
    API_KEY=your_google_gemini_api_key
    ```
4.  **Run the development server:**
    ```bash
    npm start
    ```

## 🔮 Future Enhancements

*   Integration with PostgreSQL/Supabase for real backend persistence.
*   Stripe/PayPal payment gateway integration.
*   Real-time notifications using WebSockets.
