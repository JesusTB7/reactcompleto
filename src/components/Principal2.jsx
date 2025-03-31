import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "./styles.css";

const Principal2 = () => {
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [botes, setBotes] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const getMunicipioNombre = (id_municipio) => {
        const municipio = municipios.find((m) => m.id_municipio === id_municipio);
        return municipio ? municipio.nombre : "Desconocido";
    };

    const fetchBotes = () => {
        axios
            .get("https://startupvje.vje.x10.mx/bot/botes", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then((response) => {
                setBotes(response.data);
                setIsLoading(false);

                const bote = response.data.find(bote => bote.id_bote === 1);
                if (bote && bote.estado_sensor === "Activo") {
                    setAlertMessage(`⚠️ ¡Alerta! El bote con clave ${bote.clave} está lleno.`);
                    setShowAlert(true);
                } else {
                    setShowAlert(false);
                }
            })
            .catch((error) => {
                console.error("Error al obtener botes:", error);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchBotes();
        const interval = setInterval(fetchBotes, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        axios
            .get("https://startupvje.vje.x10.mx/muni/municipios", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then((response) => {
                setMunicipios(response.data);
            })
            .catch((error) => console.error("Error al obtener municipios:", error));
    }, []);

    const handleLogout = () => {
        setIsLoggingOut(true);
        localStorage.removeItem("token");
        setTimeout(() => {
            navigate("/users/login");
        }, 1000);
    };

    return (
        <div style={{ backgroundColor: "#ffffff", height: "100vh", color: "black", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                    position: "fixed", top: 0, width: "90%", display: "flex",
                    justifyContent: "space-between", alignItems: "center", padding: "15px 20px",
                    backgroundColor: "#f0f0f0", boxShadow: "0px 4px 10px rgba(0,0,0,0.3)", zIndex: 1000,
                    borderRadius: "10px", marginTop: "10px"
                }}
            >
                <motion.img
                    src="/img/Logo.jpg"
                    alt="Logo"
                    style={{ height: "50px", objectFit: "contain", border: "2px solid black", borderRadius: "5px", padding: "2px" }}
                />
                <motion.button
                    onClick={handleLogout}
                    whileHover={{ scale: 1.1, backgroundColor: "#d32f2f" }}
                    whileTap={{ scale: 0.9 }}
                    animate={{ opacity: isLoggingOut ? 0.5 : 1 }}
                    style={{
                        backgroundColor: "#f44336", color: "white", padding: "12px 18px",
                        border: "none", cursor: "pointer", fontSize: "16px", borderRadius: "10px",
                        fontWeight: "bold", transition: "background-color 0.3s ease"
                    }}
                    disabled={isLoggingOut}
                >
                    {isLoggingOut ? "Cerrando..." : "Cerrar sesión"}
                </motion.button>
            </motion.div>

            {showAlert && (
                <div style={{
                    backgroundColor: "red", color: "white", padding: "10px",
                    borderRadius: "5px", position: "fixed", top: "80px", left: "50%",
                    transform: "translateX(-50%)", zIndex: 1000, fontWeight: "bold"
                }}>
                    {alertMessage}
                </div>
            )}

            <div style={{ marginTop: "150px", width: "80%" }}>
                <h2>Información de Botes en el Municipio de Lerma</h2>
                {isLoading ? (
                    <p>Cargando datos...</p>
                ) : (
                    <table border="1" style={{ width: "80%", textAlign: "left", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th>BOTE</th>
                                <th>CLAVE</th>
                                <th>MUNICIPIO</th>
                                <th>DIRECCIÓN</th>
                                <th>ESTADO</th>
                            </tr>
                        </thead>
                        <tbody>
                            {botes.length > 0 ? (
                                botes.map((bote) => (
                                    <tr key={bote.id_bote}>
                                        <td><img src={"https://static.grainger.com/rp/s/is/image/Grainger/28T871_AS01?$zmmain$"} alt="Bote" style={{ width: "50px", height: "50px" }} /></td>
                                        <td>{bote.clave}</td>
                                        <td>{getMunicipioNombre(bote.id_municipio)}</td>
                                        <td>{bote.direccion}</td>
                                        <td>
                                            <motion.div
                                                style={{
                                                    width: "30px", height: "30px", borderRadius: "50%", backgroundColor: bote.estado_sensor === "Activo" ? "green" : bote.estado_sensor === "Lleno" ? "red" : "gray",
                                                    transition: "background-color 0.5s ease"
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">No hay datos disponibles</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Principal2;
