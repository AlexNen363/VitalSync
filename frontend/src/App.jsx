import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Login Page</h1>} />
        <Route path="/admin" element={<h1>Admin Module</h1>} />
        <Route path="/receptionist" element={<h1>Receptionist Module</h1>} />
        <Route path="/doctor" element={<h1>Doctor Module</h1>} />
        <Route path="/labtech" element={<h1>Labtech Module</h1>} />
        <Route path="/pharmacist" element={<h1>Pharmacist Module</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;