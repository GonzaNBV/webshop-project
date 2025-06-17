import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../configFirebase';
import { doc, getDoc } from 'firebase/firestore';
import { useCarrito } from "../context/CarritoContext.jsx";
import './PaginaDetalleProducto.css';

const PaginaDetalleProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCarrito();
  const [producto, setProducto] = useState(null);
  const [error, setError] = useState(null);
  const [showViewCart, setShowViewCart] = useState(false);
  const [tallaSeleccionada, setTallaSeleccionada] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [mostrarContenido, setMostrarContenido] = useState(false);

  useEffect(() => {
    const fetchProducto = async () => {
      if (!id) return;
      setError(null);
      setProducto(null);
      setShowViewCart(false);
      try {
        const docRef = doc(db, 'productos', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProducto({ id: docSnap.id, ...data }); 
          if (data.tallas && data.tallas.length > 0) {
            setTallaSeleccionada(data.tallas[0]);
          }
        } else {
          setError('Product not found.');
        }
      } catch (err) {
        setError('Error loading product.');
      }
    };
    fetchProducto();
  }, [id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMostrarContenido(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleBuyOrViewCart = () => {
    if (showViewCart) {
      navigate("/carrito");
    } else {
      if (!producto) return;
      if (producto.tallas && producto.tallas.length > 0 && !tallaSeleccionada) {
        alert("Please select a size.");
        return;
      }

      const productoParaContexto = {
        id: producto.id,
        displayTitle: producto.titulo || producto.nombre || "Detalle Producto",
        images: producto.imagenes || [], 
        currentPrice: producto.precio, 
        selectedSize: tallaSeleccionada,
        descripcion: producto.descripcion, 
        titulo: producto.titulo, 
        nombre: producto.nombre, 
        precio: producto.precio,
        precioOriginal: producto.precioOriginal,
        descuento: producto.descuento,
        colores: producto.colores,
        tallasDisponibles: producto.tallas
      };
      
      agregarAlCarrito(productoParaContexto, cantidad);

      setShowViewCart(true);
      setTimeout(() => {
        setShowViewCart(false);
      }, 2000);
    }
  };

  if (error) return ( <div className="detalle-page-wrapper"> <div className="detalle-producto-page-container mensaje-estado-container"> <div className="detalle-mensaje-estado">{error}</div> </div> </div> );
  if (!producto) return ( <div className="detalle-page-wrapper"> <div className="detalle-producto-page-container mensaje-estado-container"> <div className="detalle-mensaje-estado">Loading product...</div> </div> </div> );

  const imagenesDelProducto = producto.imagenes || [];
  const imagenLadoIzquierdo = imagenesDelProducto.length > 1 ? imagenesDelProducto[1] : (imagenesDelProducto.length > 0 ? imagenesDelProducto[0] : '/imagenes/placeholder-grande.jpg');
  const imagenDerechaInferior1 = imagenesDelProducto.length > 0 ? imagenesDelProducto[0] : '/imagenes/placeholder-pequeno.jpg';
  const imagenDerechaInferior2 = imagenesDelProducto.length > 2 ? imagenesDelProducto[2] : (imagenesDelProducto.length > 0 ? imagenesDelProducto[0] : '/imagenes/placeholder-pequeno.jpg');
  const precioAMostrar = producto.precio;
  const precioOriginalAMostrar = producto.precioOriginal;

  return (
    <div className="detalle-page-wrapper">
      <div className="sombrasiete-overlay"><img src="/imagenes/Fondo/sombra7.png" alt="sombra-cinco" /></div>
      <div className="detalle-producto-page-container">
        <button className="detalle-btn-volver" onClick={() => navigate(-1)} aria-label="Go back"> <i className="bi bi-arrow-left-circle-fill"></i> </button>
        {producto && (
          <div className={`detalle-vista-producto ${mostrarContenido ? 'visible' : ''}`}>
            <div className="detalle-columna-izquierda"> <img src={imagenLadoIzquierdo} alt={producto.nombre || producto.titulo || 'Product Image'} className="detalle-imagen-principal" /> </div>
            <div className="detalle-columna-derecha">
              <div className="detalle-superior-detalles">
                <h2>{producto.nombre || producto.titulo}</h2>
                <div className="detalle-info-producto"> <p>{producto.descripcion}</p>
                  <div className="detalle-precios"> {producto.descuento > 0 && producto.precioOriginal !== undefined && (<span className="detalle-precio-original">${(producto.precioOriginal || 0).toLocaleString()}</span>)} {precioAMostrar !== undefined && (<span className="detalle-precio-final">${(precioAMostrar || 0).toLocaleString()}</span> )} </div> {producto.descuento > 0 && (<span className="detalle-descuento-texto">{producto.descuento}% OFF</span> )}
                </div>
                {producto.colores && producto.colores.length > 0 && ( <div className="detalle-colores-container"> {producto.colores.map((color, index) => (<div key={index} className="detalle-color-indicador" style={{ backgroundColor: color.codigo || color }} title={color.nombre || color}></div>))} </div> )}
                {producto.tallas && producto.tallas.length > 0 && ( <div className="detalle-tallas-container"> {producto.tallas.map((talla) => (<button key={talla} className={`detalle-talla-boton ${tallaSeleccionada === talla ? 'seleccionada' : ''}`} onClick={() => setTallaSeleccionada(talla)}>{talla}</button>))} </div> )}
                <div className="detalle-contadordos"> <button onClick={() => setCantidad(Math.max(cantidad - 1, 1))} aria-label="Decrease quantity" disabled={cantidad <= 1}><i className="bi bi-dash"></i></button> <input id="cantidad-producto" type="text" value={cantidad} readOnly aria-label="Current quantity" /> <button onClick={() => setCantidad(cantidad + 1)} aria-label="Increase quantity"><i className="bi bi-plus"></i></button> </div>
                <button className={`detalle-boton-comprar ${showViewCart ? 'view-cart-active' : ''}`} onClick={handleBuyOrViewCart} disabled={!showViewCart && (producto.tallas && producto.tallas.length > 0 && !tallaSeleccionada)} title={!showViewCart && (producto.tallas && producto.tallas.length > 0 && !tallaSeleccionada) ? 'Please select a size' : showViewCart ? 'View your cart' : 'Buy this item'}> {showViewCart ? 'VIEW CART' : 'BUY'} </button>
              </div>
              <div className="detalle-inferior-imagenes">
                <div className="detalle-imagen-inferior-contenedor"><img src={imagenDerechaInferior1} alt={producto.nombre || producto.titulo || 'Thumbnail 1'} className="detalle-imagen-inferior" /></div>
                <div className="detalle-imagen-inferior-contenedor"><img src={imagenDerechaInferior2} alt={producto.nombre || producto.titulo || 'Thumbnail 2'} className="detalle-imagen-inferior" /></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default PaginaDetalleProducto;