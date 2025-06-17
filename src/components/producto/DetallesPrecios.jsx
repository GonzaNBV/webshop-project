import React from "react";
import Precios from "./Precios";
import BotonComprar from "./BotonComprar";

const DetallesPrecios = ({ producto }) => {
  return (
    <div className="detalles-precios">
      <h1>{producto.titulo}</h1>
      <img src={producto.imagen} alt={producto.titulo} />
      <Precios realPrice={producto.precioOriginal || producto.precio} finalPrice={producto.precio} />
      <BotonComprar producto={producto} />
    </div>
  );
};

export default DetallesPrecios;
