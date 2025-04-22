import { z } from "zod"

export const ForgetFormSchema = z.object({
    email: z.string().email("Invaild Email Address")
})

export type ForgetFormType = z.infer<typeof ForgetFormSchema>
export type ForgetFormError = Partial<Record<keyof ForgetFormType, string[]>>