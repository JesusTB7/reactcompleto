import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles2.css";

const SensoresForm = () => {
    const navigate = useNavigate();
    const [sensor, setSensor] = useState({
        estado: "", 
        id_bote: ""
    });
    const [botes, setBotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // Cargar la lista de botes
        axios.get("http://localhost:3000/api/bote")
            .then(response => {
                setBotes(response.data);
            })
            .catch(error => console.error("Error al cargar los botes:", error));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSensor({ ...sensor, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        axios.post("http://localhost:3000/api/crearsensor", sensor)
            .then(() => {
                setLoading(false);
                setSuccess(true);

                setTimeout(() => {
                    navigate("/sensor"); // Redirigir a la lista de sensores
                }, 2000);
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    };

    return (
        <div className="form-container">
            <h2>Registro de Sensor</h2>
            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Registrando sensor...</p>
                </div>
            ) : success ? (
                <div className="success-container">
                    <p>Registro exitoso. Cargando...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="estado">Estado del Sensor</label>
                    <select name="estado" value={sensor.estado} onChange={handleChange} required>
                        <option value="">Seleccione el estado del bote</option>
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

                    <button type="submit">Agregar Sensor</button>
                    <p>
                        <span onClick={() => navigate("/sensor")} style={{ cursor: "pointer", color: "blue", textDecoration: "none" }}>
                            Regresar al Inicio
                        </span>
                    </p>
                </form>
            )}
        </div>
    );
};

export default SensoresForm;