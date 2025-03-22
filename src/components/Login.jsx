import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css"; 

const Login = () => {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState({ correo: "", contrasena: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [intentos, setIntentos] = useState(0);
    const [bloqueado, setBloqueado] = useState(false);
    const [tiempoRestante, setTiempoRestante] = useState(0);
    const [mostrarContrasena, setMostrarContrasena] = useState(false);

    useEffect(() => {
        const bloqueo = localStorage.getItem("bloqueo");
        if (bloqueo) {
            const tiempoTranscurrido = Date.now() - parseInt(bloqueo, 10);
            if (tiempoTranscurrido < 60000) {
                setBloqueado(true);
                setTiempoRestante(60 - Math.floor(tiempoTranscurrido / 1000));
                const interval = setInterval(() => {
                    setTiempoRestante(prev => {
                        if (prev <= 1) {
                            clearInterval(interval);
                            setBloqueado(false);
                            setUsuario({ correo: "", contrasena: "" });
                            setError("");
                            localStorage.removeItem("bloqueo");
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
                return () => clearInterval(interval);
            }
        }
    }, []);

    const handleChange = (e) => {
        setUsuario({ ...usuario, [e.target.name]: e.target.value });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (bloqueado) return;

        setLoading(true);
        setError("");
        
        axios.post("http://3.145.49.233/users/login", usuario, {
            headers: { "Content-Type": "application/json" }
        })
        .then(response => {
            console.log("Respuesta completa del backend:", response.data);
        
            if (response.data.access_token) {
                console.log("Token recibido:", response.data.access_token);
                localStorage.setItem("token", response.data.access_token);
                navigate("/principal");
                window.location.reload();
            } else {
                console.warn("No se recibió un token en la respuesta.");
                manejarIntentoFallido();
            }
        })
        .catch(error => {
            console.error("Error en la solicitud:", error.response ? error.response.data : error);
            manejarIntentoFallido();
        });
    };

    const manejarIntentoFallido = () => {
        setLoading(false);
        setError("Error al iniciar sesión, revise sus datos.");
        setIntentos(prev => {
            const nuevosIntentos = prev + 1;
            if (nuevosIntentos >= 3) {
                setBloqueado(true);
                setTiempoRestante(60);
                localStorage.setItem("bloqueo", Date.now().toString());
                const interval = setInterval(() => {
                    setTiempoRestante(prev => {
                        if (prev <= 1) {
                            clearInterval(interval);
                            setBloqueado(false);
                            setUsuario({ correo: "", contrasena: "" });
                            setError("");
                            localStorage.removeItem("bloqueo");
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            }
            return nuevosIntentos;
        });
    };

    return (
        <div 
            className="form-container"
            style={{
                backgroundImage: 'url("https://s3.amazonaws.com/arc-wordpress-client-uploads/infobae-wp/wp-content/uploads/2019/08/07143403/Desfile_Residual-3.jpg")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                width: "80vw",
                height: "80vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <div className="form-box">
                <img 
                    src="/img/Logo.jpg" 
                    alt="Login" 
                    className="login-image"
                />
                <h2>Iniciar Sesión</h2>
                <form onSubmit={handleLogin}>
                    <label>Email</label>
                    <input type="email" name="correo" placeholder="Correo electrónico" value={usuario.correo} onChange={handleChange} required disabled={bloqueado} />

                    <label>Contraseña</label>
                    <div className="password-container">
                        <input 
                            type={mostrarContrasena ? "text" : "password"} 
                            name="contrasena" 
                            placeholder="Contraseña" 
                            value={usuario.contrasena} 
                            onChange={handleChange} 
                            required 
                            disabled={bloqueado} 
                        />
                        <span 
                            className="toggle-password" 
                            onClick={() => setMostrarContrasena(!mostrarContrasena)}
                        >
                            {mostrarContrasena ? "Ocultar" : "Ver"}
                        </span>
                    </div>
                    
                    {bloqueado ? (
                        <p className="error-message">Demasiados intentos fallidos. Intente de nuevo en {tiempoRestante} segundos.</p>
                    ) : loading ? (
                        <div className="loading-animation">Iniciando sesión...</div>
                    ) : (
                        <button type="submit">Iniciar sesión</button>
                    )}
                    {error && <p className="error-message">{error}</p>}
                    
                    <p>
                        ¿No tiene cuenta? {" "}
                        <span onClick={() => navigate("/users/crearusuario")} style={{ cursor: "pointer", color: "blue", textDecoration: "none" }}>Regístrese</span>
                    </p>
                    <p>
                        ¿Has olvidado tu contraseña? {" "}
                        <span onClick={() => navigate("/users/recuperar")} style={{ cursor: "pointer", color: "blue", textDecoration: "none" }}>Recupérala aquí</span>
                    </p>
                </form>
            </div>

            <style>
                {`
                    .form-box {
                        background: rgba(169, 169, 169, 0.8); /* Fondo gris */
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
                        width: 900px;
                        text-align: center;
                        animation: fadeIn 0.8s ease-in-out;
                    }

                    .login-image {
                        width: 100px;
                        height: auto;
                        display: block;
                        margin: 0 auto 10px; /* Centra la imagen y agrega margen inferior */
                    }

                    .loading-animation {
                        font-size: 16px;
                        font-weight: bold;
                        color: #007bff;
                        animation: fade 1s infinite alternate;
                    }

                    .error-message {
                        color: red;
                        font-size: 14px;
                        margin-top: 10px;
                    }

                    @keyframes fade {
                        from { opacity: 0.5; }
                        to { opacity: 1; }
                    }

                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(50px); }
                        to { opacity: 1; transform: translateY(0); }
                    }

                    .password-container {
                        position: relative;
                    }

                    .toggle-password {
                        position: absolute;
                        right: 10px;
                        top: 10px;
                        cursor: pointer;
                        color: #007bff;
                    }

                    button {
                        cursor: pointer;
                        transition: background-color 0.3s;
                    }

                    button:hover {
                        background-color: #0056b3;
                        color: white;
                    }
                `}
            </style>
        </div>
    );
};

export default Login;
