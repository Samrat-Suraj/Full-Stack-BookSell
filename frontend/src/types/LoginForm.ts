import { z } from "zod"

export const LoginFormSchema = z.object({
    email: z.string().email("Invaild Email Address"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .regex(/[A-Z]/, "Password must include at least one uppercase letter")
        .regex(/[a-z]/, "Password must include at least one lowercase letter")
        .regex(/[0-9]/, "Password must include at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must include at least one special character"),

})

export type LoginFormType = z.infer<typeof LoginFormSchema>
export type LoginFromError = Partial<Record<keyof LoginFormType, string[]>>