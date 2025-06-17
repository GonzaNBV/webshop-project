import React, { useState, useEffect } from 'react';
import { db } from '../../configFirebase';
import { collection, addDoc } from 'firebase/firestore';
import './AdminCrearProducto.css';

const uploadImgToImgBB = async (imgFile) => {
    const API_KEY_IMGBB = 'd0bc686385afc689b60774c9807d88d';
    const formData = new FormData();
    formData.append('image', imgFile);
    const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${API_KEY_IMGBB}`,
        {
            method: 'POST',
            body: formData,
        }
    );
    const data = await response.json();
    if (data.success) {
        return data.data.url;
    } else {
        console.error("ImgBB upload error:", data);
        throw new Error(data.error?.message || 'Error uploading image to ImgBB');
    }
};

const AdminCrearProducto = ({ isAdmin }) => {
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [discount, setDiscount] = useState('');
    const [imageFiles, setImageFiles] = useState({ img1: null, img2: null, img3: null });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const handleImageChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            setImageFiles((prev) => ({ ...prev, [name]: files[0] }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!isAdmin) {
            setError('Access denied. You are not authorized to perform this action.');
            return;
        }
        if (!imageFiles.img1 || !imageFiles.img2 || !imageFiles.img3) {
            setError('Please select all 3 images for the product.');
            return;
        }
        if (parseFloat(price) <= 0) {
            setError('Price must be a positive number.');
            return;
        }
        const discountValue = discount ? parseFloat(discount) : 0;
        if (discountValue < 0 || discountValue >= 100) {
            setError('Discount must be between 0 and 99.');
            return;
        }

        setLoading(true);
        try {
            const imageUrls = await Promise.all([
                uploadImgToImgBB(imageFiles.img1),
                uploadImgToImgBB(imageFiles.img2),
                uploadImgToImgBB(imageFiles.img3),
            ]);

            let finalPrice = parseFloat(price);
            let originalPriceForDb = null;

            if (discountValue > 0) {
                originalPriceForDb = finalPrice;
                finalPrice = originalPriceForDb * (1 - discountValue / 100);
            } else {
                originalPriceForDb = finalPrice;
            }
            finalPrice = parseFloat(finalPrice.toFixed(2));
            if (originalPriceForDb) originalPriceForDb = parseFloat(originalPriceForDb.toFixed(2));

            await addDoc(collection(db, 'productos'), {
                nombre: productName,
                descripcion: description,
                precio: finalPrice,
                precioOriginal: originalPriceForDb,
                descuento: discountValue,
                imagenes: imageUrls,
                createdAt: new Date(),
            });

            setSuccessMessage('Product created successfully!');
            setProductName('');
            setDescription('');
            setPrice('');
            setDiscount('');
            setImageFiles({ img1: null, img2: null, img3: null });

            document.getElementById('img1').value = null;
            document.getElementById('img2').value = null;
            document.getElementById('img3').value = null;

        } catch (error) {
            console.error('Error creating product:', error);
            setError(`Error creating product: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`admin-crear-product-fade-wrapper ${isVisible ? "visible" : ""}`}>
            <div className="admin-crear-product-container">
                <h2>Create New Product</h2>
                {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
                {successMessage && <p style={{ color: 'green', marginBottom: '15px' }}>{successMessage}</p>}
                <form className="admin-crear-product-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="productName">Product Name</label>
                        <input
                            type="text"
                            id="productName"
                            name="productName"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            placeholder="E.g., Blue Oxford Shirt"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Detailed product description"
                            rows="3"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Price (before discount)</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Base price"
                            required
                            step="0.01"
                            min="0.01"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="discount">Discount (%)</label>
                        <input
                            type="number"
                            id="discount"
                            name="discount"
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                            placeholder="E.g., 15 for 15%"
                            min="0"
                            max="99"
                        />
                    </div>
                    <div className="form-group imagen-group">
                        <label htmlFor="img1">Main Image</label>
                        <input type="file" id="img1" name="img1" accept="image/*" onChange={handleImageChange} required />
                    </div>
                    <div className="form-group imagen-group">
                        <label htmlFor="img2">Secondary Image 1</label>
                        <input type="file" id="img2" name="img2" accept="image/*" onChange={handleImageChange} required />
                    </div>
                    <div className="form-group imagen-group">
                        <label htmlFor="img3">Secondary Image 2</label>
                        <input type="file" id="img3" name="img3" accept="image/*" onChange={handleImageChange} required />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Uploading...' : 'Create Product'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminCrearProducto;