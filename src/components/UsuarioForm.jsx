import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles2.css";

const UsuarioForm = () => {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState({
        nombre: "",
        app: "",
        apm: "",
        fn: "",
        sexo: "",
        correo: "",
        contrasena: ""
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUsuario({ ...usuario, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        
        axios.post("http://localhost:3000/api/crear", usuario)
            .then(() => {
                setLoading(false);
                setSuccess(true);

                setTimeout(() => {
                    navigate("/login"); // Redirigir al login después de mostrar el mensaje
                }, 2000);
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    };

    return (
        <div className="form-container">
            <h2>Registro de Usuario</h2>
            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Registrando usuario...</p>
                </div>
            ) : success ? (
                <div className="success-container">
                    <p>Registro exitoso. Cargando...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="nombre">Nombre</label>
                    <input type="text" name="nombre" placeholder="Nombre" onChange={handleChange} required />

                    <label htmlFor="app">Apellido Paterno</label>
                    <input type="text" name="app" placeholder="Apellido Paterno" onChange={handleChange} required />

                    <label htmlFor="apm">Apellido Materno</label>
                    <input type="text" name="apm" placeholder="Apellido Materno" onChange={handleChange} required />

                    <label htmlFor="fn">Fecha de Nacimiento</label>
                    <input type="date" name="fn" onChange={handleChange} required />

                    <label htmlFor="sexo">Sexo</label>
                    <select name="sexo" value={usuario.sexo} onChange={handleChange} required>
                        <option value="">Seleccione una opción</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Otro">Otro</option>
                    </select>

                    <label htmlFor="correo">Correo</label>
                    <input type="email" name="correo" placeholder="Correo" onChange={handleChange} required />

                    <label htmlFor="contrasena">Contraseña</label>
<input 
  type="password" 
  name="contrasena" 
  placeholder="Contraseña" 
  onChange={handleChange} 
  required 
  pattern="^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$" 
  title="La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo como #, @, $, etc."
/>


                    <button type="submit">Agregar Usuario</button>
                    <p><span onClick={() => navigate("/login")} style={{ cursor: "pointer", color: "blue", textDecoration: "none" }}>Regresar al Inicio</span></p>
                </form>
            )}
        </div>
    );
};


const styles = {
    formContainer: {
        width: "300px",
        margin: "auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        textAlign: "center",
        backgroundColor: "#f9f9f9"
    },
    loadingContainer: {
        textAlign: "center",
        fontSize: "1.2em",
        color: "#333"
    },
    successContainer: {
        textAlign: "center",
        fontSize: "1.2em",
        color: "green",
        fontWeight: "bold"
    },
    spinner: {
        width: "40px",
        height: "40px",
        border: "4px solid rgba(0, 0, 0, 0.1)",
        borderTop: "4px solid #007bff",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
        margin: "10px auto"
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "10px"
    },
    button: {
        padding: "10px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
    }
};

// Animación dentro de JSX
const styleTag = document.createElement("style");
styleTag.innerHTML = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(styleTag);


export default UsuarioForm;
