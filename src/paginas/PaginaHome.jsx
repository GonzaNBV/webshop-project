import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./PaginaHome.css";
import { useCarrito } from "../context/CarritoContext.jsx";
import { obtenerProductos } from "../servicios/servicioProductos.js";

const Header = ({ onSelectCategoria }) => {
  const navigate = useNavigate();
  const { getTotalItemsEnCarrito } = useCarrito();
  const totalItems = getTotalItemsEnCarrito();

  const handleSignOut = () => {
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  return (
    <header className="listado-main-header">
      <div className="listado-header-inner-frame">
        <div className="listado-header-logo">
          <img
            src="/imagenes/Fondo/logorm.png"
            alt="Logo R.M.Williams"
            onClick={() => onSelectCategoria(null)}
          />
        </div>
        <nav className="listado-header-gender-nav">
          <button className="listado-gender-button-header" onClick={() => onSelectCategoria('men')}>Men</button>
          <button className="listado-gender-button-header" onClick={() => onSelectCategoria('women')}>Women</button>
        </nav>
        <nav className="listado-header-user-nav">
          <button className="listado-header-nav-button" onClick={() => navigate("/editar-perfil")}>
            <i className="bi bi-person"></i>
          </button>
          <button className="listado-header-nav-button" onClick={handleSignOut}>
            <span className="listado-header-nav-text">Sign Out</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

const PaginaHome = () => {
  const navigate = useNavigate();
  const { agregarAlCarrito, getTotalItemsEnCarrito } = useCarrito();
  const totalItems = getTotalItemsEnCarrito();

  const [allProducts, setAllProducts] = useState([]);
  const [productosMen, setProductosMen] = useState([]);
  const [productosWomen, setProductosWomen] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [currentImage, setCurrentImage] = useState({});
  const [selectedSize, setSelectedSize] = useState({});
  const [fadeVisible, setFadeVisible] = useState({});
  const [showViewCartState, setShowViewCartState] = useState({});

  const menImage1 = "/imagenes/Fondo/men1.jpg";
  const menImage2 = "/imagenes/Fondo/men2.jpg";
  const menImage3 = "/imagenes/Fondo/men3.jpg";
  const menImage4 = "/imagenes/Fondo/men4.jpg";
  const womenImage1 = "/imagenes/Fondo/women1.jpg";
  const womenImage2 = "/imagenes/Fondo/women2.jpg";
  const womenImage3 = "/imagenes/Fondo/women3.jpg";
  const womenImage4 = "/imagenes/Fondo/women4.jpg";

  useEffect(() => {
    const cargarProductos = async () => {
      setLoading(true);
      setError(null);
      try {
        const productosDeFirebase = await obtenerProductos();
        if (productosDeFirebase) {
          setAllProducts(productosDeFirebase);
          setProductosMen(productosDeFirebase.filter(p => p.categoria === 'men'));
          setProductosWomen(productosDeFirebase.filter(p => p.categoria === 'women'));
          setQuantities(productosDeFirebase.reduce((acc, p) => ({ ...acc, [p.id]: 1 }), {}));
          setSelectedSize(productosDeFirebase.reduce((acc, p) => ({ ...acc, [p.id]: p.tallas && p.tallas.length > 0 ? p.tallas[0] : "" }), {}));
        } else {
          setError("Could not load products.");
          setAllProducts([]); setProductosMen([]); setProductosWomen([]);
        }
      } catch (err) {
        setError("Error loading products from Firebase.");
        setAllProducts([]); setProductosMen([]); setProductosWomen([]);
      }
      setLoading(false);
    };
    cargarProductos();
  }, []);

  useEffect(() => {
    if (allProducts.length > 0 && !loading) {
      const initialFadeState = {};
      allProducts.forEach(p => initialFadeState[p.id] = false);
      setFadeVisible(initialFadeState);
      const timers = allProducts.map((p, i) =>
        setTimeout(() => setFadeVisible(prev => ({ ...prev, [p.id]: true })), 100 + i * 75)
      );
      return () => timers.forEach(clearTimeout);
    }
  }, [allProducts, loading]);

  const handleSelectCategoria = (categoria) => {
    setCategoriaSeleccionada(categoria);
    if (categoria) {
      const sectionId = `listado-${categoria}-products-anchor`;
      setTimeout(() => {
        const sectionElement = document.getElementById(sectionId);
        if (sectionElement) {
          sectionElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const nextImage = (id, images) => { setCurrentImage((prev) => ({ ...prev, [id]: ((prev[id] || 0) + 1) % images.length, })); };
  const prevImage = (id, images) => { setCurrentImage((prev) => ({ ...prev, [id]: ((prev[id] || 0) - 1 + images.length) % images.length, })); };

  const handleBuyNowOrViewCart = (product) => {
    if (showViewCartState[product.id]) {
      navigate("/carrito");
    } else {
      if (!product) return;
      if (product.tallas && product.tallas.length > 0 && !selectedSize[product.id]) {
        alert("Please select a size.");
        return;
      }
      const cantidadSeleccionada = quantities[product.id] || 1;
      const tallaSeleccionada = selectedSize[product.id] || (product.tallas && product.tallas.length > 0 ? product.tallas[0] : undefined);
      const productoParaElCarrito = {
        id: product.id,
        displayTitle: product.titulo || product.nombre || "Product",
        images: product.imagenes || [],
        currentPrice: product.precio,
        selectedSize: tallaSeleccionada,
        titulo: product.titulo,
        nombre: product.nombre,
        descripcion: product.descripcion,
        precioOriginal: product.precioOriginal,
        descuento: product.descuento,
        colores: product.colores,
        tallasDisponibles: product.tallas
      };
      agregarAlCarrito(productoParaElCarrito, cantidadSeleccionada);
      setShowViewCartState((prevState) => ({ ...prevState, [product.id]: true, }));
      setTimeout(() => {
        setShowViewCartState((prevState) => ({ ...prevState, [product.id]: false, }));
      }, 2000);
    }
  };

  const renderProductCards = (productList) => {
    if (productList.length === 0) return null;

    return (
      <div className="listado-productos-container">
        {productList.map((product) => (
          <div key={product.id} className={`listado-product-card listado-fade-wrapper ${fadeVisible[product.id] ? "visible" : ""}`}>
            <div className="listado-image-slider">
              <img src={(product.imagenes && product.imagenes.length > 0) ? product.imagenes[currentImage[product.id] || 0] : "/imagenes/placeholder.png"} alt={product.titulo || product.nombre} className="listado-product-image" onClick={() => product.imagenes && product.imagenes.length > 1 && nextImage(product.id, product.imagenes)} />
              {product.imagenes && product.imagenes.length > 1 && (
                <>
                  <div className="listado-arrow-left" onClick={() => prevImage(product.id, product.imagenes)}><i className="bi bi-caret-left-fill"></i></div>
                  <div className="listado-arrow-right" onClick={() => nextImage(product.id, product.imagenes)}><i className="bi bi-caret-right-fill"></i></div>
                </>
              )}
            </div>
            <h3 className="listado-titulo-producto">{product.titulo || product.nombre}</h3>
            <p className="listado-descripcion-producto">{product.descripcion}</p>
            <div className="listado-price">
              {product.precioOriginal && product.precioOriginal > (product.precio || 0) && (<span className="listado-precio-original">${(product.precioOriginal || 0).toLocaleString()}</span>)}
              <span className="listado-price-updated">${(product.precio || 0).toLocaleString()}</span>
            </div>
            {product.descuento > 0 && (<div className="listado-discount-text">{product.descuento}% OFF</div>)}
            <div className="listado-color-indicator" style={{ backgroundColor: (product.colores && product.colores.length > 0) ? (product.colores[0].codigo || product.colores[0]) : "transparent" }}></div>
            <div className="listado-size-selector">
              {product.tallas && product.tallas.map((size) => (<button key={size} className={selectedSize[product.id] === size ? "selected" : ""} onClick={() => setSelectedSize((prev) => ({ ...prev, [product.id]: size }))}> {size} </button>))}
            </div>
            <div className="listado-contador">
              <div className="listado-contador-controls">
                <button onClick={() => setQuantities((prev) => ({ ...prev, [product.id]: Math.max((prev[product.id] || 1) - 1, 1) }))} aria-label={`Decrease quantity of ${product.titulo || product.nombre}`} disabled={(quantities[product.id] || 1) <= 1}><i className="bi bi-dash"></i></button>
                <input type="text" value={quantities[product.id] || 1} readOnly aria-label={`Quantity of ${product.titulo || product.nombre}`} />
                <button onClick={() => setQuantities((prev) => ({ ...prev, [product.id]: (prev[product.id] || 1) + 1 }))} aria-label={`Increase quantity of ${product.titulo || product.nombre}`}><i className="bi bi-plus"></i></button>
              </div>
              <Link to={`/producto/${product.id}`} style={{ textDecoration: "none" }}>
                <button className="listado-boton-detalle">VIEW DETAILS</button>
              </Link>
            </div>
            <button className={`listado-boton-comprar ${showViewCartState[product.id] ? "view-cart-active" : ""}`} onClick={() => handleBuyNowOrViewCart(product)} disabled={product.tallas && product.tallas.length > 0 && !selectedSize[product.id]} title={(product.tallas && product.tallas.length > 0 && !selectedSize[product.id]) ? "Please select a size" : showViewCartState[product.id] ? "View your cart" : "Add this item to cart"}>
              {showViewCartState[product.id] ? 'VIEW CART' : 'BUY'}
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="listado-page-container">
      <div className="sombraseis-overlay">
        <img src="/imagenes/Fondo/sombra6.png" alt="Background shadow" />
      </div>
      <Header onSelectCategoria={handleSelectCategoria} />
      <div className="listado-carrito-flotante" onClick={() => navigate("/carrito")}>
        <i className="bi bi-cart2"></i>
        {totalItems > 0 && (
          <span className="listado-carrito-contador">{totalItems}</span>
        )}
      </div>
      <main className="listado-main-content">
        {loading && <div className="listado-mensaje-estado">Loading products...</div>}
        {error && <div className="listado-mensaje-estado">{error}</div>}
        {!loading && !error && (
          <>
            {categoriaSeleccionada === null && (
              <section id="men-featured-section-anchor" className="listado-featured-section men-section">
                <div className="listado-featured-grid">
                  <div className="listado-featured-left">
                    <div className="listado-featured-left-top" onClick={() => handleSelectCategoria('men')} style={{ cursor: 'pointer' }}>
                      <img src={menImage2} alt="Men Feature 2" className="listado-featured-image" />
                    </div>
                    <div className="listado-featured-left-bottom">
                      <div className="listado-featured-small-image-container" onClick={() => handleSelectCategoria('men')} style={{ cursor: 'pointer' }}><img src={menImage3} alt="Men Feature 3" className="listado-featured-image" /></div>
                      <div className="listado-featured-small-image-container" onClick={() => handleSelectCategoria('men')} style={{ cursor: 'pointer' }}><img src={menImage4} alt="Men Feature 4" className="listado-featured-image" /></div>
                    </div>
                  </div>
                  <div className="listado-featured-right listado-featured-large" onClick={() => handleSelectCategoria('men')} style={{ cursor: 'pointer' }}>
                    <img src={menImage1} alt="Men Feature 1 Large" className="listado-featured-image" />
                  </div>
                </div>
              </section>
            )}
            {(!categoriaSeleccionada || categoriaSeleccionada === 'men') && (
              <div id="listado-men-products-anchor" className="listado-productos-list-wrapper">
                {renderProductCards(productosMen)}
              </div>
            )}
            {categoriaSeleccionada === null && (
              <section id="women-featured-section-anchor" className="listado-featured-section women-section">
                <div className="listado-featured-grid women">
                  <div className="listado-featured-left listado-featured-large" onClick={() => handleSelectCategoria('women')} style={{ cursor: 'pointer' }}>
                    <img src={womenImage1} alt="Women Feature 1 Large" className="listado-featured-image" />
                  </div>
                  <div className="listado-featured-right">
                    <div className="listado-featured-right-top" onClick={() => handleSelectCategoria('women')} style={{ cursor: 'pointer' }}>
                      <img src={womenImage2} alt="Women Feature 2" className="listado-featured-image" />
                    </div>
                    <div className="listado-featured-right-bottom">
                      <div className="listado-featured-small-image-container" onClick={() => handleSelectCategoria('women')} style={{ cursor: 'pointer' }}><img src={womenImage3} alt="Women Feature 3" className="listado-featured-image" /></div>
                      <div className="listado-featured-small-image-container" onClick={() => handleSelectCategoria('women')} style={{ cursor: 'pointer' }}><img src={womenImage4} alt="Women Feature 4" className="listado-featured-image" /></div>
                    </div>
                  </div>
                </div>
              </section>
            )}
            {(!categoriaSeleccionada || categoriaSeleccionada === 'women') && (
              <div id="listado-women-products-anchor" className="listado-productos-list-wrapper">
                {renderProductCards(productosWomen)}
              </div>
            )}
            {!loading && !error && allProducts.length === 0 && (
              <div className="listado-mensaje-estado">No products found.</div>
            )}
          </>
        )}
      </main>
      <footer className="listado-main-footer">
        <div className="listado-footer-content">
          <div className="listado-footer-section">
            <h4>About R.M.Williams</h4>
            <p>We offer high-quality fashion products for men and women. Our commitment is customer satisfaction.</p>
          </div>
          <div className="listado-footer-section">
            <h4>Contact</h4>
            <p>Questions? Email us: contact@rmwilliams.com</p>
          </div>
          <div className="listado-footer-section">
            <h4>Follow Us</h4>
            <p>Connect with us on our social media.</p>
            <div className="listado-social-icons">
              <i className="bi bi-facebook"></i>
              <i className="bi bi-instagram"></i>
              <i className="bi bi-twitter"></i>
            </div>
          </div>
        </div>
        <div className="listado-footer-bottom">
          <p>© {new Date().getFullYear()} R.M.Williams. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PaginaHome;