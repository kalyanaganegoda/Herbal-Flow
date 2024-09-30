import { useState } from "react";
import {
  BrowserRouter,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import "./App.css";

import { AddInventory } from "./Pages/AddInventory";
import HomePage from "./Pages/HomePage";
import InventoryDashboard from "./Pages/InventoryDashboard";
import Test from "./Components/Test";
import Login from "./Pages/Login";

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/add" element={<AddInventory />}></Route>
        <Route path="/test" element={<Test />}></Route>
        <Route path="/dash" element={<InventoryDashboard />}></Route>
        <Route path="/login" element={<Login />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
