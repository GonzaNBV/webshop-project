import React, { createContext, useState, useContext, useEffect } from 'react';
import { db, auth } from '../configFirebase';
import { doc, setDoc, onSnapshot, collection, writeBatch, deleteDoc, query, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const CarritoContext = createContext();

export const useCarrito = () => {
  return useContext(CarritoContext);
};

export const CarritoProvider = ({ children }) => {
  const [carritoItems, setCarritoItems] = useState([]);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [cargandoCarrito, setCargandoCarrito] = useState(true);

  const migrarCarritoInvitadoAFirestore = async (uid) => {
    const carritoInvitadoJSON = localStorage.getItem('carritoInvitado');
    if (carritoInvitadoJSON) {
      const carritoInvitadoItems = JSON.parse(carritoInvitadoJSON);
      if (carritoInvitadoItems.length > 0) {
        const batch = writeBatch(db);
        carritoInvitadoItems.forEach(item => {
          const docId = item.id ? item.id.toString() : Date.now().toString(); 
          const itemRef = doc(db, 'usuarios', uid, 'carrito', docId);
          const { id, ...itemDataParaFirestore } = item; 
          batch.set(itemRef, itemDataParaFirestore, { merge: true });
        });
        try {
          await batch.commit();
          localStorage.removeItem('carritoInvitado');
        } catch (error) {
          console.error("Error al migrar carrito de invitado:", error);
        }
      } else {
        localStorage.removeItem('carritoInvitado');
      }
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUsuarioActual(user);
      if (user) {
        migrarCarritoInvitadoAFirestore(user.uid);
      } else {
        const carritoInvitado = localStorage.getItem('carritoInvitado');
        setCarritoItems(carritoInvitado ? JSON.parse(carritoInvitado) : []);
        setCargandoCarrito(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    let unsubscribeFirestore = null;
    if (usuarioActual) {
      setCargandoCarrito(true);
      const carritoRef = collection(db, 'usuarios', usuarioActual.uid, 'carrito');
      unsubscribeFirestore = onSnapshot(carritoRef, (snapshot) => {
        const items = snapshot.docs.map(docSnap => ({ 
          id: docSnap.id, 
          ...docSnap.data() 
        }));
        setCarritoItems(items);
        setCargandoCarrito(false);
      }, (error) => {
        console.error("Error al obtener carrito de Firestore:", error);
        setCargandoCarrito(false);
      });
    } else {
      if (cargandoCarrito && carritoItems.length === 0) { 
        setCargandoCarrito(false); 
      }
    }
    return () => {
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
      }
    };
  }, [usuarioActual]);

  useEffect(() => {
    if (!usuarioActual && !cargandoCarrito) {
      localStorage.setItem('carritoInvitado', JSON.stringify(carritoItems));
    }
  }, [carritoItems, usuarioActual, cargandoCarrito]);

  const agregarAlCarrito = async (productoRecibido, cantidad) => {
    const itemFinalParaGuardar = {
      id: productoRecibido.id,
      displayTitle: productoRecibido.displayTitle || productoRecibido.titulo || productoRecibido.nombre || "Producto",
      images: productoRecibido.images || productoRecibido.imagenes || [],
      currentPrice: productoRecibido.currentPrice || productoRecibido.precio || 0,
      selectedSize: productoRecibido.selectedSize || '',
      quantity: cantidad,
      description: productoRecibido.descripcion,
      addedAt: new Date()
    };

    const { id: productoIdFirestore, ...datosParaFirestore } = itemFinalParaGuardar;

    if (usuarioActual) {
      try {
        const itemRef = doc(db, 'usuarios', usuarioActual.uid, 'carrito', productoIdFirestore.toString());
        await setDoc(itemRef, datosParaFirestore, { merge: true }); 
      } catch (error) {
        console.error("Error al agregar al carrito en Firestore:", error);
      }
    } else {
      setCarritoItems(prevItems => {
        const itemExistenteIndex = prevItems.findIndex(
          item => item.id === itemFinalParaGuardar.id && item.selectedSize === itemFinalParaGuardar.selectedSize
        );
        
        if (itemExistenteIndex > -1) {
          const newItems = [...prevItems];
          newItems[itemExistenteIndex] = {
            ...newItems[itemExistenteIndex],
            quantity: newItems[itemExistenteIndex].quantity + cantidad
          };
          return newItems;
        } else {
          return [...prevItems, itemFinalParaGuardar]; 
        }
      });
    }
  };

  const actualizarCantidadEnCarrito = async (productoId, talla, nuevaCantidad) => {
    if (nuevaCantidad < 1) {
      eliminarDelCarrito(productoId, talla);
      return;
    }
    
    if (usuarioActual) {
      try {
        const itemRef = doc(db, 'usuarios', usuarioActual.uid, 'carrito', productoId.toString());
        await setDoc(itemRef, { quantity: nuevaCantidad }, { merge: true });
      } catch (error) {
        console.error("Error al actualizar cantidad en Firestore:", error);
      }
    } else {
      setCarritoItems(prevItems =>
        prevItems.map(item =>
          (item.id === productoId && item.selectedSize === talla) 
            ? { ...item, quantity: nuevaCantidad } 
            : item
        )
      );
    }
  };

  const eliminarDelCarrito = async (productoId, talla) => {
    if (usuarioActual) {
      try {
        const itemRef = doc(db, 'usuarios', usuarioActual.uid, 'carrito', productoId.toString());
        await deleteDoc(itemRef);
      } catch (error) {
        console.error("Error al eliminar del carrito en Firestore:", error);
      }
    } else {
      setCarritoItems(prevItems => prevItems.filter(item => 
        !(item.id === productoId && item.selectedSize === talla)
      ));
    }
  };

  const limpiarCarrito = async () => {
    if (usuarioActual) {
      try {
        const carritoRef = collection(db, 'usuarios', usuarioActual.uid, 'carrito');
        const snapshot = await getDocs(query(carritoRef));
        if (snapshot.empty) {
          setCarritoItems([]); 
          return;
        }
        const batch = writeBatch(db);
        snapshot.docs.forEach(docSnap => { batch.delete(docSnap.ref); });
        await batch.commit();
      } catch (error) {
        console.error("Error al limpiar carrito en Firestore:", error);
      }
    } else {
      setCarritoItems([]);
    }
  };
  
  const getTotalItemsEnCarrito = () => {
    return carritoItems.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  const value = {
    carritoItems,
    agregarAlCarrito,
    eliminarDelCarrito,
    actualizarCantidadEnCarrito,
    getTotalItemsEnCarrito,
    limpiarCarrito,
    cargandoCarrito,
    usuarioActual
  };

  return (
    <CarritoContext.Provider value={value}>
      {children}
    </CarritoContext.Provider>
  );
};