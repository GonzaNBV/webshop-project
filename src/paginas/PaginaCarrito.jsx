import React from 'react';
import { useNavigate } from "react-router-dom";
import { useCarrito } from '../context/CarritoContext.jsx';
import './PaginaCarrito.css';

const PaginaCarrito = () => {
  const {
    carritoItems,
    eliminarDelCarrito,
    actualizarCantidadEnCarrito,
    limpiarCarrito,
    cargandoCarrito
  } = useCarrito();
  const navigate = useNavigate();

  const calcularSubtotal = (item) => {
    return (item.currentPrice || 0) * (item.quantity || 0);
  };

  const calcularTotal = () => {
    return carritoItems.reduce((total, item) => total + calcularSubtotal(item), 0);
  };

  const totalArticulosEnCarrito = carritoItems.reduce((acc, item) => acc + (item.quantity || 0), 0);

  const handleCheckout = () => { navigate('/checkout'); };
  const handleContinuarComprando = () => { navigate('/productos'); };

  const handleActualizarCantidad = (itemId, itemSize, nuevaCantidad) => {
    if (nuevaCantidad < 1) {
      eliminarDelCarrito(itemId, itemSize);
    } else {
      actualizarCantidadEnCarrito(itemId, itemSize, nuevaCantidad);
    }
  };

  const handleEliminarItem = (itemId, itemSize) => {
    eliminarDelCarrito(itemId, itemSize);
  };

  if (cargandoCarrito) {
    return (
      <div className="carrito-pagina-container">
        <div className="carrito-card carrito-loading-state">
          <h2>Loading Cart...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="carrito-pagina-container">
      <div className="carrito-sombratres-overlay">
        <img src="/imagenes/Fondo/sombra3.png" alt="Background shadow" />
      </div>
      <div className="carrito-card">
        <div className="carrito-header">
          <button onClick={handleContinuarComprando} className="carrito-back-to-action-link">
            <i className="bi bi-arrow-left-circle-fill"></i> Continue Shopping
          </button>
          <h2>Shopping Cart</h2>
          {carritoItems.length > 0 && (
            <p className="carrito-subtitle">
              You have {totalArticulosEnCarrito} item{totalArticulosEnCarrito !== 1 ? 's' : ''} in your cart
            </p>
          )}
        </div>
        {carritoItems.length === 0 ? (
          <div className="carrito-vacio">
            <i className="bi bi-cart-x"></i>
            <p>Your cart is currently empty.</p>
            <button onClick={handleContinuarComprando} className="carrito-boton-accion">
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="carrito-items-layout">
              {carritoItems.map(item => (
                <div key={`${item.id}-${item.selectedSize || 'key-default'}`} className="carrito-item-row-card">
                  <div className="carrito-item-col-imagen">
                    {item.images && item.images.length > 0 ? (
                      <img src={item.images[0]} alt={item.displayTitle || 'Product Image'} className="carrito-item-imagen-llena" />
                    ) : (
                      <div className="carrito-imagen-placeholder">No Image</div>
                    )}
                  </div>
                  <div className="carrito-item-col-descripcion">
                    <p className="carrito-item-descripcion-texto">{item.displayTitle || 'N/A'}</p>
                    {item.selectedSize && <p className="carrito-item-talle">Size: {item.selectedSize}</p>}
                    <div className="carrito-item-cantidad-control">
                      <button
                        className="carrito-cantidad-btn-no-marco"
                        onClick={() => handleActualizarCantidad(item.id, item.selectedSize, (item.quantity || 1) - 1)}
                        disabled={(item.quantity || 1) <= 1}
                        aria-label="Decrease quantity"
                      >
                        <i className="bi bi-dash-lg"></i>
                      </button>
                      <span>{item.quantity || 1}</span>
                      <button
                        className="carrito-cantidad-btn-no-marco"
                        onClick={() => handleActualizarCantidad(item.id, item.selectedSize, (item.quantity || 0) + 1)}
                        aria-label="Increase quantity"
                      >
                        <i className="bi bi-plus-lg"></i>
                      </button>
                    </div>
                  </div>
                  <div className="carrito-item-col-precio">
                    <span className="carrito-item-subtotal-valor">
                      ${((item.currentPrice || 0) * (item.quantity || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="carrito-item-col-accion">
                    <button
                      onClick={() => handleEliminarItem(item.id, item.selectedSize)}
                      className="carrito-boton-eliminar"
                      aria-label="Remove item"
                    >
                      <i className="bi bi-trash3-fill"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="carrito-resumen">
              <div className="carrito-resumen-total">
                <h3>Total:</h3>
                <span>${calcularTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="carrito-resumen-acciones">
                <button onClick={limpiarCarrito} className="carrito-boton-accion carrito-boton-limpiar"> Clear Cart </button>
                <button onClick={handleCheckout} className="carrito-boton-accion carrito-boton-proceder"> Proceed to Checkout <i className="bi bi-arrow-right-short"></i> </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaginaCarrito;