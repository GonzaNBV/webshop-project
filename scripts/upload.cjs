const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const clavePath = path.join(__dirname, '..', 'functions', 'config', 'fire-secretFirebase.json');
const productosPath = path.join(__dirname, '..', 'public', 'productos.json');

let serviceAccount;
try {
  serviceAccount = JSON.parse(fs.readFileSync(clavePath, 'utf-8'));
} catch (error) {
  console.error(`Error al leer o parsear el archivo de clave de servicio en: ${clavePath}`);
  console.error('Asegúrate de que el archivo existe y es un JSON válido.');
  process.exit(1);
}

let productos;
try {
  productos = JSON.parse(fs.readFileSync(productosPath, 'utf-8'));
} catch (error) {
  console.error(`Error al leer o parsear el archivo de productos en: ${productosPath}`);
  console.error('Asegúrate de que el archivo existe y es un JSON válido con la estructura correcta.');
  process.exit(1);
}

if (serviceAccount.private_key && typeof serviceAccount.private_key === 'string') {
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
}

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (error) {
  if (error.code === 'app/duplicate-app') {
    console.warn('Firebase Admin ya estaba inicializado. Usando la instancia existente.');
  } else {
    console.error('Error al inicializar Firebase Admin:', error);
    process.exit(1);
  }
}

const db = admin.firestore();

async function subirProductos() {
  if (!productos || !Array.isArray(productos) || productos.length === 0) {
    console.log('No hay productos válidos para subir en el archivo JSON.');
    return;
  }

  const batch = db.batch();
  const productosCollection = db.collection('productos');

  productos.forEach(producto => {
    if (producto.id === undefined || producto.id === null) {
      console.warn('Producto sin ID encontrado, se omitirá:', producto.titulo || 'Producto sin título');
      return;
    }
    const docId = String(producto.id);
    const docRef = productosCollection.doc(docId);
    batch.set(docRef, producto);
    console.log(`Añadiendo producto con ID: ${docId} al batch.`);
  });

  try {
    await batch.commit();
    console.log('--------------------------------------------------');
    console.log('¡Productos subidos correctamente a Firestore!');
    console.log('--------------------------------------------------');
  } catch (commitError) {
    console.error('Error al hacer commit del batch a Firestore:', commitError);
  }
}

subirProductos().catch(errorGeneral => {
  console.error('Error general en el script de subida:', errorGeneral);
});