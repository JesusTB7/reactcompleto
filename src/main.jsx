import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


import HomeTabla from "./pages/HomeTabla"; 
import HomeTablaPais from "./pages/HomeTablaPais";
import HomeTablaEstado from "./pages/HomeTablaEstado";
import HomeTablaMunicipio from "./pages/HomeTablaMunicipio";
import HomeTablaBote from "./pages/HomeTablaBote";
import HomeTablaAsignacion from "./pages/HomeTablaAsignacion";
import HomeTablaMantenimiento from "./pages/HomeTablaMantenimiento";



import UsuarioEdit from "./components/UsuarioEdit";
import PaisEdit from "./components/PaisEdit";
import EstadoEdit from "./components/EstadoEdit";
import MunicipioEdit from "./components/MunicipioEdit";
import BotesEdit from "./components/BotesEdit";
import AsignacionesEdit from "./components/AsignacionesEdit";
import MantenimientoEdit from "./components/MantenimientoEdit";


import Login from "./components/Login";

import ImpUsuarios from "./components/ImpUsuarios";


import UsuarioForm from "./components/UsuarioForm";
import PaisForm from "./components/PaisForm";
import EstadoForm from "./components/EstadoForm";
import MunicipioForm from "./components/MunicipioForm";
import BotesForm from "./components/BotesForm";
import AsignacionesForm from "./components/AsignacionesForm";
import MantenimientoForm from "./components/MantenimientoForm";


import HomeContrasena from "./pages/HomeContrasena";
import HomePrincipal from "./pages/HomePrincipal";

import HomeUsuario from "./pages/HomeUsuario";
import HomePais from "./pages/HomePais";
import HomeEstado from "./pages/HomeEstado";
import HomeMunicipio from "./pages/HomeMunicipio";
import HomeBote from "./pages/HomeBote";
import HomeAsignacion from "./pages/HomeAsignacion";
import HomeMantenimiento from "./pages/HomeMantenimiento";


// Función para verificar si el usuario está autenticado
const isAuthenticated = () => {
    const token = localStorage.getItem("token"); // Verificar si hay token
    return !!token; // Devuelve true si el token existe
};

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Navigate to="/users/login" />} /> {/* Redirige al login */}
            <Route path="/users/login" element={<Login />} />

            <Route
    path="/principal2"
    element={isAuthenticated() ? <HomePrincipal /> : <Navigate to="/users/login" />}
/>
        
            <Route
                path="/users/usuarios"
                element={isAuthenticated() ? <HomeTabla /> : <Navigate to="/principal" />}
            />
            <Route
                path="/country/paises"
                element={isAuthenticated() ? <HomeTablaPais /> : <Navigate to="/principal" />}
            />
            <Route
                path="/state/estados"
                element={isAuthenticated() ? <HomeTablaEstado /> : <Navigate to="/principal" />}
            />
            <Route
                path="/muni/municipios"
                element={isAuthenticated() ? <HomeTablaMunicipio /> : <Navigate to="/principal" />}
            />
            <Route
                path="/bot/botes"
                element={isAuthenticated() ? <HomeTablaBote /> : <Navigate to="/principal" />}
            />
            <Route
                path="/asig/asignaciones"
                element={isAuthenticated() ? <HomeTablaAsignacion /> : <Navigate to="/principal" />}
            />
            <Route
                path="/mant/mantenimientos"
                element={isAuthenticated() ? <HomeTablaMantenimiento /> : <Navigate to="/principal" />}
            />



            <Route
                path="/principal"
                element={isAuthenticated() ? <HomePrincipal /> : <Navigate to="/users/login" />}
            />
            <Route
                path="/users/usuario"
                element={isAuthenticated() ? <HomeUsuario /> : <Navigate to="/principal" />}
            />
            <Route
                path="/country/pais"
                element={isAuthenticated() ? <HomePais /> : <Navigate to="/principal" />}
            />
            <Route
                path="/state/estado"
                element={isAuthenticated() ? <HomeEstado /> : <Navigate to="/users/login" />}
            />
            <Route
                path="/muni/municipio"
                element={isAuthenticated() ? <HomeMunicipio /> : <Navigate to="/users/login" />}
            />
            <Route
                path="/bot/bote"
                element={isAuthenticated() ? <HomeBote /> : <Navigate to="/users/login" />}
            />
            <Route
                path="/asig/asignacion"
                element={isAuthenticated() ? <HomeAsignacion /> : <Navigate to="/users/login" />}
            />
            <Route
                path="/mant/mantenimiento"
                element={isAuthenticated() ? <HomeMantenimiento /> : <Navigate to="/users/login" />}
            />
            



            <Route
                path="/users/actualizarusuario/:id_usuarios"
                element={isAuthenticated() ? <UsuarioEdit /> : <Navigate to="/principal" />}
            />
            <Route
                path="/country/actualizarpais/:id_pais"
                element={isAuthenticated() ? <PaisEdit /> : <Navigate to="/principal" />}
            />
            <Route
                path="/state/actualizarestado/:id_estado"
                element={isAuthenticated() ? <EstadoEdit /> : <Navigate to="/principal" />}
            />
            <Route
                path="/muni/actualizarmunicipio/:id_municipio"
                element={isAuthenticated() ? <MunicipioEdit /> : <Navigate to="/principal" />}
            />
            <Route
                path="/bot/actualizarbote/:id_bote"
                element={isAuthenticated() ? <BotesEdit /> : <Navigate to="/principal" />}
            />
            <Route
                path="/asig/actualizarasignacion/:id_asignacion"
                element={isAuthenticated() ? <AsignacionesEdit /> : <Navigate to="/principal" />}
            />
            <Route
                path="/mant/actualizarmantenimiento/:id_mantenimiento"
                element={isAuthenticated() ? <MantenimientoEdit /> : <Navigate to="/principal" />}
            />


            <Route path="/users/crearusuario" element={<UsuarioForm />} /> {/* Formulario de registro */}
            <Route path="/country/crearpais" element={<PaisForm />} /> {/* Formulario de registro */}
            <Route path="/state/crearestado" element={<EstadoForm />} /> {/* Formulario de registro */}
            <Route path="/muni/crearmunicipio" element={<MunicipioForm />} /> {/* Formulario de registro */}
            <Route path="/bot/crearbote" element={<BotesForm />} /> {/* Formulario de registro */}
            <Route path="/asig/crearasignacion" element={<AsignacionesForm />} /> {/* Formulario de registro */}
            <Route path="/mant/crearmantenimiento" element={<MantenimientoForm />} /> {/* Formulario de registro */}

            <Route path="/users/importarusuario" element={<ImpUsuarios />} /> {/* Formulario de registro */}


            <Route
                path="/users/recuperar"
                element={isAuthenticated() ? <HomeContrasena /> : <Navigate to="/users/login" />}
            />


        </Routes>
    </BrowserRouter>
);
