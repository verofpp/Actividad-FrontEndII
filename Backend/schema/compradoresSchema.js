import z from "zod"

const CompradoresSchema = z.object({
    id: z.number({
        required_error: "El id es requerido",
        invalid_type_error: "Dato inválido" 
    }).positive({
        message:"Dato inválido"
    }).min(1,{ message: "El id es requerido"}).int({ message: "El id es requerido"}).optional(),

    nombre: z.string({
        required_error: "El nombre es requerido",
        invalid_type_error: "Dato inválido"
    }).trim().min(1, { message: "El nombre es requerido" }).max(100, { message: "Nombre muy largo" }),

    direccion: z.string({
        required_error: "La dirección es requerida",
        invalid_type_error: "Dato inválido"
    }).trim().min(1, { message: "La dirección es requerida" }).max(255, { message: "Dirección muy larga" }),
    telefono: z.string({
        required_error: "El teléfono es requerido",
        invalid_type_error: "Dato inválido"
    }).trim().min(11, { message: "El teléfono es requerido" }).max(11, { message: "Teléfono inválido" }).regex(/^\d{11}$/, {message: "El teléfono es inválido"}),
    email: z.string({
        required_error: "El correo es requerido",
        invalid_type_error: "Dato inválido"
    }).trim().min(1, { message: "El correo es requerido" }).email({message:"Correo inválido"}),

})

const eliminarCompradoresSchema = z.object({
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

export const validateCompradores=(object) => {
return CompradoresSchema.safeParse(object)
}

export const validateIdCompradores=(object) => {
    return eliminarCompradoresSchema.safeParse(object)
}
