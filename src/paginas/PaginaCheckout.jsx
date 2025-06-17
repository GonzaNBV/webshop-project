import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useCarrito } from '../context/CarritoContext.jsx';
import './PaginaCheckout.css';

const PaginaCheckout = () => {
  const { carritoItems, limpiarCarrito } = useCarrito();
  const navigate = useNavigate();

  const [etapaActual, setEtapaActual] = useState(1);
  const [datosPersonales, setDatosPersonales] = useState({ email: '', nombre: '', apellido: '' });
  const [datosEnvio, setDatosEnvio] = useState({ direccion: '', ciudad: '', codigoPostal: '', opcionEnvio: 'estandar' });
  const [metodoPago, setMetodoPago] = useState({ tipo: 'tarjeta', numeroTarjeta: '', expiracion: '', cvv: '' });
  const [mensajeFinal, setMensajeFinal] = useState('');

  const itemsParaResumen = carritoItems;

  const handleChangeDatosPersonales = (e) => {
    setDatosPersonales({ ...datosPersonales, [e.target.name]: e.target.value });
  };

  const handleChangeDatosEnvio = (e) => {
    setDatosEnvio({ ...datosEnvio, [e.target.name]: e.target.value });
  };

  const handleChangeMetodoPago = (e) => {
    setMetodoPago({ ...metodoPago, [e.target.name]: e.target.value });
  };

  const irSiguienteEtapa = () => {
    if (etapaActual < 4) {
      setEtapaActual(etapaActual + 1);
    }
  };

  const irEtapaAnterior = () => {
    if (etapaActual > 1) {
      setEtapaActual(etapaActual - 1);
    }
  };

  const handleFinalizarCompra = () => {
    setMensajeFinal('¡Gracias por su compra!');
    limpiarCarrito();
  };

  const calcularTotalResumen = () => {
    return itemsParaResumen.reduce((acc, item) => acc + (item.currentPrice || item.precio || 0) * (item.quantity || 0), 0);
  };

  const renderEtapa = () => {
    switch (etapaActual) {
      case 1:
        return (
          <div className="checkout-etapa-contenido">
            <h3>1. Información de Contacto</h3>
            <div className="checkout-form-group">
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" value={datosPersonales.email} onChange={handleChangeDatosPersonales} placeholder="tu@email.com" />
            </div>
            <div className="checkout-grupo-horizontal">
              <div className="checkout-form-group">
                <label htmlFor="nombre">Nombre:</label>
                <input type="text" id="nombre" name="nombre" value={datosPersonales.nombre} onChange={handleChangeDatosPersonales} placeholder="Tu nombre" />
              </div>
              <div className="checkout-form-group">
                <label htmlFor="apellido">Apellido:</label>
                <input type="text" id="apellido" name="apellido" value={datosPersonales.apellido} onChange={handleChangeDatosPersonales} placeholder="Tu apellido" />
              </div>
            </div>
            <button onClick={irSiguienteEtapa} className="checkout-boton-primario checkout-boton-etapa-siguiente">Siguiente</button>
          </div>
        );
      case 2:
        return (
          <div className="checkout-etapa-contenido">
            <h3>2. Dirección de Envío</h3>
            <div className="checkout-form-group">
              <label htmlFor="direccion">Dirección:</label>
              <input type="text" id="direccion" name="direccion" value={datosEnvio.direccion} onChange={handleChangeDatosEnvio} placeholder="Calle y número, depto" />
            </div>
            <div className="checkout-form-group">
              <label htmlFor="ciudad">Ciudad:</label>
              <input type="text" id="ciudad" name="ciudad" value={datosEnvio.ciudad} onChange={handleChangeDatosEnvio} placeholder="Ciudad" />
            </div>
            <div className="checkout-form-group">
              <label htmlFor="codigoPostal">Código Postal:</label>
              <input type="text" id="codigoPostal" name="codigoPostal" value={datosEnvio.codigoPostal} onChange={handleChangeDatosEnvio} placeholder="CP" />
            </div>
            <div className="checkout-form-group">
              <label htmlFor="opcionEnvio">Opción de Envío:</label>
              <select id="opcionEnvio" name="opcionEnvio" value={datosEnvio.opcionEnvio} onChange={handleChangeDatosEnvio}>
                <option value="estandar">Envío Estándar (3-5 días)</option>
                <option value="expres">Envío Express (1-2 días)</option>
              </select>
            </div>
            <div className="checkout-botones-navegacion">
              <button onClick={irEtapaAnterior} className="checkout-boton-secundario">Anterior</button>
              <button onClick={irSiguienteEtapa} className="checkout-boton-primario">Siguiente</button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="checkout-etapa-contenido">
            <h3>3. Método de Pago</h3>
            <div className="checkout-form-group">
              <label htmlFor="tipoPago">Seleccione Método:</label>
              <select id="tipoPago" name="tipo" value={metodoPago.tipo} onChange={handleChangeMetodoPago}>
                <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                <option value="paypal">PayPal</option>
                <option value="mercadopago">MercadoPago</option>
              </select>
            </div>
            {metodoPago.tipo === 'tarjeta' && (
              <>
                <div className="checkout-form-group">
                  <label htmlFor="numeroTarjeta">Número de Tarjeta:</label>
                  <input type="text" id="numeroTarjeta" name="numeroTarjeta" value={metodoPago.numeroTarjeta} onChange={handleChangeMetodoPago} placeholder="0000 0000 0000 0000" />
                </div>
                <div className="checkout-grupo-horizontal">
                  <div className="checkout-form-group">
                    <label htmlFor="expiracion">Expiración (MM/AA):</label>
                    <input type="text" id="expiracion" name="expiracion" value={metodoPago.expiracion} onChange={handleChangeMetodoPago} placeholder="MM/AA" />
                  </div>
                  <div className="checkout-form-group">
                    <label htmlFor="cvv">CVV:</label>
                    <input type="text" id="cvv" name="cvv" value={metodoPago.cvv} onChange={handleChangeMetodoPago} placeholder="123" />
                  </div>
                </div>
              </>
            )}
            <div className="checkout-botones-navegacion">
              <button onClick={irEtapaAnterior} className="checkout-boton-secundario">Anterior</button>
              <button onClick={irSiguienteEtapa} className="checkout-boton-primario">Siguiente</button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="checkout-etapa-contenido">
            <h3>4. Confirmar Pedido</h3>
            <div className="checkout-resumen-final-etapa4">
              <h4>Datos Personales:</h4>
              <p><strong>Nombre:</strong> {datosPersonales.nombre} {datosPersonales.apellido}</p>
              <p><strong>Email:</strong> {datosPersonales.email}</p>
              <h4>Dirección de Envío:</h4>
              <p>{datosEnvio.direccion}, {datosEnvio.ciudad}, {datosEnvio.codigoPostal}</p>
              <p><strong>Envío:</strong> {datosEnvio.opcionEnvio}</p>
              <h4>Método de Pago:</h4>
              <p>{metodoPago.tipo === 'tarjeta' ? `Tarjeta terminada en ${metodoPago.numeroTarjeta.slice(-4)}` : `${metodoPago.tipo}`}</p>
            </div>
            <div className="checkout-botones-navegacion">
              <button onClick={irEtapaAnterior} className="checkout-boton-secundario">Anterior</button>
              <button onClick={handleFinalizarCompra} className="checkout-boton-finalizar">Finalizar Compra</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (mensajeFinal) {
    return (
      <div className="checkout-pagina-container">
        <div className="sombracinco-overlay">
          <img src="/imagenes/Fondo/sombra5.png" alt="Background shadow" />
        </div>
        <div className="checkout-mensaje-final-card">
          <h2>{mensajeFinal}</h2>
          <button onClick={() => navigate('/productos')} className="checkout-boton-primario">Volver a la Tienda</button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-pagina-container">
      <div className="sombracinco-overlay">
        <img src="/imagenes/Fondo/sombra5.png" alt="Background shadow" />
      </div>
      <button className="checkout-btn-volver-general" onClick={() => etapaActual === 1 ? navigate('/carrito') : irEtapaAnterior()} aria-label="Go back">
        <i className="bi bi-arrow-left-circle-fill"></i>
      </button>
      <div className="checkout-layout-principal">
        <div className="checkout-columna-formulario">
          <div className="checkout-formulario-card">
            <h2 className="checkout-titulo-principal">Checkout</h2>
            <div className="checkout-progreso-etapas">
              <div className={`checkout-etapa ${etapaActual >= 1 ? 'activa' : ''}`}>1</div>
              <div className={`checkout-linea-progreso ${etapaActual > 1 ? 'activa' : ''}`}></div>
              <div className={`checkout-etapa ${etapaActual >= 2 ? 'activa' : ''}`}>2</div>
              <div className={`checkout-linea-progreso ${etapaActual > 2 ? 'activa' : ''}`}></div>
              <div className={`checkout-etapa ${etapaActual >= 3 ? 'activa' : ''}`}>3</div>
              <div className={`checkout-linea-progreso ${etapaActual > 3 ? 'activa' : ''}`}></div>
              <div className={`checkout-etapa ${etapaActual >= 4 ? 'activa' : ''}`}>4</div>
            </div>
            {renderEtapa()}
          </div>
        </div>
        <div className="checkout-columna-resumen">
          <div className="checkout-resumen-card-fijo">
            <h3>Resumen del Pedido</h3>
            {itemsParaResumen.length === 0 ? (
              <p>Tu carrito está vacío.</p>
            ) : (
              <>
                <ul className="checkout-resumen-lista-items">
                  {itemsParaResumen.map(item => (
                    <li key={`${item.id}-${item.selectedSize || 'resumen'}`} className="checkout-resumen-item">
                      <span className="checkout-resumen-item-nombre">{item.displayTitle || item.title || item.nombre || 'Producto'} ({item.quantity})</span>
                      <span className="checkout-resumen-item-talla">{item.selectedSize ? `Talla: ${item.selectedSize}` : ''}</span>
                      <span className="checkout-resumen-item-precio">${((item.currentPrice || item.precio || 0) * (item.quantity || 0)).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
                <div className="checkout-resumen-total-final">
                  <strong>Total:</strong>
                  <strong>${calcularTotalResumen().toLocaleString()}</strong>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaCheckout;