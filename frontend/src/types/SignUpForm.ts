import { z } from "zod";

export const SignUpFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .regex(/[A-Z]/, "Password must include at least one uppercase letter")
        .regex(/[a-z]/, "Password must include at least one lowercase letter")
        .regex(/[0-9]/, "Password must include at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must include at least one special character"),
    confirmPassword: z.string(),
    agreeTerms :z.boolean(),
}).refine(
    (data) => data.password === data.confirmPassword,
    {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    }
);

export type SignUpFormType = z.infer<typeof SignUpFormSchema>;
export type SignUpFormError = Partial<Record<keyof SignUpFormType, string[]>>;