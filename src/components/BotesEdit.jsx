import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles2.css";

const BotesEdit = () => {
    const { id_bote } = useParams();
    const navigate = useNavigate();
    const [bote, setBote] = useState({ clave: "", id_municipio: "", direccion: "" });
    const [municipios, setMunicipios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Cargar los datos del bote
        axios.get(`http://localhost:5000/bot/bote/${id_bote}`)
            .then(response => {
                console.log("Datos del bote recibidos:", response.data);
                setBote(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error al cargar el bote:", error);
                setIsLoading(false);
            });

        // Cargar la lista de municipios
        axios.get("http://localhost:5000/muni/municipios")
            .then(response => {
                console.log("Lista de municipios recibida:", response.data);
                setMunicipios(response.data);
            })
            .catch(error => console.error("Error al cargar los municipios:", error));
    }, [id_bote]);

    const handleChange = (e) => {
        setBote({ ...bote, [e.target.name]: e.target.value });
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setMessage("Actualizando bote...");

        axios.put(`http://localhost:5000/bot/actualizarbote/${id_bote}`, bote)
            .then(response => {
                console.log("Respuesta del servidor:", response.data);
                setMessage("Actualización exitosa. Redirigiendo...");
                setTimeout(() => navigate("/bot/botes"), 2000);
            })
            .catch(error => {
                console.error("Error al actualizar el bote:", error);
                setMessage("Hubo un error al actualizar el bote.");
                setIsUpdating(false);
            });
    };


    return (
        <div className="form-container">
            <h2>Editar Bote</h2>
            {isLoading ? (
                <p className="loading-message">Cargando datos del bote...</p>
            ) : isUpdating ? (
                <p className="loading-message">{message}</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="clave">Clave del Bote</label>
                    <input type="text" name="clave" value={bote.clave} onChange={handleChange} required />

                    <label htmlFor="id_municipio">Municipio</label>
                    <select name="id_municipio" value={bote.id_municipio} onChange={handleChange} required>
                        <option value="">Seleccione un municipio</option>
                        {municipios.map((municipio) => (
                            <option key={municipio.id_municipio} value={municipio.id_municipio}>
                                {municipio.nombre}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="direccion">Dirección</label>
                    <input type="text" name="direccion" value={bote.direccion} onChange={handleChange} required />

                    <label htmlFor="estado_sensor">Estado del Sensor</label>
<select 
    name="estado_sensor" 
    value={bote.estado_sensor || ""}  // Evita valores undefined
    onChange={handleChange} 
    required
>
    <option value="">Seleccione el estado del sensor</option>
    <option value="Activo">Activo</option>
    <option value="Inactivo">Inactivo</option>
</select>

                    <div className="button-group">
                        <button type="submit" disabled={isUpdating}>
                            {isUpdating ? "Cargando..." : "Actualizar Bote"}
                        </button>
                        <button type="button" onClick={() => navigate("/bot/botes")} className="cancel-button">
                            Cancelar
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default BotesEdit;
