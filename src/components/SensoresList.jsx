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
    Legend
} from "chart.js";
import "./styles.css";

// Registramos los componentes necesarios de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SensoresList = () => {
    const [sensores, setSensores] = useState([]);
    const [botes, setBotes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const sensoresPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        // Cargar los sensores
        axios.get("http://localhost:3000/api/sensor", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(response => {
            console.log("Sensores recibidos:", response.data);
            setSensores(response.data);
        })
        .catch(error => console.error("Error al obtener sensores:", error));

        // Cargar la lista de botes
        axios.get("http://localhost:3000/api/bote", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(response => {
            console.log("Botes recibidos:", response.data);
            setBotes(response.data);
        })
        .catch(error => console.error("Error al obtener botes:", error));
    }, []);

    const handleDelete = (id) => {
        if (window.confirm("¿Seguro que deseas borrar este sensor?")) {
            axios.delete(`http://localhost:3000/api/eliminarsensor/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            })
            .then(() => {
                console.log(`Sensor con ID ${id} eliminado`);
                setSensores(prevSensores => prevSensores.filter(sensor => sensor.id_sensor !== id));
            })
            .catch(error => console.error("Error al eliminar sensor:", error));
        }
    };

    const handleRegresar = () => {
        navigate("/principal");
    };

    const getBoteNombre = (idBote) => {
        const bote = botes.find(bote => bote.id_bote === idBote);
        return bote ? bote.clave : "Desconocido";
    };

    const handleDownloadExcel = () => {
        const dataToExport = filteredSensores.map(({  estado, id_bote}) => ({
            estado,
            id_bote: getBoteNombre(id_bote)
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sensores");
        XLSX.writeFile(workbook, "Lista_Sensores.xlsx");
    };

    // Filtrado
    const filteredSensores = sensores.filter(sensor =>
        sensor.id_sensor.toString().includes(searchTerm) ||
        getBoteNombre(sensor.id_bote).toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Paginado
    const indexOfLastSensor = currentPage * sensoresPerPage;
    const indexOfFirstSensor = indexOfLastSensor - sensoresPerPage;
    const currentSensores = filteredSensores.slice(indexOfFirstSensor, indexOfLastSensor);

    // Cambiar de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Contar sensores activos e inactivos
    const sensoresStatus = {
        activo: sensores.filter(sensor => sensor.estado.toLowerCase() === "activo").length,
        inactivo: sensores.filter(sensor => sensor.estado.toLowerCase() === "inactivo").length,
    };

    // Datos para la gráfica
    const chartData = {
        labels: ["Activos", "Inactivos"],
        datasets: [
            {
                label: "Cantidad de Sensores",
                data: [sensoresStatus.activo, sensoresStatus.inactivo],
                backgroundColor: ["#4caf50", "#f44336"],
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
            <h2>Lista de Sensores</h2>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
                <input
                    type="text"
                    placeholder="Buscar por ID del Sensor o Bote"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: "250px" }}
                />
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px", gap:"10px" }}>
                <Link to="/crearsensor">
                    <button style={{ fontSize: "12px", padding: "5px 10px" }}>Agregar Sensor</button>
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
                        width: "fit-content" 
                    }}
                >
                    Descargar Excel
                </button>
                <button 
    onClick={() => window.location.href = "/importarsensor"} 
    style={{ 
        backgroundColor: "skyblue",
        color: "black", 
        fontSize: "12px", 
        padding: "5px 10px", 
        marginBottom: "10px", 
        gap: "10px", 
        display: "flex", 
        justifyContent: "center", 
        width: "fit-content"
    }}>
    Importar
</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>ESTADO SENSOR</th>
                        <th>BOTE</th>
                        <th>ACCIONES</th>
                    </tr>
                </thead>
                <tbody>
                    {currentSensores.length > 0 ? (
                        currentSensores.map(sensor => (
                            <tr key={sensor.id_sensor}>
                                <td>{sensor.id_sensor}</td>
                                <td>{sensor.estado}</td>
                                <td>{getBoteNombre(sensor.id_bote)}</td>
                                <td>
                                    <Link to={`/editsensor/${sensor.id_sensor}`}>
                                        <button>Editar</button>
                                    </Link>
                                    <button onClick={() => handleDelete(sensor.id_sensor)}>Eliminar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No hay sensores registrados</td>
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
                    onClick={() => setCurrentPage(prev => (indexOfLastSensor < filteredSensores.length ? prev + 1 : prev))}>
                    Siguiente &gt;
                </span>
            </div>

            {/* Contenedor para la gráfica */}
            <div style={{ marginTop: "20px", textAlign: "center" }}>
                <div
                    style={{
                        width: "80%",
                        maxWidth: "400px", // Límite de ancho
                        margin: "20px auto", // Centrar el contenedor
                    }}
                >
                    <Bar data={chartData} options={chartOptions} />
                </div>
            </div>

            {/* Botón Regresar */}
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

export default SensoresList;
