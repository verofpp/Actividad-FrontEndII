import { z } from "zod";

const presentacionSchema = z.object({
  producto_id: z.number({
    required_error: "El id de producto es requerido",
    invalid_type_error: "ID de producto inválido"
  }).int().positive(),
  presentacion: z.union([
    z.number().positive(),  // Aplicar positive() aquí
    z.string().transform(val => parseFloat(val))
  ]).refine(val => val > 0, {  // Y añadir refine para asegurar positividad
    message: "Debe ser un número positivo"
  }),
  kilos: z.union([
    z.number().positive(),  // Aplicar positive() aquí
    z.string().transform(val => parseFloat(val))
  ]).refine(val => val > 0, {  // Y añadir refine para asegurar positividad
    message: "Debe ser un número positivo"
  }),
  cantidad: z.union([
    z.number().int().positive(),  // Aplicar positive() aquí
    z.string().transform(val => parseInt(val))
  ]).refine(val => val > 0, {  // Y añadir refine para asegurar positividad
    message: "Debe ser un número entero positivo"
  }),
  fecha_vencimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Formato de fecha inválido (YYYY-MM-DD)"
  })
});

const inventarioSchema = z.object({
  id: z.number().int().positive().optional(),
  lote_id: z.union([
    z.number().int().positive(),
    z.string().transform(val => parseInt(val, 10))
  ]).refine(val => val > 0, {
    message: "El ID de lote debe ser un número positivo"
  }),
  tipo_cafe_id: z.union([
    z.number().int().positive(),
    z.string().transform(val => parseInt(val, 10))
  ]).refine(val => val > 0, {
    message: "El ID de tipo de café debe ser un número positivo"
  }),
  presentaciones: z.array(presentacionSchema).min(1, {
    message: "Debe haber al menos una presentación"
  }),
  perdidas: z.union([
    z.number().min(0),
    z.string().transform(val => parseFloat(val))
  ]).refine(val => val >= 0, {
    message: "Las pérdidas no pueden ser negativas"
  }),
  fecha_vencimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Formato de fecha inválido (YYYY-MM-DD)"
  }).optional()
});

const eliminarIdSchema = z.object({
    id: z.number({
        required_error: "El id es requerido",
        invalid_type_error: "Dato inválido" 
    }).positive({
        message:"Dato inválido"
    }).min(1,{ message: "El id es requerido"}).int({ message: "El id es requerido"})
})

    export const validateInventario=(object) => {
    return inventarioSchema.safeParse(object)
    }

    export const validateIdInventario=(object) => {
        return eliminarIdSchema.safeParse(object)
    }