import z from "zod"

const tipoCafeSchema = z.object({
    id: z.number({
        required_error: "El id es requerido",
        invalid_type_error: "Dato inválido" 
    }).positive({
        message:"Dato inválido"
    }).min(1,{ message: "El id es requerido"}).int({ message: "El id es requerido"}).optional(),

    nombre: z.string({
        required_error: "El nombre es requerido",
        invalid_type_error: "Dato inválido"
    }).trim().min(1, { message: "El nombre es requerido" }).max(30, { message: "Nombre muy largo" })
})

const eliminarTipoCafeSchema = z.object({
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

    export const validateTipoCafe=(object) => {
    return tipoCafeSchema.safeParse(object)
    }

    export const validateIdTipoCafe=(object) => {
        return eliminarTipoCafeSchema.safeParse(object)
    }

    export const validateNombre=(object) => {
        return nombreSchema.safeParse(object)
    }