import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';

const ImpUsuarios = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Por favor selecciona un archivo');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet);

      console.log(rows);

      try {
        for (const row of rows) {
          const { nombre, app, apm, fn, sexo, correo, contrasena } = row;
          const usuario = { nombre, app, apm, fn, sexo, correo, contrasena };
          await axios.post('https://startupvje.vje.x10.mx/users/crearusuario', usuario);
        }
        alert('Datos cargados correctamente');
        navigate('/users/usuarios');
      } catch (error) {
        console.error('Error al cargar los datos:', error);
        alert('Hubo un error al cargar los datos');
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', textAlign: 'center', padding: '20px', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ color: '#333' }}>Cargar Usuarios desde Excel</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} style={{ marginBottom: '10px', padding: '5px', border: '1px solid #ccc', borderRadius: '5px' }} />
      <br />
      <button onClick={handleUpload} style={{ padding: '10px 15px', margin: '5px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        Subir
      </button>
      <button onClick={() => navigate('/users/usuarios')} style={{ padding: '10px 15px', margin: '5px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        Cancelar
      </button>
    </div>
  );
};

export default ImpUsuarios;