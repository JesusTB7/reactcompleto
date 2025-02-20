import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles2.css";

const UsuarioEdit = () => {
    const { id_usuarios } = useParams();
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState({
        nombre: "",
        app: "",
        apm: "",
        fn: "",
        sexo: "",
        correo: "",
        contrasena: ""
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:3000/api/usuarios/${id_usuarios}`)
            .then(response => {
                console.log("Datos recibidos:", response.data);
                setUsuario(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error al cargar el usuario:", error);
                setIsLoading(false);
            });
    }, [id_usuarios]);

    const handleChange = (e) => {
        setUsuario({ ...usuario, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setMessage("Actualizando usuario...");

        axios.put(`http://localhost:3000/api/actualizar/${id_usuarios}`, usuario)
            .then(response => {
                console.log("Respuesta del servidor:", response.data);
                setMessage("Actualización exitosa. Redirigiendo...");
                setTimeout(() => navigate("/usuarios"), 2000);
            })
            .catch(error => {
                console.error("Error al actualizar el usuario:", error);
                setMessage("Hubo un error al actualizar el usuario.");
                setIsUpdating(false);
            });
    };

    return (
        <div className="form-container">
            <h2>Editar Usuario</h2>
            
            {isLoading ? (
                <p className="loading-message">Cargando datos del usuario...</p>
            ) : isUpdating ? (
                <p className="loading-message">{message}</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="nombre">Nombre</label>
                    <input type="text" name="nombre" value={usuario.nombre} onChange={handleChange} required />

                    <label htmlFor="app">Apellido Paterno</label>
                    <input type="text" name="app" value={usuario.app} onChange={handleChange} required />

                    <label htmlFor="apm">Apellido Materno</label>
                    <input type="text" name="apm" value={usuario.apm} onChange={handleChange} required />

                    <label htmlFor="fn">Fecha de Nacimiento</label>
                    <input type="date" name="fn" value={usuario.fn ? new Date(usuario.fn).toISOString().split('T')[0] : ""} onChange={handleChange} required />

                    <label htmlFor="sexo">Sexo</label>
                    <select name="sexo" value={usuario.sexo} onChange={handleChange} required>
                        <option value="">Seleccione una opción</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Otro">Otro</option>
                    </select>

                    <label htmlFor="correo">Correo</label>
                    <input type="email" name="correo" value={usuario.correo} onChange={handleChange} required />

                    <label htmlFor="contrasena">Contraseña</label>
<input 
  type="password" 
  name="contrasena" 
  value={usuario.contrasena} 
  onChange={handleChange} 
  required 
  pattern="^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$" 
  title="La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo como #, @, $, etc."
/>


                    <div className="button-group">
                        <button type="submit" disabled={isUpdating}>
                            {isUpdating ? "Cargando..." : "Actualizar Usuario"}
                        </button>
                        <button type="button" onClick={() => navigate("/usuarios")} className="cancel-button">
                            Cancelar
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default UsuarioEdit;
