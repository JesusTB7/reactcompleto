import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles2.css";

const BotesForm = () => {
    const navigate = useNavigate();
    const [bote, setBote] = useState({
        clave: "",
        id_municipio: "",
        direccion: ""
    });
    const [municipios, setMunicipios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // Cargar la lista de municipios
        axios.get("http://localhost:3000/api/municipio")
            .then(response => {
                setMunicipios(response.data);
            })
            .catch(error => console.error("Error al cargar los municipios:", error));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBote({ ...bote, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        axios.post("http://localhost:3000/api/crearbote", bote)
            .then(() => {
                setLoading(false);
                setSuccess(true);

                setTimeout(() => {
                    navigate("/bote"); // Redirigir a la lista de botes
                }, 2000);
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    };

    return (
        <div className="form-container">
            <h2>Registro de Bote</h2>
            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Registrando bote...</p>
                </div>
            ) : success ? (
                <div className="success-container">
                    <p>Registro exitoso. Cargando...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="clave">Clave</label>
                    <input 
                        type="text" 
                        name="clave" 
                        placeholder="Clave del Bote" 
                        onChange={handleChange} 
                        required 
                    />

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
                    <input 
                        type="text" 
                        name="direccion" 
                        placeholder="Dirección del Bote" 
                        onChange={handleChange} 
                        required 
                    />

<label htmlFor="estado_sensor">Estado del Sensor</label>
<select 
    name="estado_sensor" 
    value={bote.estado_sensor} 
    onChange={handleChange} 
    required
>
    <option value="">Seleccione el estado del sensor</option>
    <option value="activo">Activo</option>
    <option value="inactivo">Inactivo</option>
</select>


                    <button type="submit">Agregar Bote</button>
                    <p>
                        <span onClick={() => navigate("/bote")} style={{ cursor: "pointer", color: "blue", textDecoration: "none" }}>
                            Regresar al Inicio
                        </span>
                    </p>
                </form>
            )}
        </div>
    );
};

export default BotesForm;
