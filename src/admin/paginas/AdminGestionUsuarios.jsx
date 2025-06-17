import React, { useState, useEffect } from "react";
import "./AdminGestionUsuarios.css";

const AdminGestionUsuarios = () => {
  const isAdmin = true;

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtroEmail, setFiltroEmail] = useState("");

  const usuariosSimuladosIniciales = [
    {
      uid: "user1_uid",
      email: "juancarlos@example.com",
      nombre: "Juan",
      apellido: "Carlos",
      rol: "cliente",
      habilitado: true,
    },
    {
      uid: "user2_uid",
      email: "marielarodriguez@example.com",
      nombre: "Mariela",
      apellido: "Rodriguez",
      rol: "cliente",
      habilitado: true,
    },
    {
      uid: "admin_uid",
      email: "admin@admin.com",
      nombre: "Admin",
      apellido: "Principal",
      rol: "administrador",
      habilitado: true,
    },
    {
      uid: "user3_uid",
      email: "martinmoron@example.com",
      nombre: "Martin",
      apellido: "Moron",
      rol: "cliente",
      habilitado: false,
    },
  ];

  useEffect(() => {
    if (isAdmin) {
      setLoading(true);
      setError("");
      setTimeout(() => {
        setUsuarios(usuariosSimuladosIniciales);
        setLoading(false);
      }, 500);
    } else {
      setError("Access denied. You do not have permission to view this page.");
      setLoading(false);
    }
  }, [isAdmin]);

  const handleVerDetalles = (userId) => {
    const usuario = usuarios.find((u) => u.uid === userId);
    if (usuario) {
      alert(
        `User  Details (Simulated):
ID: ${usuario.uid}
Email: ${usuario.email}
Name: ${usuario.nombre} ${usuario.apellido}
Role: ${usuario.rol}
Enabled: ${usuario.habilitado}`
      );
    }
  };

  const handleCambiarRol = (userId, nuevoRol) => {
    setUsuarios((prevUsuarios) =>
      prevUsuarios.map((u) =>
        u.uid === userId ? { ...u, rol: nuevoRol } : u
      )
    );
  };

  const handleToggleHabilitado = (userId) => {
    setUsuarios((prevUsuarios) =>
      prevUsuarios.map((u) =>
        u.uid === userId ? { ...u, habilitado: !u.habilitado } : u
      )
    );
  };

  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.email.toLowerCase().includes(filtroEmail.toLowerCase())
  );

  if (!isAdmin && !loading) {
    return (
      <div className="gestion-usuarios-error-fullpage">
        Access Denied. You do not have permission to view this page.
      </div>
    );
  }

  if (loading)
    return (
      <div className="gestion-usuarios-loading-fullpage">Loading users...</div>
    );

  return (
    <div className="gestion-usuarios-container">
      <h2 className="gestion-usuarios-titulo">User  Management</h2>
      {error && <p className="gestion-usuarios-error-mensaje">{error}</p>}

      <div className="gestion-usuarios-filtros">
        <input
          type="text"
          placeholder="Filter by email..."
          value={filtroEmail}
          onChange={(e) => setFiltroEmail(e.target.value)}
          className="gestion-usuarios-input-filtro"
          aria-label="Filter users by email"
        />
      </div>

      {usuariosFiltrados.length === 0 && !loading && (
        <p>No users found with that filter or no users to display.</p>
      )}

      {usuariosFiltrados.length > 0 && (
        <div className="gestion-usuarios-tabla-wrapper">
          <table className="gestion-usuarios-tabla">
            <thead>
              <tr>
                <th>Email</th>
                <th>Full Name</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((usuario) => (
                <tr
                  key={usuario.uid}
                  className={
                    !usuario.habilitado
                      ? "gestion-usuarios-usuario-deshabilitado"
                      : ""
                  }
                >
                  <td>{usuario.email}</td>
                  <td>
                    {usuario.nombre} {usuario.apellido}
                  </td>
                  <td>
                    <select
                      value={usuario.rol}
                      onChange={(e) =>
                        handleCambiarRol(usuario.uid, e.target.value)
                      }
                      className="gestion-usuarios-select-rol"
                      aria-label={`Role of ${usuario.email}`}
                    >
                      <option value="cliente">Client</option>
                      <option value="administrador">Administrator</option>
                    </select>
                  </td>
                  <td>{usuario.habilitado ? "Enabled" : "Disabled"}</td>
                  <td className="gestion-usuarios-acciones-celda">
                    <button
                      onClick={() => handleVerDetalles(usuario.uid)}
                      className="gestion-usuarios-btn-accion gestion-usuarios-btn-detalles"
                      title="View Details"
                      aria-label={`View details of ${usuario.email}`}
                    >
                      <i className="bi bi-eye-fill" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() => handleToggleHabilitado(usuario.uid)}
                      className={`gestion-usuarios-btn-accion ${
                        usuario.habilitado
                          ? "gestion-usuarios-btn-deshabilitar"
                          : "gestion-usuarios-btn-habilitar"
                      }`}
                      title={usuario.habilitado ? "Disable User" : "Enable User"}
                      aria-label={
                        usuario.habilitado
                          ? `Disable user ${usuario.email}`
                          : `Enable user ${usuario.email}`
                      }
                    >
                      {usuario.habilitado ? (
                        <i
                          className="bi bi-person-fill-slash"
                          aria-hidden="true"
                        ></i>
                      ) : (
                        <i
                          className="bi bi-person-fill-check"
                          aria-hidden="true"
                        ></i>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminGestionUsuarios;