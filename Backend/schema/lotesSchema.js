import z from "zod";

const loteSchema = z.object({
  id: z
    .number({
      required_error: "El id es requerido",
      invalid_type_error: "Dato inválido",
    })
    .positive({
      message: "Dato inválido",
    })
    .min(1, { message: "El id es requerido" })
    .int({ message: "El id es requerido" })
    .optional(),

  finca_id: z
    .number({
      required_error: "El id de la finca es requerido",
      invalid_type_error: "Dato inválido",
    })
    .positive({
      message: "Dato inválido",
    })
    .min(1, { message: "El id de la finca es requerido" })
    .int({ message: "El id de la finca es requerido" }),

  fecha_cosecha: z.date({
    required_error: "La fecha de la cosecha es requerida",
    invalid_type_error: "Dato inválido",
  }),

  cantidad_kilos: z
    .number({
      required_error: "Los kilos son requeridos",
      invalid_type_error: "Dato inválido",
    })
    .positive({ message: "Dato inválido" }),

  tipo_cafe_id: z
    .number({
      required_error: "El id del tipo de café es requerido",
      invalid_type_error: "Dato inválido",
    })
    .positive({
      message: "Dato inválido",
    })
    .min(1, { message: "El id del tipo de café es requerido" })
    .int({ message: "El id del tipo de café es requerido" }),

  estado: z
    .string({
      required_error: "El estado es requerido",
      invalid_type_error: "Dato inválido",
    })
    .trim()
    .min(1, { message: "El estado es requerido" })
    .max(50, { message: "El estado es muy largo" })
    .optional(),

  porcentaje_perdido: z
    .number({
      required_error: "El porcentajes de perdida es requerido",
      invalid_type_error: "Dato inválido",
    })
    .positive({ message: "Dato inválido" })
    .optional(),
});

export const validateLote = (object) => {
  return loteSchema.safeParse(object);
};

const eliminarLoteSchema = z.object({
  id: z
    .number({
      required_error: "El id es requerido",
      invalid_type_error: "Dato inválido",
    })
    .positive({
      message: "Dato inválido",
    })
    .min(1, { message: "El id es requerido" })
    .int({ message: "El id es requerido" }),
});

export const validateIdLote = (object) => {
  return eliminarLoteSchema.safeParse(object);
};

const idFincaLoteSchema = z.object({
  finca_id: z
    .number({
      required_error: "El id de la finca es requerido",
      invalid_type_error: "Dato inválido",
    })
    .positive({
      message: "Dato inválido",
    })
    .min(1, { message: "El id de la finca es requerido" })
    .int({ message: "El id de la finca es requerido" }),
});

export const validateIdLoteFinca = (object) => {
  return idFincaLoteSchema.safeParse(object);
};

const fechaSchema = z.object({
  fecha_cosecha: z
    .string({
      required_error: "La fecha es requerida",
      invalid_type_error: "Dato inválido",
    })
    .trim()
    .min(10, { message: "La fecha debe estar en formato YYYY-MM-DD" })
    .max(10, { message: "La fecha debe estar en formato YYYY-MM-DD" })
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "La fecha debe estar en formato YYYY-MM-DD",
    }),
});

export const validateFechaLote = (object) => {
  return fechaSchema.safeParse(object);
};

const tipoSchema = z.object({
  tipo_cafe_id: z
    .number({
      required_error: "El id del tipo de café es requerido",
      invalid_type_error: "Dato inválido",
    })
    .positive({
      message: "Dato inválido",
    })
    .min(1, { message: "El id del tipo de café es requerido" })
    .int({ message: "El id del tipo de café es requerido" }),
});

const estadoSchema = z.object({
  lote_id: z
  .number({
    required_error: "El id es requerido",
    invalid_type_error: "Dato inválido",
  })
  .positive({
    message: "Dato inválido",
  })
  .min(1, { message: "El id es requerido" })
  .int({ message: "El id es requerido" }),
});

const estatusSchema = z.object({
  estado: z
    .string({
      required_error: "El estado es requerido",
      invalid_type_error: "Dato inválido",
    })
    .trim()
    .min(1, { message: "El estado es requerido" })
    .max(50, { message: "El estado es muy largo" }),
});

  export const validateEstado=(object) => {
      return estadoSchema.safeParse(object)
  }

export const validateTypeLote = (object) => {
  return tipoSchema.safeParse(object);
};

export const validateStatusLote = (object) => {
  return estatusSchema.safeParse(object);
};
