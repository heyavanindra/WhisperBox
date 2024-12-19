import {z} from 'zod'

export const verifyValidationSchema = z.object({
    code :z.string()
})