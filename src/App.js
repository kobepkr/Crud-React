import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [personas, setPersonas] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState(null);

  const API = 'http://localhost:5000/personas';

  // Cargar personas al iniciar
  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(data => setPersonas(data))
      .catch(err => console.error('Error cargando personas:', err));
  }, []);

  const limpiarFormulario = () => {
    setNombre('');
    setEmail('');
    setModoEdicion(false);
    setIdEditando(null);
  };

  const manejarSubmit = (e) => {
    e.preventDefault();

    const datos = { nombre, email };

    if (modoEdicion) {
      // Actualizar persona
      fetch(`${API}/${idEditando}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      })
        .then(res => res.json())
        .then(personaActualizada => {
          setPersonas(personas.map(p => (p.id === idEditando ? personaActualizada : p)));
          limpiarFormulario();
        });
    } else {
      // Crear persona
      fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      })
        .then(res => res.json())
        .then(personaNueva => {
          setPersonas([...personas, personaNueva]);
          limpiarFormulario();
        });
    }
  };

  const editar = (persona) => {
    setNombre(persona.nombre);
    setEmail(persona.email);
    setModoEdicion(true);
    setIdEditando(persona.id);
  };

  const eliminar = (id) => {
    if (!window.confirm('¿Eliminar este registro?')) return;

    fetch(`${API}/${id}`, { method: 'DELETE' })
      .then(() => {
        setPersonas(personas.filter(p => p.id !== id));
      });
  };

  return (
    <div className="container">
      <h1>CRUD con React + Flask</h1>

      <form onSubmit={manejarSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">{modoEdicion ? 'Actualizar' : 'Agregar'}</button>
        {modoEdicion && (
          <button type="button" onClick={limpiarFormulario}>Cancelar</button>
        )}
        <button onClick={() => {
  fetch(API)
    .then(res => res.json())
    .then(data => setPersonas(data))
    .catch(err => console.error('Error cargando personas:', err));
}}>
  Listar personas
</button>

      </form>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {personas.map(p => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>{p.email}</td>
              <td>
                <button onClick={() => editar(p)}>Editar</button>
                <button onClick={() => eliminar(p.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
