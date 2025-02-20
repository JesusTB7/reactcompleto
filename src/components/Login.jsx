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
    const [mostrarContrasena, setMostrarContrasena] = useState(false); // Nuevo estado para la visibilidad de la contraseña

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
                            setError(""); // Limpiar el mensaje de error
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
        
        axios
            .post("http://localhost:3000/api/login", usuario, {
                headers: { "Content-Type": "application/json" }
            })
            .then(response => {
                console.log(response);  // Verifica lo que estás recibiendo
                if (response.data.token) {
                    // Guardamos el token y redirigimos
                    localStorage.setItem("token", response.data.token);
                    setIntentos(0);
                    setBloqueado(false);
                    localStorage.removeItem("bloqueo");

                    // Aseguramos que la redirección suceda después de un retraso
                    setTimeout(() => {
                        navigate("/usuarios");
                        window.location.reload();  // Fuerza la actualización
                    }, 1000);
                } else {
                    manejarIntentoFallido();
                }
            })
            .catch(() => {
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
                            setError(""); // Limpiar el mensaje de error
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
        <div className="form-container">
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
                    <span onClick={() => navigate("/crear")} style={{ cursor: "pointer", color: "blue", textDecoration: "none" }}>Regístrese</span>
                </p>
                <p>
                    ¿Has olvidado tu contraseña? {" "}
                    <span onClick={() => navigate("/recuperar")} style={{ cursor: "pointer", color: "blue", textDecoration: "none" }}>Recupérala aquí</span>
                </p>
            </form>
            <style>
                {`
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
                `}
            </style>
        </div>
    );
};

export default Login;
