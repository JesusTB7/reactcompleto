import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles2.css";

const MunicipioEdit = () => {
    const { id_municipio } = useParams();
    const navigate = useNavigate();
    const [municipio, setMunicipio] = useState({ nombre: "", id_estado: "" });
    const [estados, setEstados] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Cargar los datos del municipio
        axios.get(`http://localhost:5000/muni/municipio/${id_municipio}`)
            .then(response => {
                console.log("Datos del municipio recibidos:", response.data);
                setMunicipio(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error al cargar el municipio:", error);
                setIsLoading(false);
            });

        // Cargar la lista de estados
        axios.get("http://localhost:5000/state/estados")
            .then(response => {
                console.log("Lista de estados recibida:", response.data);
                setEstados(response.data);
            })
            .catch(error => console.error("Error al cargar los estados:", error));
    }, [id_municipio]);

    const handleChange = (e) => {
        setMunicipio({ ...municipio, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setMessage("Actualizando municipio...");

        axios.put(`http://localhost:5000/muni/actualizarmunicipio/${id_municipio}`, municipio)
            .then(response => {
                console.log("Respuesta del servidor:", response.data);
                setMessage("Actualización exitosa. Redirigiendo...");
                setTimeout(() => navigate("/muni/municipios"), 2000);
            })
            .catch(error => {
                console.error("Error al actualizar el municipio:", error);
                setMessage("Hubo un error al actualizar el municipio.");
                setIsUpdating(false);
            });
    };

    return (
        <div className="form-container">
            <h2>Editar Municipio</h2>
            {isLoading ? (
                <p className="loading-message">Cargando datos del municipio...</p>
            ) : isUpdating ? (
                <p className="loading-message">{message}</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="nombre">Nombre del Municipio</label>
                    <input type="text" name="nombre" value={municipio.nombre} onChange={handleChange} required />

                    <label htmlFor="id_estado">Estado</label>
                    <select name="id_estado" value={municipio.id_estado} onChange={handleChange} required>
                        <option value="">Seleccione un estado</option>
                        {estados.map((estado) => (
                            <option key={estado.id_estado} value={estado.id_estado}>
                                {estado.nombre}
                            </option>
                        ))}
                    </select>

                    <div className="button-group">
                        <button type="submit" disabled={isUpdating}>
                            {isUpdating ? "Cargando..." : "Actualizar Municipio"}
                        </button>
                        <button type="button" onClick={() => navigate("/muni/municipios")} className="cancel-button">
                            Cancelar
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default MunicipioEdit;
