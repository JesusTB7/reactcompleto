import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles2.css";

const MantenimientoForm = () => {
    const navigate = useNavigate();
    const [mantenimiento, setMantenimiento] = useState({
        fecha_mantenimiento: "",
        id_usuarios: "",
        id_bote: ""
    });
    const [usuarios, setUsuarios] = useState([]);
    const [botes, setBotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
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
        

        // Cargar la lista de botes
        axios.get("http://localhost:5000/bot/botes")
            .then(response => {
                setBotes(response.data);
            })
            .catch(error => console.error("Error al cargar los botes:", error));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMantenimiento({ ...mantenimiento, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        axios.post("http://localhost:5000/mant/crearmantenimiento", mantenimiento)
            .then(() => {
                setLoading(false);
                setSuccess(true);

                setTimeout(() => {
                    navigate("/mant/mantenimientos");
                }, 2000);
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    };

    return (
        <div className="form-container">
            <h2>Registro de Mantenimiento</h2>
            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Registrando mantenimiento...</p>
                </div>
            ) : success ? (
                <div className="success-container">
                    <p>Registro exitoso. Cargando...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="fecha_mantenimiento">Fecha de Mantenimiento</label>
                    <input 
                        type="date" 
                        name="fecha_mantenimiento" 
                        onChange={handleChange} 
                        required 
                    />

                    <label htmlFor="id_usuarios">Usuario Responsable</label>
                    <select name="id_usuarios" value={mantenimiento.id_usuarios} onChange={handleChange} required>
                        <option value="">Seleccione un usuario</option>
                        {usuarios.map((usuario) => (
                            <option key={usuario.id_usuarios} value={usuario.id_usuarios}>
                                {usuario.nombre} {usuario.app} {usuario.apm} 
                            </option>
                        ))}
                    </select>

                    <label htmlFor="id_bote">Bote</label>
                    <select name="id_bote" value={mantenimiento.id_bote} onChange={handleChange} required>
                        <option value="">Seleccione un bote</option>
                        {botes.map((bote) => (
                            <option key={bote.id_bote} value={bote.id_bote}>
                                {bote.clave}
                            </option>
                        ))}
                    </select>

                    <button type="submit">Agregar Mantenimiento</button>
                    <p>
                        <span onClick={() => navigate("/mant/mantenimientos")} style={{ cursor: "pointer", color: "blue", textDecoration: "none" }}>
                            Regresar al Inicio
                        </span>
                    </p>
                </form>
            )}
        </div>
    );
};

export default MantenimientoForm;
