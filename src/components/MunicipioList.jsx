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

const MunicipioList = () => {
    const [municipios, setMunicipios] = useState([]);
    const [estados, setEstados] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const municipiosPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        // Cargar los municipios
        axios
            .get("https://startupvje.vje.x10.mxhttps://3.145.49.233/muni/municipios", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            })
            .then(response => {
                console.log("Municipios recibidos:", response.data);
                setMunicipios(response.data);
            })
            .catch(error => console.error("Error al obtener municipios:", error));

        // Cargar la lista de estados
        axios
            .get("https://startupvje.vje.x10.mx/state/estados", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            })
            .then(response => {
                console.log("Estados recibidos:", response.data);
                setEstados(response.data);
            })
            .catch(error => console.error("Error al obtener estados:", error));
    }, []);

    const handleDelete = (id) => {
        if (window.confirm("¿Seguro que deseas borrar este municipio?")) {
            axios
                .delete(`https://startupvje.vje.x10.mx/muni/eliminarmunicipio/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                })
                .then(() => {
                    console.log(`Municipio con ID ${id} eliminado`);
                    setMunicipios(prevMunicipios => prevMunicipios.filter(municipio => municipio.id_municipio !== id));
                })
                .catch(error => console.error("Error al eliminar municipio:", error));
        }
    };

    const handleRegresar = () => {
        navigate("/principal");
    };

    const getEstadoNombre = (idEstado) => {
        // Buscar el nombre del estado basado en el id_estado
        const estado = estados.find(estado => estado.id_estado === idEstado);
        return estado ? estado.nombre : "Desconocido";  // Si no se encuentra el estado, mostrar "Desconocido"
    };

    const handleDownloadExcel = () => {
        const dataToExport = filteredMunicipios.map(({ nombre, id_estado }) => ({
            nombre,
            id_estado:getEstadoNombre(id_estado) // Aquí usamos la función para obtener el nombre del estado
        }));
    
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Municipios");
        XLSX.writeFile(workbook, "Lista_Municipios.xlsx");
    };

    // Filtrar los municipios según el término de búsqueda
    const filteredMunicipios = municipios.filter(municipio =>
        municipio.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Paginado
    const indexOfLastMunicipio = currentPage * municipiosPerPage;
    const indexOfFirstMunicipio = indexOfLastMunicipio - municipiosPerPage;
    const currentMunicipios = filteredMunicipios.slice(indexOfFirstMunicipio, indexOfLastMunicipio);

    // Cambiar de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Contar municipios por estado
    const municipiosPorEstado = estados.map((estado) => {
        const municipiosDelEstado = municipios.filter((municipio) => municipio.id_estado === estado.id_estado);
        return { estado: estado.nombre, cantidad: municipiosDelEstado.length };
    });

    // Datos para la gráfica
    const chartData = {
        labels: municipiosPorEstado.map((data) => data.estado),
        datasets: [
            {
                label: "Cantidad de Municipios",
                data: municipiosPorEstado.map((data) => data.cantidad),
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
            <h2>Lista de Municipios</h2>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
                <input
                    type="text"
                    placeholder="Buscar municipio"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: "250px" }}
                />
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px", gap: "10px" }}>
                <Link to="/muni/crearmunicipio">
                    <button style={{ fontSize: "12px", padding: "5px 10px" }}>Agregar Municipio</button>
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
                    }}
                >
                    Descargar Excel
                </button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>MUNICIPIO</th>
                        <th>ESTADO</th>
                        <th>ACCIONES</th>
                    </tr>
                </thead>
                <tbody>
                    {currentMunicipios.length > 0 ? (
                        currentMunicipios.map(municipio => (
                            <tr key={municipio.id_municipio}>
                                <td>{municipio.id_municipio}</td>
                                <td>{municipio.nombre}</td>
                                <td>{getEstadoNombre(municipio.id_estado)}</td>
                                <td>
                                    <Link to={`/muni/actualizarmunicipio/${municipio.id_municipio}`}>
                                        <button>Editar</button>
                                    </Link>
                                    <button onClick={() => handleDelete(municipio.id_municipio)}>Eliminar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No hay municipios registrados</td>
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
                    onClick={() => setCurrentPage(prev => (indexOfLastMunicipio < filteredMunicipios.length ? prev + 1 : prev))}>
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
                        width: "100px"
                    }}
                >
                    Regresar
                </button>
            </div>
        </div>
    );
};

export default MunicipioList;
