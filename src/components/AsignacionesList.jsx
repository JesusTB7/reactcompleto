import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import "./styles.css";

// Registramos los componentes necesarios de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AsignacionesList = () => {
    const [asignaciones, setAsignaciones] = useState([]);
    const [botes, setBotes] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const asignacionesPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        // Cargar asignaciones
        axios.get("http://localhost:5000/asig/asignaciones", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(response => setAsignaciones(response.data))
        .catch(error => console.error("Error al obtener asignaciones:", error));

        // Cargar botes
        axios.get("http://localhost:5000/bot/botes", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(response => setBotes(response.data))
        .catch(error => console.error("Error al obtener botes:", error));

        // Cargar usuarios
        axios.get("http://localhost:5000/users/usuarios", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(response => setUsuarios(response.data))
        .catch(error => console.error("Error al obtener usuarios:", error));
    }, []);

    const handleDelete = (id) => {
        if (window.confirm("¿Seguro que deseas borrar esta asignación?")) {
            axios.delete(`http://localhost:5000/asig/eliminarasignacion/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            })
            .then(() => setAsignaciones(prev => prev.filter(asignacion => asignacion.id_asignacion !== id)))
            .catch(error => console.error("Error al eliminar asignación:", error));
        }
    };

    const handleRegresar = () => navigate("/principal");

    // Función para obtener la clave del bote según el ID
    const getClaveBote = (idBote) => {
        const bote = botes.find(b => b.id_bote === idBote);
        return bote ? bote.clave : "Desconocido";
    };

    // Función para obtener el nombre completo del usuario según el ID
    const getNombreUsuario = (id_usuarios) => {
        const usuario = usuarios.find(u => u.id_usuarios === id_usuarios);
        return usuario ? `${usuario.nombre} ${usuario.app} ${usuario.apm}` : "Desconocido";
    };

    const handleDownloadExcel = () => {
        const dataToExport = filteredAsignaciones.map(({ localidad, id_bote, id_usuarios }) => ({
            localidad,
            id_bote: getClaveBote(id_bote),
            id_usuarios: getNombreUsuario(id_usuarios),
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Asignaciones");
        XLSX.writeFile(workbook, "Lista_Asignaciones.xlsx");
    };

    // Filtrar asignaciones
    const filteredAsignaciones = asignaciones.filter(asignacion =>
        asignacion.localidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getClaveBote(asignacion.id_bote).toLowerCase().includes(searchTerm.toLowerCase()) ||
        getNombreUsuario(asignacion.id_usuarios).toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Paginado
    const indexOfLastAsignacion = currentPage * asignacionesPerPage;
    const indexOfFirstAsignacion = indexOfLastAsignacion - asignacionesPerPage;
    const currentAsignaciones = filteredAsignaciones.slice(indexOfFirstAsignacion, indexOfLastAsignacion);

    // Contar botes por localidad
    const botesPorLocalidad = asignaciones.reduce((acc, asignacion) => {
        const localidad = asignacion.localidad;
        if (acc[localidad]) {
            acc[localidad]++;
        } else {
            acc[localidad] = 1;
        }
        return acc;
    }, {});

    // Datos para la gráfica de botes por localidad
    const chartData = {
        labels: Object.keys(botesPorLocalidad),
        datasets: [
            {
                label: "Cantidad de Botes",
                data: Object.values(botesPorLocalidad),
                backgroundColor: "#4caf50",
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div>
            <h2>Lista de Asignaciones</h2>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
                <input
                    type="text"
                    placeholder="Buscar por localidad, clave del bote o nombre de usuario"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: "450px" }}
                />
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px", gap: "10px" }}>
                <Link to="/asig/crearasignacion">
                    <button style={{ fontSize: "12px", padding: "5px 10px" }}>Agregar Asignación</button>
                </Link>
                <button 
                    onClick={handleDownloadExcel} 
                    style={{ 
                        backgroundColor: "green", 
                        color: "white", 
                        fontSize: "12px", 
                        padding: "5px 10px", 
                        marginBottom: "10px", 
                        gap: "10px", 
                        display: "flex", 
                        justifyContent: "center", 
                        width: "fit-content" /* Ajusta el ancho al contenido */
                    }}>
                    Descargar Excel
                </button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>LOCALIDAD</th>
                        <th>BOTE</th>
                        <th>USUARIO</th>
                        <th>ACCIONES</th>
                    </tr>
                </thead>
                <tbody>
                    {currentAsignaciones.length > 0 ? (
                        currentAsignaciones.map(asignacion => (
                            <tr key={asignacion.id_asignacion}>
                                <td>{asignacion.id_asignacion}</td>
                                <td>{asignacion.localidad}</td>
                                <td>{getClaveBote(asignacion.id_bote)}</td>
                                <td>{getNombreUsuario(asignacion.id_usuarios)}</td>
                                <td>
                                    <Link to={`/asig/actualizarasignacion/${asignacion.id_asignacion}`}>
                                        <button>Editar</button>
                                    </Link>
                                    <button onClick={() => handleDelete(asignacion.id_asignacion)}>Eliminar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No hay asignaciones registradas</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div style={{ marginTop: "10px", textAlign: "center", fontSize: "14px" }}>
                <span
                    style={{ cursor: "pointer", marginRight: "10px" }}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
                    &lt; Anterior
                </span>
                <span> Página {currentPage} </span>
                <span
                    style={{ cursor: "pointer", marginLeft: "10px" }}
                    onClick={() => setCurrentPage(prev => (indexOfLastAsignacion < filteredAsignaciones.length ? prev + 1 : prev))}>
                    Siguiente &gt;
                </span>
            </div>

            {/* Contenedor para la gráfica de botes por localidad */}
            <div style={{ marginTop: "20px", textAlign: "center" }}>
                <div
                    style={{
                        width: "60%",
                        maxWidth: "400px",
                        margin: "20px auto", // Centrar el contenedor
                    }}
                >
                    <Bar data={chartData} options={chartOptions} />
                </div>
            </div>

            <div style={{ marginTop: "10px", textAlign: "center" }}>
                <button 
                    onClick={handleRegresar} 
                    style={{ 
                        backgroundColor: "red", 
                        color: "white", 
                        fontSize: "12px", 
                        padding: "5px 10px", 
                        border: "none", 
                        borderRadius: "5px", 
                        cursor: "pointer",
                        width: "100px"
                    }}
                >
                    Regresar
                </button>
            </div>
        </div>
    );
};

export default AsignacionesList;
