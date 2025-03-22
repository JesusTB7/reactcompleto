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

const BotesList = () => {
    const [botes, setBotes] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const botesPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        // Cargar la lista de botes
        axios
            .get("http://localhost:5000/bot/botes", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then((response) => {
                console.log("Botes recibidos:", response.data);
                setBotes(response.data);
            })
            .catch((error) => console.error("Error al obtener botes:", error));

        // Cargar la lista de municipios
        axios
            .get("http://localhost:5000/muni/municipios", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then((response) => {
                console.log("Municipios recibidos:", response.data);
                setMunicipios(response.data);
            })
            .catch((error) => console.error("Error al obtener municipios:", error));
    }, []);

    const handleDelete = (id) => {
        if (window.confirm("¿Seguro que deseas borrar este bote?")) {
            axios
                .delete(`http://localhost:5000/bot/eliminarbote/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                })
                .then(() => {
                    console.log(`Bote con ID ${id} eliminado`);
                    setBotes((prevBotes) => prevBotes.filter((bote) => bote.id_bote !== id));
                })
                .catch((error) => console.error("Error al eliminar bote:", error));
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/users/login");
    };

    const handleRegresar = () => {
        navigate("/principal");
    };

    const getMunicipioNombre = (idMunicipio) => {
        const municipio = municipios.find((m) => m.id_municipio === idMunicipio);
        return municipio ? municipio.nombre : "Desconocido";
    };

    const handleDownloadExcel = () => {
        const dataToExport = filteredBotes.map(({ clave, id_municipio, direccion, estado_sensor }) => ({
            clave,
            id_municipio: getMunicipioNombre(id_municipio),
            direccion,
            estado_sensor
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Botes");
        XLSX.writeFile(workbook, "Lista_Botes.xlsx");
    };

    // Filtrar los botes según el término de búsqueda
    const filteredBotes = botes.filter(
        (bote) =>
            bote.clave.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bote.direccion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Paginado
    const indexOfLastBote = currentPage * botesPerPage;
    const indexOfFirstBote = indexOfLastBote - botesPerPage;
    const currentBotes = filteredBotes.slice(indexOfFirstBote, indexOfLastBote);

    // Contar botes por municipio
    const botesPorMunicipio = municipios.map((municipio) => {
        const botesDelMunicipio = botes.filter((bote) => bote.id_municipio === municipio.id_municipio);
        return { municipio: municipio.nombre, cantidad: botesDelMunicipio.length };
    });

    // Datos para la gráfica
    const chartData = {
        labels: botesPorMunicipio.map((data) => data.municipio),
        datasets: [
            {
                label: "Cantidad de Botes",
                data: botesPorMunicipio.map((data) => data.cantidad),
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
            <h2>Lista de Botes</h2>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
                <input
                    type="text"
                    placeholder="Buscar bote por clave o dirección"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: "250px" }}
                />
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px", gap: "10px" }}>
                <Link to="/bot/crearbote">
                    <button style={{ fontSize: "12px", padding: "5px 10px" }}>Agregar Bote</button>
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
                        width: "fit-content",
                    }}
                >
                    Descargar Excel
                </button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>CLAVE</th>
                        <th>MUNICIPIO</th>
                        <th>DIRECCION</th>
                        <th>ESTADO SENSOR</th>
                        <th>ACCIONES</th>
                    </tr>
                </thead>
                <tbody>
                    {currentBotes.length > 0 ? (
                        currentBotes.map((bote) => (
                            <tr key={bote.id_bote}>
                                <td>{bote.id_bote}</td>
                                <td>{bote.clave}</td>
                                <td>{getMunicipioNombre(bote.id_municipio)}</td>
                                <td>{bote.direccion}</td>
                                <td>{bote.estado_sensor}</td>
                                <td>
                                    <Link to={`/bot/actualizarbote/${bote.id_bote}`}>
                                        <button>Editar</button>
                                    </Link>
                                    <button onClick={() => handleDelete(bote.id_bote)}>Eliminar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No hay botes registrados</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div style={{ marginTop: "10px", textAlign: "center", fontSize: "14px" }}>
                <span
                    style={{ cursor: "pointer", marginRight: "10px" }}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                    &lt; Anterior
                </span>
                <span> Página {currentPage} </span>
                <span
                    style={{ cursor: "pointer", marginLeft: "10px" }}
                    onClick={() => setCurrentPage((prev) => (indexOfLastBote < filteredBotes.length ? prev + 1 : prev))}
                >
                    Siguiente &gt;
                </span>
            </div>

            {/* Contenedor para la gráfica */}
            <div style={{ marginTop: "20px", textAlign: "center" }}>
                <div
                    style={{
                        width: "80%",
                        maxWidth: "500px",
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
                        width: "100px",
                    }}
                >
                    Regresar
                </button>
            </div>
        </div>
    );
};

export default BotesList;
