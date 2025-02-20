import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles.css";

const UsuarioList = () => {
    const [usuario, setUsuario] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:3000/api/usuarios", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(response => {
            console.log("Usuarios recibidos:", response.data);
            setUsuario(response.data);
        })
        .catch(error => console.error("Error al obtener usuarios:", error));
    }, []);

    const handleDelete = (id) => {
        if (window.confirm("¿Seguro que deseas borrar este usuario?")) {
            axios.delete(`http://localhost:3000/api/eliminar/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            })
            .then(() => {
                console.log(`Usuario con ID ${id} eliminado`);
                setUsuario(prevUsuarios => prevUsuarios.filter(usuario => usuario.id_usuarios !== id));
            })
            .catch(error => console.error("Error al eliminar usuario:", error));
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");  // Eliminar el token de autenticación
        navigate("/login");  // Redirigir al login
    };

    return (
        <div>
            <h2>Lista de Usuarios</h2>
            <table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido Paterno</th>
            <th>Apellido Materno</th>
            <th>Fecha de Nacimiento</th>
            <th>Sexo</th>
            <th>Correo</th>
            <th>Contrasena</th>
            <th>Acciones</th>
        </tr>
    </thead>
    <tbody>
        {usuario && usuario.length > 0 ? (
            usuario.map(usuario => (
                <tr key={usuario.id_usuarios}>
                    <td>{usuario.id_usuarios}</td> {/* Corrección aquí */}
                    <td>{usuario.nombre}</td>
                    <td>{usuario.app}</td>
                    <td>{usuario.apm}</td>
                    <td>{usuario.fn}</td>
                    <td>{usuario.sexo}</td>
                    <td>{usuario.correo}</td>
                    <td>{usuario.contrasena}</td>
                    <td>
                        <Link to={`/edit/${usuario.id_usuarios}`}>
                            <button>Editar</button>
                        </Link>
                        <button onClick={() => handleDelete(usuario.id_usuarios)}>Eliminar</button>
                    </td>
                </tr>
            ))
        ) : (
            <tr>
                <td colSpan="8">No hay usuarios</td> {/* Ajusté colSpan a 8 para que abarque todas las columnas */}
            </tr>
        )}
    </tbody>
</table>


            <button onClick={handleLogout} style={{ marginBottom: "10px", backgroundColor: "red", color: "white", padding: "20px 30px" ,fontSize: "12px", width: "auto" }}>
                Cerrar Sesión
            </button>


        </div>
    );
};

export default UsuarioList;
