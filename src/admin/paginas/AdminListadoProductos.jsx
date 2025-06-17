import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { obtenerProductos, eliminarProductoAdmin } from '../../servicios/servicioProductos.js';
import { useAuth } from '../../context/AuthContext.jsx';
import './AdminListadoProductos.css';

const AdminListadoProductos = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { isAdmin } = useAuth();

    useEffect(() => {
        const cargarProductos = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await obtenerProductos();
                if (data) {
                    setProductos(data);
                } else {
                    setError('Could not load products.');
                }
            } catch (err) {
                setError('Error loading products.');
                console.error(err);
            }
            setLoading(false);
        };
        cargarProductos();
    }, []);

    const handleEliminarProducto = async (idProducto) => {
        if (!isAdmin) {
            setError("You do not have permission to delete products.");
            return;
        }
        if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            try {
                await eliminarProductoAdmin(idProducto, isAdmin);
                setProductos(prevProductos => prevProductos.filter(p => p.id !== idProducto));
            } catch (err) {
                setError('Error deleting the product.');
                console.error(err);
            }
        }
    };

    if (loading) return <div className="admin-loading">Loading products...</div>;
    if (error) return <div className="admin-error">{error}</div>;

    return (
        <div className="admin-listado-productos-container">
            <div className="admin-header-actions">
                <h2 className="admin-page-title">Product Management</h2>
                <Link to="/admin/crear-producto" className="admin-btn admin-btn-crear">
                    <i className="bi bi-plus-circle-fill"></i> Create New Product
                </Link>
            </div>

            {productos.length === 0 ? (
                <p>No products to display. Create the first one!</p>
            ) : (
                <div className="admin-tabla-wrapper">
                    <table className="admin-tabla-productos">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Price</th>
                                <th>Discount</th>
                                <th>Stock (General)</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map((producto) => (
                                <tr key={producto.id}>
                                    <td>
                                        {producto.imagenes && producto.imagenes.length > 0 ? (
                                            <img src={producto.imagenes[0]} alt={producto.titulo} className="admin-producto-imagen-thumbnail" />
                                        ) : (
                                            <span>No image</span>
                                        )}
                                    </td>
                                    <td>{producto.id}</td>
                                    <td>{producto.titulo}</td>
                                    <td>${producto.precio ? producto.precio.toLocaleString() : 'N/A'}</td>
                                    <td>{producto.descuento || 0}%</td>
                                    <td>{producto.stockGeneral || 'N/A'}</td>
                                    <td>
                                        <Link to={`/admin/editar-producto/${producto.id}`} className="admin-btn admin-btn-editar">
                                            <i className="bi bi-pencil-fill"></i> Edit
                                        </Link>
                                        <button 
                                            onClick={() => handleEliminarProducto(producto.id)} 
                                            className="admin-btn admin-btn-eliminar"
                                            disabled={!isAdmin}
                                        >
                                            <i className="bi bi-trash-fill"></i> Delete
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

export default AdminListadoProductos;