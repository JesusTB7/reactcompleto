import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles2.css";

const EstadoEdit = () => {
    const { id_estado } = useParams();
    const navigate = useNavigate();
    const [estado, setEstado] = useState({ nombre: "", id_pais: "" });
    const [paises, setPaises] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Cargar los datos del estado
        axios.get(`https://startupvje.vje.x10.mx/state/estado/${id_estado}`)
            .then(response => {
                console.log("Datos del estado recibidos:", response.data);
                setEstado(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error al cargar el estado:", error);
                setIsLoading(false);
            });

        // Cargar la lista de países
        axios.get("https://startupvje.vje.x10.mx/country/paises")
            .then(response => {
                console.log("Lista de países recibida:", response.data);
                setPaises(response.data);
            })
            .catch(error => console.error("Error al cargar los países:", error));
    }, [id_estado]);

    const handleChange = (e) => {
        setEstado({ ...estado, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setMessage("Actualizando estado...");

        axios.put(`https://startupvje.vje.x10.mx/state/actualizarestado/${id_estado}`, estado)
            .then(response => {
                console.log("Respuesta del servidor:", response.data);
                setMessage("Actualización exitosa. Redirigiendo...");
                setTimeout(() => navigate("/state/estados"), 2000);
            })
            .catch(error => {
                console.error("Error al actualizar el estado:", error);
                setMessage("Hubo un error al actualizar el estado.");
                setIsUpdating(false);
            });
    };

    return (
        <div className="form-container">
            <h2>Editar Estado</h2>
            {isLoading ? (
                <p className="loading-message">Cargando datos del estado...</p>
            ) : isUpdating ? (
                <p className="loading-message">{message}</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="nombre">Nombre del Estado</label>
                    <input type="text" name="nombre" value={estado.nombre} onChange={handleChange} required />

                    <label htmlFor="id_pais">País</label>
                    <select name="id_pais" value={estado.id_pais} onChange={handleChange} required>
                        <option value="">Seleccione un país</option>
                        {paises.map((pais) => (
                            <option key={pais.id_pais} value={pais.id_pais}>
                                {pais.nombre}
                            </option>
                        ))}
                    </select>

                    <div className="button-group">
                        <button type="submit" disabled={isUpdating}>
                            {isUpdating ? "Cargando..." : "Actualizar Estado"}
                        </button>
                        <button type="button" onClick={() => navigate("/state/estados")} className="cancel-button">
                            Cancelar
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default EstadoEdit;
