import {z} from 'zod'

export const signInValidationSchema=z.object({
    username:z.string(),
    password:z.string(),
})