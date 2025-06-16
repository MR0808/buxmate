import { z, ZodSchema } from "zod";

export function validateWithZodSchema<T>(
    schema: ZodSchema<T>,
    data: unknown
): T {
    const result = schema.safeParse(data);
    if (!result.success) {
        const errors = result.error.errors.map((error) => error.message);
        throw new Error(errors.join(", "));
    }
    return result.data;
}
