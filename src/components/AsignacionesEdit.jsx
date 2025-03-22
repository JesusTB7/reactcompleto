import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles2.css";

const AsignacionesEdit = () => {
    const { id_asignacion } = useParams();
    const navigate = useNavigate();
    const [asignacion, setAsignacion] = useState({ localidad: "", id_bote: "", id_usuarios: "" });
    const [botes, setBotes] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Cargar los datos de la asignación
        axios.get(`http://localhost:5000/asig/asignacion/${id_asignacion}`)
            .then(response => {
                console.log("Datos de la asignación recibidos:", response.data);
                setAsignacion(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error al cargar la asignación:", error);
                setIsLoading(false);
            });

        // Cargar la lista de botes
        axios.get("http://localhost:5000/bot/botes")
            .then(response => {
                console.log("Lista de botes recibida:", response.data);
                setBotes(response.data);
            })
            .catch(error => console.error("Error al cargar los botes:", error));

        // Cargar la lista de usuarios
axios.get("http://localhost:5000/users/usuarios", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
})
.then(response => {
    console.log("Lista de usuarios recibida:", response.data);
    setUsuarios(response.data);
})
.catch(error => console.error("Error al cargar los usuarios:", error));
    }, [id_asignacion]);
    

    const handleChange = (e) => {
        setAsignacion({ ...asignacion, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setMessage("Actualizando asignación...");

        axios.put(`http://localhost:5000/asig/actualizarasignacion/${id_asignacion}`, asignacion)
            .then(response => {
                console.log("Respuesta del servidor:", response.data);
                setMessage("Actualización exitosa. Redirigiendo...");
                setTimeout(() => navigate("/asig/asignaciones"), 2000);
            })
            .catch(error => {
                console.error("Error al actualizar la asignación:", error);
                setMessage("Hubo un error al actualizar la asignación.");
                setIsUpdating(false);
            });
    };

    return (
        <div className="form-container">
            <h2>Editar Asignación</h2>
            {isLoading ? (
                <p className="loading-message">Cargando datos de la asignación...</p>
            ) : isUpdating ? (
                <p className="loading-message">{message}</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="localidad">Localidad</label>
                    <input type="text" name="localidad" value={asignacion.localidad} onChange={handleChange} required />

                    <label htmlFor="id_bote">Bote</label>
                    <select name="id_bote" value={asignacion.id_bote} onChange={handleChange} required>
                        <option value="">Seleccione un bote</option>
                        {botes.map((bote) => (
                            <option key={bote.id_bote} value={bote.id_bote}>
                                {bote.clave}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="id_usuarios">Usuario</label>
                    <select name="id_usuarios" value={asignacion.id_usuarios} onChange={handleChange} required>
                        <option value="">Seleccione un usuario</option>
                        {usuarios.map((usuario) => (
                            <option key={usuario.id_usuarios} value={usuario.id_usuarios}>
                                {usuario.nombre} {usuario.app} {usuario.apm}
                            </option>
                        ))}
                    </select>

                    <div className="button-group">
                        <button type="submit" disabled={isUpdating}>
                            {isUpdating ? "Cargando..." : "Actualizar Asignación"}
                        </button>
                        <button type="button" onClick={() => navigate("/asig/asignaciones")} className="cancel-button">
                            Cancelar
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default AsignacionesEdit;