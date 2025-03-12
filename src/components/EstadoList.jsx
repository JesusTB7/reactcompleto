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

const EstadoList = () => {
    const [estados, setEstados] = useState([]);
    const [paises, setPaises] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const estadosPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        // Cargar los estados
        axios
            .get("http://localhost:3000/api/estado", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then((response) => {
                console.log("Estados recibidos:", response.data);
                setEstados(response.data);
            })
            .catch((error) => console.error("Error al obtener estados:", error));

        // Cargar la lista de países
        axios
            .get("http://localhost:3000/api/pais", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then((response) => {
                console.log("Países recibidos:", response.data);
                setPaises(response.data);
            })
            .catch((error) => console.error("Error al obtener países:", error));
    }, []);

    const handleDelete = (id) => {
        if (window.confirm("¿Seguro que deseas borrar este estado?")) {
            axios
                .delete(`http://localhost:3000/api/eliminarestado/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                })
                .then(() => {
                    console.log(`Estado con ID ${id} eliminado`);
                    setEstados((prevEstados) => prevEstados.filter((estado) => estado.id_estado !== id));
                })
                .catch((error) => console.error("Error al eliminar estado:", error));
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleRegresar = () => {
        navigate("/principal");
    };

    const getPaisNombre = (idPais) => {
        // Buscar el nombre del país basado en el id_pais
        const pais = paises.find((pais) => pais.id_pais === idPais);
        return pais ? pais.nombre : "Desconocido"; // Si no se encuentra el país, mostrar "Desconocido"
    };

    const handleDownloadExcel = () => {
        const dataToExport = filteredEstados.map(({ nombre, id_pais }) => ({
            nombre,
            id_pais:getPaisNombre(id_pais)
        }));
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Estados");
        XLSX.writeFile(workbook, "Lista_Estados.xlsx");
    };

    // Filtrar los estados según el término de búsqueda
    const filteredEstados = estados.filter((estado) =>
        estado.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Paginado
    const indexOfLastEstado = currentPage * estadosPerPage;
    const indexOfFirstEstado = indexOfLastEstado - estadosPerPage;
    const currentEstados = filteredEstados.slice(indexOfFirstEstado, indexOfLastEstado);

    // Cambiar de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Contar estados por país
    const estadosPorPais = paises.map((pais) => {
        const estadosDelPais = estados.filter((estado) => estado.id_pais === pais.id_pais);
        return { pais: pais.nombre, cantidad: estadosDelPais.length };
    });

    // Datos para la gráfica
    const chartData = {
        labels: estadosPorPais.map((data) => data.pais),
        datasets: [
            {
                label: "Cantidad de Estados",
                data: estadosPorPais.map((data) => data.cantidad),
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
            <h2>Lista de Estados</h2>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
                <input
                    type="text"
                    placeholder="Buscar estado"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: "250px" }}
                />
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px", gap: "10px" }}>
                <Link to="/crearestado">
                    <button style={{ fontSize: "12px", padding: "5px 10px" }}>Agregar Estado</button>
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
                        width: "fit-content", // Ajusta el ancho al contenido
                    }}
                >
                    Descargar Excel
                </button>
                <button 
    onClick={() => window.location.href = "/importarestado"} 
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
                        <th>ESTADO</th>
                        <th>PAIS</th>
                        <th>ACCIONES</th>
                    </tr>
                </thead>
                <tbody>
                    {currentEstados.length > 0 ? (
                        currentEstados.map((estado) => (
                            <tr key={estado.id_estado}>
                                <td>{estado.id_estado}</td>
                                <td>{estado.nombre}</td>
                                <td>{getPaisNombre(estado.id_pais)}</td>
                                <td>
                                    <Link to={`/editestado/${estado.id_estado}`}>
                                        <button>Editar</button>
                                    </Link>
                                    <button onClick={() => handleDelete(estado.id_estado)}>Eliminar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No hay estados registrados</td>
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
                    onClick={() =>
                        setCurrentPage((prev) =>
                            indexOfLastEstado < filteredEstados.length ? prev + 1 : prev
                        )
                    }
                >
                    Siguiente &gt;
                </span>
            </div>

            {/* Contenedor para la gráfica */}
            <div style={{ marginTop: "20px", textAlign: "center" }}>
                <div
                    style={{
                        width: "80%",
                        maxWidth: "500px", // Límite de ancho
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
                        width: "100px",
                    }}
                >
                    Regresar
                </button>
            </div>
        </div>
    );
};

export default EstadoList;
