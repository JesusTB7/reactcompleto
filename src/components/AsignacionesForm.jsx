import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles2.css";

const AsignacionesForm = () => {
    const navigate = useNavigate();
    const [asignacion, setAsignacion] = useState({
        localidad: "",
        id_bote: "",
        id_usuarios: ""
    });
    const [botes, setBotes] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // Cargar la lista de botes
        axios.get("http://localhost:5000/bot/botes")
            .then(response => {
                setBotes(response.data);
            })
            .catch(error => console.error("Error al cargar los botes:", error));

        // Cargar la lista de usuarios
        axios.get("http://localhost:5000/users/usuarios", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}` // Obtiene el token del almacenamiento local
            }
        })
        .then(response => {
            setUsuarios(response.data);
        })
        .catch(error => console.error("Error al cargar los usuarios:", error));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAsignacion({ ...asignacion, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        axios.post("http://localhost:5000/asig/crearasignacion", asignacion)
            .then(() => {
                setLoading(false);
                setSuccess(true);

                setTimeout(() => {
                    navigate("/asig/asignaciones"); // Redirigir a la lista de asignaciones
                }, 2000);
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    };

    return (
        <div className="form-container">
            <h2>Registro de Asignación</h2>
            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Registrando asignación...</p>
                </div>
            ) : success ? (
                <div className="success-container">
                    <p>Registro exitoso. Cargando...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="localidad">Localidad</label>
                    <input 
                        type="text" 
                        name="localidad" 
                        placeholder="Localidad" 
                        onChange={handleChange} 
                        required 
                    />

                    <label htmlFor="id_bote">Bote</label>
                    <select name="id_bote" value={asignacion.id_bote} onChange={handleChange} required>
                        <option value="">Seleccione un bote</option>
                        {botes.map((bote) => (
                            <option key={bote.id_bote} value={bote.id_bote}>
                                {bote.clave}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="id_usuarios">Usuario</label>
                    <select name="id_usuarios" value={asignacion.id_usuarios} onChange={handleChange} required>
                        <option value="">Seleccione un usuario</option>
                        {usuarios.map((usuario) => (
                            <option key={usuario.id_usuarios} value={usuario.id_usuarios}>
                            {usuario.nombre} {usuario.app} {usuario.apm}
                        </option>
                        
                        ))}
                    </select>

                    <button type="submit">Agregar Asignación</button>
                    <p>
                        <span onClick={() => navigate("/asig/asignaciones")} style={{ cursor: "pointer", color: "blue", textDecoration: "none" }}>
                            Regresar al Inicio
                        </span>
                    </p>
                </form>
            )}
        </div>
    );
};

export default AsignacionesForm;
