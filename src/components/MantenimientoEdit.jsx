import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles2.css";

const MantenimientoEdit = () => {
    const { id_mantenimiento } = useParams();
    const navigate = useNavigate();
    const [mantenimiento, setMantenimiento] = useState({ fecha_mantenimiento: "", id_usuarios: "", id_bote: "" });
    const [usuarios, setUsuarios] = useState([]);
    const [botes, setBotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Cargar los datos del mantenimiento
        axios.get(`http://localhost:5000/mant/mantenimiento/${id_mantenimiento}`)
            .then(response => {
                console.log("Datos del mantenimiento recibidos:", response.data);
                
                // Asegurarse de que la fecha esté en formato YYYY-MM-DD
                const fechaFormateada = formatDate(response.data.fecha_mantenimiento);
                setMantenimiento({
                    ...response.data,
                    fecha_mantenimiento: fechaFormateada, // Asignar la fecha formateada
                });

                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error al cargar el mantenimiento:", error);
                setIsLoading(false);
            });

        // Cargar la lista de usuarios
        axios.get("http://localhost:5000/users/usuarios", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}` // Obtiene el token del almacenamiento local
            }
        })
        .then(response => {
            setUsuarios(response.data);
        })
        .catch(error => console.error("Error al cargar los usuarios:", error));

        // Cargar la lista de botes
        axios.get("http://localhost:5000/bot/botes")
            .then(response => {
                console.log("Lista de botes recibida:", response.data);
                setBotes(response.data);
            })
            .catch(error => console.error("Error al cargar los botes:", error));
    }, [id_mantenimiento]);

    const handleChange = (e) => {
        setMantenimiento({ ...mantenimiento, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setMessage("Actualizando mantenimiento...");

        axios.put(`http://localhost:5000/mant/actualizarmantenimiento/${id_mantenimiento}`, mantenimiento)
            .then(response => {
                console.log("Respuesta del servidor:", response.data);
                setMessage("Actualización exitosa. Redirigiendo...");
                setTimeout(() => navigate("/mant/mantenimientos"), 2000);
            })
            .catch(error => {
                console.error("Error al actualizar el mantenimiento:", error);
                setMessage("Hubo un error al actualizar el mantenimiento.");
                setIsUpdating(false);
            });
    };

    // Función para formatear la fecha
    const formatDate = (date) => {
        const newDate = new Date(date);
        const year = newDate.getFullYear();
        const month = String(newDate.getMonth() + 1).padStart(2, "0"); // Mes en formato 2 dígitos
        const day = String(newDate.getDate()).padStart(2, "0"); // Día en formato 2 dígitos
        return `${year}-${month}-${day}`; // Devuelve la fecha en formato YYYY-MM-DD
    };

    return (
        <div className="form-container">
            <h2>Editar Mantenimiento</h2>
            {isLoading ? (
                <p className="loading-message">Cargando datos del mantenimiento...</p>
            ) : isUpdating ? (
                <p className="loading-message">{message}</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="fecha_mantenimiento">Fecha de Mantenimiento</label>
                    <input 
                        type="date" 
                        name="fecha_mantenimiento" 
                        value={mantenimiento.fecha_mantenimiento} 
                        onChange={handleChange} 
                        required 
                    />

                    <label htmlFor="id_usuarios">Usuario Responsable</label>
                    <select name="id_usuarios" value={mantenimiento.id_usuarios} onChange={handleChange} required>
                        <option value="">Seleccione un usuario</option>
                        {usuarios.map((usuario) => (
                            <option key={usuario.id_usuarios} value={usuario.id_usuarios}>
                                {usuario.nombre} {usuario.app} {usuario.apm}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="id_bote">Bote</label>
                    <select name="id_bote" value={mantenimiento.id_bote} onChange={handleChange} required>
                        <option value="">Seleccione un bote</option>
                        {botes.map((bote) => (
                            <option key={bote.id_bote} value={bote.id_bote}>
                                {bote.clave}
                            </option>
                        ))}
                    </select>

                    <div className="button-group">
                        <button type="submit" disabled={isUpdating}>
                            {isUpdating ? "Cargando..." : "Actualizar Mantenimiento"}
                        </button>
                        <button type="button" onClick={() => navigate("/mant/mantenimientos")} className="cancel-button">
                            Cancelar
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default MantenimientoEdit;
