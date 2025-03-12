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
import HomeTablaSensor from "./pages/HomeTablaSensor";


import UsuarioEdit from "./components/UsuarioEdit";
import PaisEdit from "./components/PaisEdit";
import EstadoEdit from "./components/EstadoEdit";
import MunicipioEdit from "./components/MunicipioEdit";
import BotesEdit from "./components/BotesEdit";
import AsignacionesEdit from "./components/AsignacionesEdit";
import MantenimientoEdit from "./components/MantenimientoEdit";
import SensoresEdit from "./components/SensoresEdit";

import Login from "./components/Login";

import ImpUsuarios from "./components/ImpUsuarios";
import ImpPais from "./components/ImpPais";
import ImpEstado from "./components/ImpEstado";
import ImpMunicipio from "./components/ImpMunicipio";
import ImpBote from "./components/ImpBote";
import ImpAsignacion from "./components/ImpAsignacion";
import ImpMantenimiento from "./components/ImpMantenimiento";
import ImpSensor from "./components/ImpSensor";

import UsuarioForm from "./components/UsuarioForm";
import PaisForm from "./components/PaisForm";
import EstadoForm from "./components/EstadoForm";
import MunicipioForm from "./components/MunicipioForm";
import BotesForm from "./components/BotesForm";
import AsignacionesForm from "./components/AsignacionesForm";
import MantenimientoForm from "./components/MantenimientoForm";
import SensoresForm from "./components/SensoresForm";


import HomeContrasena from "./pages/HomeContrasena";
import HomePrincipal from "./pages/HomePrincipal";

import HomeUsuario from "./pages/HomeUsuario";
import HomePais from "./pages/HomePais";
import HomeEstado from "./pages/HomeEstado";
import HomeMunicipio from "./pages/HomeMunicipio";
import HomeBote from "./pages/HomeBote";
import HomeAsignacion from "./pages/HomeAsignacion";
import HomeMantenimiento from "./pages/HomeMantenimiento";
import HomeSensor from "./pages/HomeSensor";




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
                element={isAuthenticated() ? <HomeTabla /> : <Navigate to="/principal" />}
            />
            <Route
                path="/pais"
                element={isAuthenticated() ? <HomeTablaPais /> : <Navigate to="/principal" />}
            />
            <Route
                path="/estado"
                element={isAuthenticated() ? <HomeTablaEstado /> : <Navigate to="/principal" />}
            />
            <Route
                path="/municipio"
                element={isAuthenticated() ? <HomeTablaMunicipio /> : <Navigate to="/principal" />}
            />
            <Route
                path="/bote"
                element={isAuthenticated() ? <HomeTablaBote /> : <Navigate to="/principal" />}
            />
            <Route
                path="/asignacion"
                element={isAuthenticated() ? <HomeTablaAsignacion /> : <Navigate to="/principal" />}
            />
            <Route
                path="/mantenimiento"
                element={isAuthenticated() ? <HomeTablaMantenimiento /> : <Navigate to="/principal" />}
            />
            <Route
                path="/sensor"
                element={isAuthenticated() ? <HomeTablaSensor /> : <Navigate to="/principal" />}
            />




            <Route
                path="/principal"
                element={isAuthenticated() ? <HomePrincipal /> : <Navigate to="/login" />}
            />
            <Route
                path="/usuarios"
                element={isAuthenticated() ? <HomeUsuario /> : <Navigate to="/principal" />}
            />
            <Route
                path="/pais"
                element={isAuthenticated() ? <HomePais /> : <Navigate to="/principal" />}
            />
            <Route
                path="/estado"
                element={isAuthenticated() ? <HomeEstado /> : <Navigate to="/login" />}
            />
            <Route
                path="/municipio"
                element={isAuthenticated() ? <HomeMunicipio /> : <Navigate to="/login" />}
            />
            <Route
                path="/bote"
                element={isAuthenticated() ? <HomeBote /> : <Navigate to="/login" />}
            />
            <Route
                path="/asignacion"
                element={isAuthenticated() ? <HomeAsignacion /> : <Navigate to="/login" />}
            />
            <Route
                path="/mantenimiento"
                element={isAuthenticated() ? <HomeMantenimiento /> : <Navigate to="/login" />}
            />
            <Route
                path="/sensor"
                element={isAuthenticated() ? <HomeSensor /> : <Navigate to="/login" />}
            />





            <Route
                path="/edit/:id_usuarios"
                element={isAuthenticated() ? <UsuarioEdit /> : <Navigate to="/principal" />}
            />
            <Route
                path="/editpais/:id_pais"
                element={isAuthenticated() ? <PaisEdit /> : <Navigate to="/principal" />}
            />
            <Route
                path="/editestado/:id_estado"
                element={isAuthenticated() ? <EstadoEdit /> : <Navigate to="/principal" />}
            />
            <Route
                path="/editmunicipio/:id_municipio"
                element={isAuthenticated() ? <MunicipioEdit /> : <Navigate to="/principal" />}
            />
            <Route
                path="/editbote/:id_bote"
                element={isAuthenticated() ? <BotesEdit /> : <Navigate to="/principal" />}
            />
            <Route
                path="/editasignacion/:id_asignacion"
                element={isAuthenticated() ? <AsignacionesEdit /> : <Navigate to="/principal" />}
            />
            <Route
                path="/editmantenimiento/:id_mantenimiento"
                element={isAuthenticated() ? <MantenimientoEdit /> : <Navigate to="/principal" />}
            />
            <Route
                path="/editsensor/:id_sensor"
                element={isAuthenticated() ? <SensoresEdit /> : <Navigate to="/principal" />}
            />






            <Route path="/crear" element={<UsuarioForm />} /> {/* Formulario de registro */}
            <Route path="/crearpais" element={<PaisForm />} /> {/* Formulario de registro */}
            <Route path="/crearestado" element={<EstadoForm />} /> {/* Formulario de registro */}
            <Route path="/crearmunicipio" element={<MunicipioForm />} /> {/* Formulario de registro */}
            <Route path="/crearbote" element={<BotesForm />} /> {/* Formulario de registro */}
            <Route path="/crearasignacion" element={<AsignacionesForm />} /> {/* Formulario de registro */}
            <Route path="/crearmantenimiento" element={<MantenimientoForm />} /> {/* Formulario de registro */}
            <Route path="/crearsensor" element={<SensoresForm />} /> {/* Formulario de registro */}

            <Route path="/importarusuarios" element={<ImpUsuarios />} /> {/* Formulario de registro */}
            <Route path="/importarpais" element={<ImpPais />} /> {/* Formulario de registro */}
            <Route path="/importarestado" element={<ImpEstado />} /> {/* Formulario de registro */}
            <Route path="/importarmunicipio" element={<ImpMunicipio />} /> {/* Formulario de registro */}
            <Route path="/importarbote" element={<ImpBote />} /> {/* Formulario de registro */}
            <Route path="/importarasignacion" element={<ImpAsignacion />} /> {/* Formulario de registro */}
            <Route path="/importarmantenimiento" element={<ImpMantenimiento />} /> {/* Formulario de registro */}
            <Route path="/importarsensor" element={<ImpSensor />} /> {/* Formulario de registro */}





            <Route
                path="/recuperar"
                element={isAuthenticated() ? <HomeContrasena /> : <Navigate to="/login" />}
            />


        </Routes>
    </BrowserRouter>
);
