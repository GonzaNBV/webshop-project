import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { db } from "../configFirebase";

const productosCollectionRef = collection(db, "productos");

export const obtenerProductos = async () => {
  try {
    const q = query(productosCollectionRef, orderBy("orden", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting products: ", error);
    return [];
  }
};

export const obtenerProductoPorId = async (id) => {
  try {
    const docRef = doc(db, "productos", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("Product document ID not found:", id);
      return null;
    }
  } catch (error) {
    console.error("Error getting product by ID:", error);
    return null;
  }
};

export const crearProductoAdmin = async (nuevoProductoData, isAdmin) => {
  if (!isAdmin) throw new Error("Unauthorized access");
  try {
    const docRef = await addDoc(productosCollectionRef, nuevoProductoData);
    return docRef.id;
  } catch (error) {
    console.error("Error creating product (admin): ", error);
    throw error;
  }
};

export const actualizarProductoAdmin = async (id, dataActualizada, isAdmin) => {
  if (!isAdmin) throw new Error("Unauthorized access");
  try {
    const productoDoc = doc(db, "productos", id);
    await updateDoc(productoDoc, dataActualizada);
  } catch (error) {
    console.error("Error updating product (admin): ", error);
    throw error;
  }
};

export const eliminarProductoAdmin = async (id, isAdmin) => {
  if (!isAdmin) throw new Error("Unauthorized access");
  try {
    const productoDoc = doc(db, "productos", id);
    await deleteDoc(productoDoc);
  } catch (error) {
    console.error("Error deleting product (admin): ", error);
    throw error;
  }
};