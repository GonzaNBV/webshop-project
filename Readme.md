# Proyecto React + Firebase

Este proyecto carga productos a Firestore mediante un script en Node.js.

## Seguridad

El archivo real `claveFirebase.json` **no está incluido** en este repositorio por razones de seguridad.

Se incluye un archivo de ejemplo llamado `fuego-secreto.firebase.json` que muestra la estructura necesaria para conectarse con Firebase.

## Cómo ejecutar el script

1. Obtén el archivo real `claveFirebase.json`.
2. Colócalo en la carpeta `/public`.
3. Ejecuta el script con el siguiente comando:

```bash
node upload.js
