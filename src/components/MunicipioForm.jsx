import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles2.css";

const MunicipioForm = () => {
    const navigate = useNavigate();
    const [municipio, setMunicipio] = useState({
        nombre: "",
        id_estado: ""
    });
    const [estados, setEstados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // Cargar la lista de estados
        axios.get("http://localhost:5000/state/estados")
            .then(response => {
                setEstados(response.data);
            })
            .catch(error => console.error("Error al cargar los estados:", error));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMunicipio({ ...municipio, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        axios.post("http://localhost:5000/muni/crearmunicipio", municipio)
            .then(() => {
                setLoading(false);
                setSuccess(true);

                setTimeout(() => {
                    navigate("/muni/municipios"); // Redirigir a la lista de municipios
                }, 2000);
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    };

    return (
        <div className="form-container">
            <h2>Registro de Municipio</h2>
            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Registrando municipio...</p>
                </div>
            ) : success ? (
                <div className="success-container">
                    <p>Registro exitoso. Cargando...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="nombre">Nombre del Municipio</label>
                    <input 
                        type="text" 
                        name="nombre" 
                        placeholder="Nombre del Municipio" 
                        onChange={handleChange} 
                        required 
                    />

                    <label htmlFor="id_estado">Estado</label>
                    <select name="id_estado" value={municipio.id_estado} onChange={handleChange} required>
                        <option value="">Seleccione un estado</option>
                        {estados.map((estado) => (
                            <option key={estado.id_estado} value={estado.id_estado}>
                                {estado.nombre}
                            </option>
                        ))}
                    </select>

                    <button type="submit">Agregar Municipio</button>
                    <p>
                        <span onClick={() => navigate("/muni/municipios")} style={{ cursor: "pointer", color: "blue", textDecoration: "none" }}>
                            Regresar al Inicio
                        </span>
                    </p>
                </form>
            )}
        </div>
    );
};

export default MunicipioForm;