import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css"
import { AuthProvider } from "./context/AuthContext.jsx"
import { QuestProvider } from "./context/QuestContext.jsx"
import { Toaster } from "react-hot-toast"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <QuestProvider>
        <App />
        <Toaster position="top-right" />
      </QuestProvider>
    </AuthProvider>
  </React.StrictMode>,
)
