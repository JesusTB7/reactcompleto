import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles2.css";

const EstadoForm = () => {
    const navigate = useNavigate();
    const [estado, setEstado] = useState({
        nombre: "",
        id_pais: ""
    });
    const [paises, setPaises] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // Cargar la lista de países
        axios.get("http://localhost:3000/api/pais")
            .then(response => {
                setPaises(response.data);
            })
            .catch(error => console.error("Error al cargar los países:", error));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEstado({ ...estado, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        axios.post("http://localhost:3000/api/crearestado", estado)
            .then(() => {
                setLoading(false);
                setSuccess(true);

                setTimeout(() => {
                    navigate("/estado"); // Redirigir a la lista de estados
                }, 2000);
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    };

    return (
        <div className="form-container">
            <h2>Registro de Estado</h2>
            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Registrando estado...</p>
                </div>
            ) : success ? (
                <div className="success-container">
                    <p>Registro exitoso. Cargando...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="nombre">Nombre del Estado</label>
                    <input 
                        type="text" 
                        name="nombre" 
                        placeholder="Nombre del Estado" 
                        onChange={handleChange} 
                        required 
                    />

                    <label htmlFor="id_pais">País</label>
                    <select name="id_pais" value={estado.id_pais} onChange={handleChange} required>
                        <option value="">Seleccione un país</option>
                        {paises.map((pais) => (
                            <option key={pais.id_pais} value={pais.id_pais}>
                                {pais.nombre}
                            </option>
                        ))}
                    </select>

                    <button type="submit">Agregar Estado</button>
                    <p>
                        <span onClick={() => navigate("/estado")} style={{ cursor: "pointer", color: "blue", textDecoration: "none" }}>
                            Regresar al Inicio
                        </span>
                    </p>
                </form>
            )}
        </div>
    );
};

export default EstadoForm;
