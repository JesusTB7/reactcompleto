import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import "./styles.css";

const PaisList = () => {
    const [paises, setPaises] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const paisesPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("https://startupvje.vje.x10.mx/country/paises", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(response => {
            setPaises(response.data);
        })
        .catch(error => console.error("Error al obtener países:", error));
    }, []);

    const handleDelete = (id) => {
        if (window.confirm("¿Seguro que deseas borrar este país?")) {
            axios.delete(`https://startupvje.vje.x10.mx/country/eliminarpais/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            })
            .then(() => {
                setPaises(prevPaises => prevPaises.filter(pais => pais.id_pais !== id));
            })
            .catch(error => console.error("Error al eliminar país:", error));
        }
    };

    const handleDownloadExcel = () => {
        const dataToExport = filteredPaises.map(({ nombre }) => ({ nombre }));
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Países");
        XLSX.writeFile(workbook, "Lista_Paises.xlsx");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/users/login");
    };

    const handleRegresar = () => {
        navigate("/principal");
    };

    const filteredPaises = paises.filter(pais =>
        pais.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastPais = currentPage * paisesPerPage;
    const indexOfFirstPais = indexOfLastPais - paisesPerPage;
    const currentPaises = filteredPaises.slice(indexOfFirstPais, indexOfLastPais);

    return (
        <div>
            <h2>Lista de Países</h2>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
                <input
                    type="text"
                    placeholder="Buscar país"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: "250px" }}
                />
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px", gap: "10px" }}>
                <Link to="/country/crearpais">
                    <button style={{ fontSize: "12px", padding: "5px 10px" }}>Agregar País</button>
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
                        <th>PAIS</th>
                        <th>ACCIONES</th>
                    </tr>
                </thead>
                <tbody>
                    {currentPaises.length > 0 ? (
                        currentPaises.map(pais => (
                            <tr key={pais.id_pais}>
                                <td>{pais.id_pais}</td>
                                <td>{pais.nombre}</td>
                                <td>
                                    <Link to={`/country/actualizarpais/${pais.id_pais}`}>
                                        <button>Editar</button>
                                    </Link>
                                    <button onClick={() => handleDelete(pais.id_pais)}>Eliminar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No hay países</td>
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
                    onClick={() => setCurrentPage(prev => (indexOfLastPais < filteredPaises.length ? prev + 1 : prev))}>
                    Siguiente &gt;
                </span>
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

export default PaisList;
