import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login"; // Adjust the import path based on your folder structure

function App() {
    return ( 
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/admin-dashboard" />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;