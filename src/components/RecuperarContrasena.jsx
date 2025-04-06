import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RecuperarContrasena = () => {
  const [correo, setCorreo] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [step, setStep] = useState(1);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const navigate = useNavigate();

  const handleCorreoChange = (e) => {
    setCorreo(e.target.value);
    setMensaje("");
  };

  const handleNuevaContrasenaChange = (e) => setNuevaContrasena(e.target.value);
  const handleConfirmarContrasenaChange = (e) => setConfirmarContrasena(e.target.value);

  const handleRecuperarContrasena = async () => {
    try {
      const response = await axios.post("https://startupvje.vje.x10.mx/users/recuperar", { correo });
      if (response.data.exito) {
        setStep(2);
        setMensaje("");
      } else {
        setMensaje("Correo no encontrado.");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setMensaje("Correo no encontrado.");
      } else {
        setMensaje("Error al recuperar la contraseña. Intenta de nuevo.");
      }
    }
  };

  const validatePassword = (password) => {
    const mayuscula = /[A-Z]/.test(password);
    const minuscula = /[a-z]/.test(password);
    const numero = /[0-9]/.test(password);
    const simbolo = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return mayuscula && minuscula && numero && simbolo;
  };

  const handleActualizarContrasena = async () => {
    if (nuevaContrasena === confirmarContrasena) {
      if (!validatePassword(nuevaContrasena)) {
        setMensaje("La contraseña debe contener al menos una mayúscula, un número, un símbolo y una minúscula.");
        return;
      }

      setCargando(true);
      try {
        const response = await axios.put("https://startupvje.vje.x10.mx/users/actualizar-contrasena", {
          correo,
          nuevaContrasena
        });
        if (response.data.mensaje) {
          setMensaje("Contraseña cambiada con éxito.");
          setTimeout(() => {
            setStep(1);
            setCorreo("");
            setNuevaContrasena("");
            setConfirmarContrasena("");
            setMensaje("");
            setCargando(false);
            navigate("/users/login");
          }, 2000);
        } else {
          setMensaje("Hubo un problema al actualizar la contraseña.");
          setCargando(false);
        }
      } catch (error) {
        setMensaje("Error al actualizar la contraseña. Intenta de nuevo.");
        setCargando(false);
      }
    } else {
      setMensaje("Las contraseñas no coinciden.");
    }
  };

  return (
    <div className="container" style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      flexDirection: "column"
    }}>
      <div style={{
        background: "#f9f9f9",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        width: "300px",
        textAlign: "center"
      }}>
        {step === 1 && (
          <div>
            <h2>Recuperar Contraseña</h2>
            <input
              type="email"
              placeholder="Ingresa tu correo"
              value={correo}
              onChange={handleCorreoChange}
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px"
              }}
            />
            <button
              onClick={handleRecuperarContrasena}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Cambiar Contraseña
            </button>
            <button type="button" onClick={() => navigate("/users/login")} className="cancel-button">
              Cancelar
            </button>
            {mensaje && <p style={{ color: "red" }}>{mensaje}</p>}
          </div>
        )}

        {step === 2 && (
          <div>
            <h2>Ingresa tu nueva contraseña</h2>
            <input
              type={mostrarContrasena ? "text" : "password"}
              placeholder="Nueva contraseña"
              value={nuevaContrasena}
              onChange={handleNuevaContrasenaChange}
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px"
              }}
            />
            <button
              type="button"
              onClick={() => setMostrarContrasena(!mostrarContrasena)}
              style={{
                marginBottom: "10px",
                background: "none",
                border: "none",
                color: "#007bff",
                cursor: "pointer"
              }}
            >
              {mostrarContrasena ? "Ocultar contraseña" : "Ver contraseña"}
            </button>

            <input
              type={mostrarConfirmar ? "text" : "password"}
              placeholder="Confirmar contraseña"
              value={confirmarContrasena}
              onChange={handleConfirmarContrasenaChange}
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px"
              }}
            />
            <button
              type="button"
              onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
              style={{
                marginBottom: "10px",
                background: "none",
                border: "none",
                color: "#007bff",
                cursor: "pointer"
              }}
            >
              {mostrarConfirmar ? "Ocultar contraseña" : "Ver contraseña"}
            </button>

            <button
              onClick={handleActualizarContrasena}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
              disabled={cargando}
            >
              {cargando ? "Cambiando..." : "Actualizar contraseña"}
            </button>
            {mensaje && <p style={{ color: "red" }}>{mensaje}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecuperarContrasena;
