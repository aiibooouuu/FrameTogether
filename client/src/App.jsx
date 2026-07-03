import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import CreateRoom from "./pages/CreateRoom/CreateRoom";
import JoinRoom from "./pages/JoinRoom/JoinRoom";
import Booth from "./pages/Booth/Booth";
import "./App.css";
import { Toaster } from "sonner";

function App() {
  return (
  <>
    <Toaster
        position="top-right"
        richColors
        expand
    />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create-room" element={<CreateRoom />} />
      <Route path="/join-room" element={<JoinRoom />} />
      <Route path="/booth" element={<Booth />} />
    </Routes>
  </>
  );
  
}

export default App;