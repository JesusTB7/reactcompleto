import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import axios from "axios";
import { Bar } from "react-chartjs-2"; // Importa la gráfica
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js"; // Importa componentes de Chart.js
import "./styles.css";

// Registramos los componentes necesarios de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UsuarioList = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:5000/users/usuarios", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(response => {
            setUsuarios(response.data);
        })
        .catch(error => console.error("Error al obtener usuarios:", error));
    }, []);

    const handleDelete = (id) => {
        if (window.confirm("¿Seguro que deseas borrar este usuario?")) {
            axios.delete(`http://localhost:5000/users/eliminarusuario/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            })
            .then(() => {
                setUsuarios(prevUsuarios => prevUsuarios.filter(usuario => usuario.id_usuarios !== id));
            })
            .catch(error => console.error("Error al eliminar usuario:", error));
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/users/login");
    };

    const handleRegresar = () => {
        navigate("/principal");
    };

    const handleDownloadExcel = () => {
        const dataToExport = filteredUsers.map(({ nombre, app, apm, fn, sexo, correo, contrasena }) => ({
            nombre,
            app,
            apm,
            fn,
            sexo,
            correo,
            contrasena
        }));
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");
        XLSX.writeFile(workbook, "Lista_Usuarios.xlsx");
    };

    // Filtrado de usuarios basado en el nombre o correo
    const filteredUsers = usuarios.filter(usuario =>
        usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.correo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Cálculo del paginado
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    // Cambiar de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Contar usuarios por sexo
    const sexoCounts = usuarios.reduce((acc, usuario) => {
        const sexo = usuario.sexo;
        acc[sexo] = (acc[sexo] || 0) + 1;
        return acc;
    }, {});

    // Datos para la gráfica
    const chartData = {
        labels: Object.keys(sexoCounts),
        datasets: [
            {
                label: "Usuarios por Sexo",
                data: Object.values(sexoCounts),
                backgroundColor: ["#4caf50", "#ff9800"], // Colores para masculino y femenino
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
            <h2>Lista de Usuarios</h2>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
                <input
                    type="text"
                    placeholder="Buscar usuario"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: "250px" }}
                />
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px", gap:"10px" }}>
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
                <button 
    onClick={() => window.location.href = "/users/importarusuario"} 
    style={{ 
        backgroundColor: "skyblue", /* Corregido el color */
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
                        <th>NOMBRE</th>
                        <th>APELLIDO PATERNO</th>
                        <th>APELLIDO MATERNO</th>
                        <th>FECHA DE NACIMIENTO</th>
                        <th>SEXO</th>
                        <th>CORREO</th>
                        <th>CONTRASEÑA</th>
                        <th>ACCIONES</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.length > 0 ? (
                        currentUsers.map(usuario => (
                            <tr key={usuario.id_usuarios}>
                                <td>{usuario.id_usuarios}</td>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.app}</td>
                                <td>{usuario.apm}</td>
                                <td>{usuario.fn}</td>
                                <td>{usuario.sexo}</td>
                                <td>{usuario.correo}</td>
                                <td>{usuario.contrasena}</td>
                                <td>
                                    <Link to={`/users/actualizarusuario/${usuario.id_usuarios}`}>
                                        <button>Editar</button>
                                    </Link>
                                    <button onClick={() => handleDelete(usuario.id_usuarios)}>Eliminar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9">No hay usuarios</td>
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
                    onClick={() => setCurrentPage(prev => (indexOfLastUser < filteredUsers.length ? prev + 1 : prev))}>
                    Siguiente &gt;
                </span>
            </div>

            {/* Contenedor para la gráfica de usuarios por sexo */}
            <div style={{ marginTop: "20px", textAlign: "center" }}>
                <div style={{ width: "60%", maxWidth: "400px", margin: "20px auto" }}>
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

export default UsuarioList;
