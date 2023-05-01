import { Button, ButtonGroup } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import { ChatDashboardPage } from "./pages/AuthenticationPage";
import "./App.css";
function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<ChatDashboardPage />} />

        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;
