import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles2.css";

const PaisEdit = () => {
    const { id_pais } = useParams();
    const navigate = useNavigate();
    const [pais, setPais] = useState({ nombre: "" });
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        axios.get(`https://3.145.49.233/country/pais/${id_pais}`)
            .then(response => {
                console.log("Datos recibidos:", response.data);
                setPais(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error al cargar el país:", error);
                setIsLoading(false);
            });
    }, [id_pais]);

    const handleChange = (e) => {
        setPais({ ...pais, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setMessage("Actualizando país...");

        axios.put(`https://3.145.49.233/country/actualizarpais/${id_pais}`, pais)
            .then(response => {
                console.log("Respuesta del servidor:", response.data);
                setMessage("Actualización exitosa. Redirigiendo...");
                setTimeout(() => navigate("/country/paises"), 2000);
            })
            .catch(error => {
                console.error("Error al actualizar el país:", error);
                setMessage("Hubo un error al actualizar el país.");
                setIsUpdating(false);
            });
    };

    return (
        <div className="form-container">
            <h2>Editar País</h2>
            {isLoading ? (
                <p className="loading-message">Cargando datos del país...</p>
            ) : isUpdating ? (
                <p className="loading-message">{message}</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="nombre">Nombre del País</label>
                    <input type="text" name="nombre" value={pais.nombre} onChange={handleChange} required />

                    <div className="button-group">
                        <button type="submit" disabled={isUpdating}>
                            {isUpdating ? "Cargando..." : "Actualizar País"}
                        </button>
                        <button type="button" onClick={() => navigate("/country/paises")} className="cancel-button">
                            Cancelar
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default PaisEdit;