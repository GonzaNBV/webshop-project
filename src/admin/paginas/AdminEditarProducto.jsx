import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { obtenerProductoPorId, actualizarProductoAdmin } from '../../servicios/servicioProductos.js';
import "./AdminEditarProducto.css";

const AdminEditarProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAdmin = true;

  const [producto, setProducto] = useState({
    titulo: '',
    descripcion: '',
    precio: '',
    descuento: '',
    stockGeneral: '',
    imagenes: [],
    nombre: '',
    precioOriginal: '',
    colores: [],
    tallas: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cargarProducto = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await obtenerProductoPorId(id);
        if (data) {
          setProducto({
            titulo: data.titulo || '',
            nombre: data.nombre || '',
            descripcion: data.descripcion || '',
            precio: data.precio !== undefined ? String(data.precio) : '',
            precioOriginal: data.precioOriginal !== undefined ? String(data.precioOriginal) : '',
            descuento: data.descuento !== undefined ? String(data.descuento) : '',
            stockGeneral: data.stockGeneral !== undefined ? String(data.stockGeneral) : '',
            imagenes: data.imagenes || [],
            colores: data.colores || [],
            tallas: data.tallas || [],
          });
        } else {
          setError('Product not found.');
        }
      } catch (err) {
        setError('Error loading the product.');
        console.error(err);
      }
      setLoading(false);
    };

    if (isAdmin) {
      cargarProducto();
    } else {
      setError('Access denied.');
      setLoading(false);
    }
  }, [id, isAdmin]);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...producto.imagenes];
    newImages[index] = value;
    setProducto((prev) => ({ ...prev, imagenes: newImages }));
  };

  const addImageField = () => {
    setProducto((prev) => ({ ...prev, imagenes: [...prev.imagenes, ''] }));
  };

  const removeImageField = (index) => {
    const newImages = producto.imagenes.filter((_, i) => i !== index);
    setProducto((prev) => ({ ...prev, imagenes: newImages }));
  };

  const handleArrayStringChange = (e) => {
    const { name, value } = e.target;
    setProducto((prev) => ({
      ...prev,
      [name]: value.split(',').map(item => item.trim()).filter(item => item),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      setError('Access denied.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (!producto.titulo.trim()) {
        setError('Title is required.');
        setSaving(false);
        return;
      }
      const priceNum = parseFloat(producto.precio);
      if (isNaN(priceNum) || priceNum < 0) {
        setError('Price must be a positive number.');
        setSaving(false);
        return;
      }
      const discountNum = producto.descuento ? parseFloat(producto.descuento) : 0;
      if (isNaN(discountNum) || discountNum < 0 || discountNum > 100) {
        setError('Discount must be a number between 0 and 100.');
        setSaving(false);
        return;
      }
      const stockNum = parseInt(producto.stockGeneral, 10);
      if (isNaN(stockNum) || stockNum < 0) {
        setError('Stock must be a positive integer.');
        setSaving(false);
        return;
      }

      const updatedData = {
        ...producto,
        precio: priceNum,
        descuento: discountNum,
        stockGeneral: stockNum,
        imagenes: producto.imagenes.filter(img => img && img.trim() !== ''),
      };

      await actualizarProductoAdmin(id, updatedData);
      alert('Product updated successfully!');
      navigate('/admin/listado-productos');
    } catch (err) {
      setError('Error updating the product. Please try again.');
      console.error(err);
    }
    setSaving(false);
  };

  if (!isAdmin && !loading) {
    return <div className="admin-editar-error-fullpage">Access Denied. You do not have permission to view this page.</div>;
  }
  if (loading) return <div className="admin-editar-loading-fullpage">Loading product...</div>;

  return (
    <div className="admin-editar-page-wrapper">
      <div className={`admin-editar-fade-wrapper ${isVisible ? "visible" : ""}`}>
        <div className="admin-editar-container">
          <Link to="/admin/listado-productos" className="admin-editar-back-link">
            <i className="bi bi-arrow-left-circle-fill"></i> Back to List
          </Link>
          <h2>EDIT PRODUCT (ID: {id})</h2>
          {error && <p className="admin-editar-error-message">{error}</p>}
          <form className="admin-editar-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="titulo">Product Title:</label>
              <input type="text" id="titulo" name="titulo" value={producto.titulo} onChange={handleChange} placeholder="Enter the title" />
            </div>

            <div className="form-group">
              <label htmlFor="nombre">Name (alternative/internal):</label>
              <input type="text" id="nombre" name="nombre" value={producto.nombre} onChange={handleChange} placeholder="Enter the name" />
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Description:</label>
              <textarea id="descripcion" name="descripcion" value={producto.descripcion} onChange={handleChange} rows="4" placeholder="Enter the description" />
            </div>

            <div className="form-group">
              <label htmlFor="precio">Price (e.g. 29.99):</label>
              <input type="number" id="precio" name="precio" value={producto.precio} onChange={handleChange} step="0.01" min="0" placeholder="Enter the price" />
            </div>

            <div className="form-group">
              <label htmlFor="precioOriginal">Original Price (if discounted):</label>
              <input type="number" id="precioOriginal" name="precioOriginal" value={producto.precioOriginal} onChange={handleChange} step="0.01" min="0" placeholder="Enter the original price" />
            </div>

            <div className="form-group">
              <label htmlFor="descuento">Discount (% e.g. 10 for 10%):</label>
              <input type="number" id="descuento" name="descuento" value={producto.descuento} onChange={handleChange} min="0" max="100" placeholder="Enter the discount" />
            </div>

            <div className="form-group">
              <label htmlFor="stockGeneral">General Stock:</label>
              <input type="number" id="stockGeneral" name="stockGeneral" value={producto.stockGeneral} onChange={handleChange} min="0" placeholder="Enter the stock" />
            </div>

            <div className="form-section">
              <label>Image URLs:</label>
              {producto.imagenes.map((imgUrl, index) => (
                <div key={index} className="admin-editar-image-input-item">
                  <input
                    type="text"
                    value={imgUrl}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    placeholder={`Image URL ${index + 1}`}
                  />
                  <button type="button" onClick={() => removeImageField(index)} className="admin-editar-btn-remove-inline">
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={addImageField} className="admin-editar-btn-add">
                + Add Image URL
              </button>
            </div>

            <div className="form-group">
              <label htmlFor="colores">Colors (comma separated e.g. Red,Blue,Green):</label>
              <input type="text" id="colores" name="colores" value={(producto.colores || []).join(', ')} onChange={handleArrayStringChange} placeholder="Enter colors" />
            </div>

            <div className="form-group">
              <label htmlFor="tallas">Sizes (comma separated e.g. S,M,L,XL):</label>
              <input type="text" id="tallas" name="tallas" value={(producto.tallas || []).join(', ')} onChange={handleArrayStringChange} placeholder="Enter sizes" />
            </div>

            <button type="submit" disabled={saving} className="admin-editar-submit-button">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminEditarProducto;