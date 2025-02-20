import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomeTabla from "./pages/HomeTabla"; // Lista de usuarios
import UsuarioEdit from "./components/UsuarioEdit";
import Login from "./components/Login";
import UsuarioForm from "./components/UsuarioForm";
import HomeContrasena from "./pages/HomeContrasena"; // Lista de usuarios




// Función para verificar si el usuario está autenticado
const isAuthenticated = () => {
    const token = localStorage.getItem("token"); // Verificar si hay token
    return !!token; // Devuelve true si el token existe
};

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} /> {/* Redirige al login */}
            <Route path="/login" element={<Login />} />
            <Route
                path="/usuarios"
                element={isAuthenticated() ? <HomeTabla /> : <Navigate to="/login" />}
            />
            <Route
                path="/edit/:id_usuarios"
                element={isAuthenticated() ? <UsuarioEdit /> : <Navigate to="/login" />}
            />
            <Route path="/crear" element={<UsuarioForm />} /> {/* Formulario de registro */}

            <Route
                path="/recuperar"
                element={isAuthenticated() ? <HomeContrasena /> : <Navigate to="/login" />}
            />


        </Routes>
    </BrowserRouter>
);
