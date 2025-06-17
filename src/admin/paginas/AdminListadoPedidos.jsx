import React, { useState, useEffect } from 'react';
import './AdminListadoPedidos.css';

const Pedidos = () => {
    const pedidosSimulados = [
        {
            id: 'PED001',
            cliente: { nombre: 'Juan Carlos', email: 'juancarlos@example.com' },
            productos: [
                { id: 1, nombre: 'Mulyungarie Sweatshirt', cantidad: 1 },
                { id: 2, nombre: 'Vara Polo T-shirt', cantidad: 2 }
            ],
            estado: 'Pendiente',
            total: 75.00
        },
        {
            id: 'PED002',
            cliente: { nombre: 'Mariela Rodriguez', email: 'marie@example.com' },
            productos: [
                { id: 3, nombre: 'Palmer Bomber Jacket', cantidad: 1 }
            ],
            estado: 'En proceso',
            total: 120.50
        },
        {
            id: 'PED003',
            cliente: { nombre: 'Martin Moron', email: 'martinmoron@example.com' },
            productos: [
                { id: 4, nombre: 'Oxford Shirt', cantidad: 1 }
            ],
            estado: 'Completado',
            total: 45.99
        },
    ];

    const [pedidos, setPedidos] = useState([]);

    useEffect(() => {
        localStorage.setItem('pedidos', JSON.stringify(pedidosSimulados));
        setPedidos(pedidosSimulados);
    }, []);

    const actualizarEstado = (id, nuevoEstado) => {
        const pedidosActualizados = pedidos.map(pedido => {
            if (pedido.id === id) {
                return { ...pedido, estado: nuevoEstado };
            }
            return pedido;
        });
        setPedidos(pedidosActualizados);
        localStorage.setItem('pedidos', JSON.stringify(pedidosActualizados));
    };

    const cargarPedidosSimuladosSiVacio = () => {
        setPedidos(pedidosSimulados);
        localStorage.setItem('pedidos', JSON.stringify(pedidosSimulados));
    };

    return (
        <div className="listado-pedidos-container">
            <h2>Order Management</h2>
            {pedidos.length === 0 ? (
                <div className="listado-pedidos-vacio">
                    <p>No orders registered.</p>
                    <button onClick={cargarPedidosSimuladosSiVacio} className="listado-pedidos-btn">Load Sample Orders</button>
                </div>
            ) : (
                <table className="listado-pedidos-tabla">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Client</th>
                            <th>Email</th>
                            <th>Products</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidos.map(pedido => (
                            <tr key={pedido.id}>
                                <td>{pedido.id}</td>
                                <td>{pedido.cliente?.nombre || 'N/A'}</td>
                                <td>
                                    {pedido.cliente?.email ? 
                                        <span style={{ textDecoration: 'none' }}>{pedido.cliente.email}</span> : 'N/A'
                                    }
                                </td>
                                <td>
                                    <ul className="listado-pedidos-lista-productos">
                                        {pedido.productos?.map((producto, index) => (
                                            <li key={`${pedido.id}-${producto.id}-${index}`}>
                                                {producto.nombre} (x{producto.cantidad})
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td>${(pedido.total || 0).toFixed(2)}</td>
                                <td>
                                    <select
                                        className={`listado-pedidos-estado-select listado-pedidos-estado-${pedido.estado?.toLowerCase().replace(' ', '-')}`}
                                        value={pedido.estado}
                                        onChange={(e) => actualizarEstado(pedido.id, e.target.value)}
                                    >
                                        <option value="Pendiente">Pending</option>
                                        <option value="En proceso">In Process</option>
                                        <option value="Enviado">Shipped</option>
                                        <option value="Completado">Completed</option>
                                        <option value="Cancelado">Cancelled</option>
                                    </select>
                                </td>
                                <td>
                                    {pedido.estado !== 'Completado' && pedido.estado !== 'Cancelado' && (
                                        <>
                                            <button
                                                className="listado-pedidos-btn-accion"
                                                onClick={() => actualizarEstado(pedido.id, 'En proceso')}
                                            >
                                                In Process
                                            </button>
                                            <button
                                                className="listado-pedidos-btn-accion listado-pedidos-btn-completar"
                                                onClick={() => actualizarEstado(pedido.id, 'Completado')}
                                            >
                                                Completed
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => alert(`View details of order ${pedido.id} (simulated)`)}
                                        className="listado-pedidos-btn-accion listado-pedidos-btn-detalles"
                                    >
                                        Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Pedidos;
