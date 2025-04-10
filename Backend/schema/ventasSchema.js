import z from "zod";

const productoVentaSchema = z.object({
  producto_id: z.number().int().positive(),
  cantidad: z.number().positive().refine(val => val % 1 === 0, {
    message: "La cantidad debe ser un número entero"
  }),
});

export const ventaSchema = z.object({
  comprador_id: z.number().int().positive(),
  fecha_venta: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "La fecha debe tener formato YYYY-MM-DD"
  }),
  total: z.number().positive(),
  productos: z.array(productoVentaSchema).min(1, {
    message: "Debe incluir al menos un producto"
  }),
});

// Nuevo esquema para búsqueda por fecha
export const fechaBusquedaSchema = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Formato de fecha inválido. Use YYYY-MM-DD"
  })
});

export const validateVenta = (object) => {
  return ventaSchema.safeParse(object);
};

export const validateFechaBusqueda = (object) => {
  return fechaBusquedaSchema.safeParse(object);
};

// Añadir al final del archivo
export const compradorBusquedaSchema = z.object({
  comprador: z.union([
    z.number().int().positive(),
    z.string().min(3).max(100)
  ], {
    required_error: "Debe proporcionar ID o nombre del comprador",
    invalid_type_error: "El comprador debe ser un ID numérico o nombre textual"
  })
});

export const validateCompradorBusqueda = (object) => {
  return compradorBusquedaSchema.safeParse(object);
};