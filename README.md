

# MyNote – A Modern, Lightweight Note‑Taking App

MyNote is a professional note‑taking application built with **React**, **TypeScript**, and **Tailwind CSS**. It offers a rich editing experience with support for text, images, slides, diagrams, tables, and spreadsheets – all with auto‑save, tagging, search, and a clean Material Design interface.

## ✨ Features

- **Multiple Note Types** – Text, images, slides, mind maps (diagrams), tables, and spreadsheet‑style sheets.
- **Auto‑Save** – Changes are saved automatically while you type.
- **Tagging & Search** – Organize notes with custom tags and instantly filter by tag or search term.
- **Dark & Dim Modes** – Choose between light, dark, or a comfortable dim theme.
- **Ad Placeholders** – Ready for AdMob integration (banner and interstitial).
- **Offline‑First** – All notes are stored locally in your browser (localStorage).
- **Responsive Design** – Works seamlessly on desktop and mobile devices.

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or later)
- A modern web browser

### Installation

1. Clone the repository or extract the project folder.
2. Open a terminal in the project root and install dependencies:

```
npm install
```

1. (Optional) If you plan to use the Gemini API, create a .env.local file and add your API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
2. Start the development server:
   ```
   npm run dev
   ```
3. Open http://localhost:3000 to view the app.

📁 Project Structure

```
mynote/
├── components/          # Reusable UI components
│   ├── Auth.tsx
│   ├── Dashboard.tsx
│   ├── Editor.tsx
│   ├── DiagramEditor.tsx
│   ├── TableEditor.tsx
│   ├── SheetEditor.tsx
│   └── AdPlaceholders.tsx
├── App.tsx              # Main app logic and state management
├── constants.tsx        # Shared icons and tag colors
├── types.ts             # TypeScript type definitions
├── index.html           # Entry HTML with Tailwind & fonts
├── index.tsx            # React entry point
├── vite.config.ts       # Vite configuration
└── README.md            # This file
```

🛠️ Built With

· React – UI library
· TypeScript – Type safety
· Vite – Fast build tool
· Tailwind CSS – Utility‑first CSS
· react‑zoom‑pan‑pinch – Image and diagram zooming

📱 Deployment

To build the app for production:

```
npm run build
```

The output will be in the dist/ folder, ready to be served by any static file server.

🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request.

📄 License

This project is licensed under the MIT License.


<div align="center">
