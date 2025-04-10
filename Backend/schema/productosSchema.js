import z from "zod"

const ProductosSchema = z.object({
    id: z.number({
        required_error: "El id es requerido",
        invalid_type_error: "Dato inválido" 
    }).positive({
        message:"Dato inválido"
    }).min(1,{ message: "El id es requerido"}).int({ message: "El id es requerido"}).optional(),

    nombre: z.string({
        required_error: "El nombre es requerido",
        invalid_type_error: "Dato inválido"
    }).trim().min(1, { message: "El nombre es requerido" }).max(30, { message: "Nombre muy largo" }),

    presentacion: z.number({
        required_error: "La presentación es requerida",
        invalid_type_error: "Dato inválido"
    }).min(1, { message: "La presentación es requerida" }).int({ message: "Dato inválido" }).positive({ message: "Dato inválido" }),

    tipo_cafe_id: z.number({
        required_error: "El tipo de café es requerido",
        invalid_type_error: "Dato inválido"
    }).min(1,{ message: "El tipo de café es requerido" }).int({ message: "El tipo de café es requerido" }),
    
    precio: z.number({
        required_error: "El precio es requerido",
        invalid_type_error: "Dato inválido"
    }).min(1, { message: "El precio es requerido" }).int({ message: "Precio inválido" })
})

const eliminarProductosSchema = z.object({
    id: z.number({
        required_error: "El id es requerido",
        invalid_type_error: "Dato inválido" 
    }).positive({
        message:"Dato inválido"
    }).min(1,{ message: "El id es requerido"}).int({ message: "El id es requerido"})
})

const nombreSchema = z.object({
    nombre: z.string({
        required_error: "El nombre es requerido",
        invalid_type_error: "Dato inválido"
    }).trim().min(1, { message: "El nombre es requerido" }).max(30, { message: "Nombre muy largo" })
})

export const validateNombre=(object) => {
    return nombreSchema.safeParse(object)
}

export const validateProductos=(object) => {
return ProductosSchema.safeParse(object)
}

export const validateIdProductos=(object) => {
    return eliminarProductosSchema.safeParse(object)
}
