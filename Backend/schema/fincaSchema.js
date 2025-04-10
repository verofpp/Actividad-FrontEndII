import z from "zod"

const fincaSchema = z.object({
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

    direccion: z.string({
        required_error: "La dirección es requerida",
        invalid_type_error: "Dato inválido"
    }).trim().min(1, { message: "La dirección es requerida" }).max(30, { message: "Dirección muy largo" }),

    encargado: z.string({
        required_error: "El encargado es requerido",
        invalid_type_error: "Dato inválido"
    }).trim().min(1, { message: "El encargado es requerido" }).max(30, { message: "Nombre muy largo" }),
    
    telefono: z.string({
        required_error: "El teléfono es requerido",
        invalid_type_error: "Dato inválido"
    }).trim().min(11, { message: "El teléfono es requerido" }).max(11, { message: "Teléfono inválido" }).regex(/^\d{11}$/, {message: "El teléfono es inválido"}),
})

const eliminarFincaSchema = z.object({
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

const encargadoSchema = z.object({
    encargado: z.string({
        required_error: "El encargado es requerido",
        invalid_type_error: "Dato inválido"
    }).trim().min(1, { message: "El encargado es requerido" }).max(30, { message: "Nombre muy largo" })
})

export const validateEncargado=(object) => {
    return encargadoSchema.safeParse(object)
}

export const validateNombre=(object) => {
    return nombreSchema.safeParse(object)
}

export const validateFinca=(object) => {
return fincaSchema.safeParse(object)
}

export const validateIdFinca=(object) => {
    return eliminarFincaSchema.safeParse(object)
}
