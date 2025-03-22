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

const MantenimientoList = () => {
    const [mantenimientos, setMantenimientos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [botes, setBotes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const mantenimientosPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        // Cargar mantenimientos
        axios.get("http://localhost:5000/mant/mantenimientos", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(response => {
            console.log("Mantenimientos recibidos:", response.data);
            setMantenimientos(response.data);
        })
        .catch(error => console.error("Error al obtener mantenimientos:", error));

        // Cargar usuarios
        axios.get("http://localhost:5000/users/usuarios", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(response => {
            console.log("Usuarios recibidos:", response.data);
            setUsuarios(response.data);
        })
        .catch(error => console.error("Error al obtener usuarios:", error));

        // Cargar botes
        axios.get("http://localhost:5000/bot/botes", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(response => {
            console.log("Botes recibidos:", response.data);
            setBotes(response.data);
        })
        .catch(error => console.error("Error al obtener botes:", error));
    }, []);

    const handleDelete = (id) => {
        if (window.confirm("¿Seguro que deseas borrar este mantenimiento?")) {
            axios.delete(`http://localhost:5000/mant/eliminarmantenimiento/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            })
            .then(() => {
                console.log(`Mantenimiento con ID ${id} eliminado`);
                setMantenimientos(prevMantenimientos => prevMantenimientos.filter(mantenimiento => mantenimiento.id_mantenimiento !== id));
            })
            .catch(error => console.error("Error al eliminar mantenimiento:", error));
        }
    };

    const handleRegresar = () => {
        navigate("/principal");
    };

    // Función para obtener el nombre completo del usuario
    const getUsuarioNombre = (id_usuarios) => {
        const usuario = usuarios.find(usuario => usuario.id_usuarios === id_usuarios);
        return usuario ? `${usuario.nombre} ${usuario.app} ${usuario.apm}` : "Desconocido";
    };

    // Función para obtener la clave del bote
    const getBoteNombre = (id_bote) => {
        const bote = botes.find(bote => bote.id_bote === id_bote);
        return bote ? bote.clave : "Desconocido";
    };

    const handleDownloadExcel = () => {
        const dataToExport = filteredMantenimientos.map(({ fecha_mantenimiento, id_usuarios, id_bote}) => ({
            fecha_mantenimiento,
            id_usuarios: getUsuarioNombre(id_usuarios),
            id_bote: getBoteNombre(id_bote)
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Mantenimiento");
        XLSX.writeFile(workbook, "Lista_Mantenimientos.xlsx");
    };

    // Filtrar mantenimientos
    const filteredMantenimientos = mantenimientos.filter(mantenimiento =>
        getUsuarioNombre(mantenimiento.id_usuarios).toLowerCase().includes(searchTerm.toLowerCase()) ||
        getBoteNombre(mantenimiento.id_bote).toLowerCase().includes(searchTerm.toLowerCase()) ||
        mantenimiento.id_mantenimiento.toString().includes(searchTerm)
    );

    // Paginado
    const indexOfLastMantenimiento = currentPage * mantenimientosPerPage;
    const indexOfFirstMantenimiento = indexOfLastMantenimiento - mantenimientosPerPage;
    const currentMantenimientos = filteredMantenimientos.slice(indexOfFirstMantenimiento, indexOfLastMantenimiento);

    // Contar botes por usuario
    const botesPorUsuario = mantenimientos.reduce((acc, mantenimiento) => {
        const usuario = getUsuarioNombre(mantenimiento.id_usuarios);
        if (acc[usuario]) {
            acc[usuario]++;
        } else {
            acc[usuario] = 1;
        }
        return acc;
    }, {});

    // Datos para la gráfica de botes por usuario
    const chartData = {
        labels: Object.keys(botesPorUsuario),
        datasets: [
            {
                label: "Cantidad de Botes Asignados",
                data: Object.values(botesPorUsuario),
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
            <h2>Lista de Mantenimientos</h2>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
                <input
                    type="text"
                    placeholder="Buscar mantenimiento por ID, Usuario o Bote"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: "350px" }}
                />
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px", gap:"10px" }}>
                <Link to="/mant/crearmantenimiento">
                    <button style={{ fontSize: "12px", padding: "5px 10px" }}>Agregar Mantenimiento</button>
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
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Fecha de Mantenimiento</th>
                        <th>Usuario</th>
                        <th>Bote</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentMantenimientos.length > 0 ? (
                        currentMantenimientos.map(mantenimiento => (
                            <tr key={mantenimiento.id_mantenimiento}>
                                <td>{mantenimiento.id_mantenimiento}</td>
                                <td>{mantenimiento.fecha_mantenimiento}</td>
                                <td>{getUsuarioNombre(mantenimiento.id_usuarios)}</td>
                                <td>{getBoteNombre(mantenimiento.id_bote)}</td>
                                <td>
                                    <Link to={`/mant/actualizarmantenimiento/${mantenimiento.id_mantenimiento}`}>
                                        <button>Editar</button>
                                    </Link>
                                    <button onClick={() => handleDelete(mantenimiento.id_mantenimiento)}>Eliminar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No hay mantenimientos registrados</td>
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
                    onClick={() => setCurrentPage(prev => (indexOfLastMantenimiento < filteredMantenimientos.length ? prev + 1 : prev))}>
                    Siguiente &gt;
                </span>
            </div>

            {/* Contenedor para la gráfica de botes asignados a usuarios */}
            <div style={{ marginTop: "20px", textAlign: "center" }}>
                <div
                    style={{
                        width: "80%",
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

export default MantenimientoList;
