import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles2.css";

const PaisForm = () => {
    const navigate = useNavigate();
    const [pais, setPais] = useState({
        nombre: ""
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPais({ ...pais, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        
        axios.post("https://startupvje.vje.x10.mx/country/crearpais", pais)
            .then(() => {
                setLoading(false);
                setSuccess(true);

                setTimeout(() => {
                    navigate("/country/paises"); // Redirigir a la página principal después de mostrar el mensaje
                }, 2000);
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    };

    return (
        <div className="form-container">
            <h2>Registro de País</h2>
            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Registrando país...</p>
                </div>
            ) : success ? (
                <div className="success-container">
                    <p>Registro exitoso. Cargando...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="nombre">Nombre del País</label>
                    <input type="text" name="nombre" placeholder="Nombre del País" onChange={handleChange} required />

                    <button type="submit">Agregar País</button>
                    <p><span onClick={() => navigate("/country/paises")} style={{ cursor: "pointer", color: "blue", textDecoration: "none" }}>Regresar al Inicio</span></p>
                </form>
            )}
        </div>
    );
};

export default PaisForm;
