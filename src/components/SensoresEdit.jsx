import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles2.css";

const SensoresEdit = () => {
    const { id_sensor } = useParams();
    const navigate = useNavigate();
    const [sensor, setSensor] = useState({ estado: "", id_bote: "" });
    const [botes, setBotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Cargar los datos del sensor
        axios.get(`http://localhost:3000/api/sensor/${id_sensor}`)
            .then(response => {
                console.log("Datos del sensor recibidos:", response.data);
                setSensor(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error al cargar el sensor:", error);
                setIsLoading(false);
            });

        // Cargar la lista de botes
        axios.get("http://localhost:3000/api/bote")
            .then(response => {
                console.log("Lista de botes recibida:", response.data);
                setBotes(response.data);
            })
            .catch(error => console.error("Error al cargar los botes:", error));
    }, [id_sensor]);

    const handleChange = (e) => {
        setSensor({ ...sensor, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setMessage("Actualizando sensor...");

        axios.put(`http://localhost:3000/api/actualizarsensor/${id_sensor}`, sensor)
            .then(response => {
                console.log("Respuesta del servidor:", response.data);
                setMessage("Actualización exitosa. Redirigiendo...");
                setTimeout(() => navigate("/sensor"), 2000);
            })
            .catch(error => {
                console.error("Error al actualizar el sensor:", error);
                setMessage("Hubo un error al actualizar el sensor.");
                setIsUpdating(false);
            });
    };

    return (
        <div className="form-container">
            <h2>Editar Sensor</h2>
            {isLoading ? (
                <p className="loading-message">Cargando datos del sensor...</p>
            ) : isUpdating ? (
                <p className="loading-message">{message}</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="estado">Estado del Sensor</label>
                    <select name="estado" value={sensor.estado} onChange={handleChange} required>
                        <option value="">Seleccione un estado</option>
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                    </select>

                    <label htmlFor="id_bote">Bote</label>
                    <select name="id_bote" value={sensor.id_bote} onChange={handleChange} required>
                        <option value="">Seleccione un bote</option>
                        {botes.map((bote) => (
                            <option key={bote.id_bote} value={bote.id_bote}>
                                {bote.clave}
                            </option>
                        ))}
                    </select>

                    <div className="button-group">
                        <button type="submit" disabled={isUpdating}>
                            {isUpdating ? "Cargando..." : "Actualizar Sensor"}
                        </button>
                        <button type="button" onClick={() => navigate("/sensor")} className="cancel-button">
                            Cancelar
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default SensoresEdit;
