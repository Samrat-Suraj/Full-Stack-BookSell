import { z } from "zod";

export const SellImageUploadSchema = z.object({
  images: z
    .array(z.string().min(1, "Each image must be a valid string"))
    .min(1, "At least 1 image is required"),
});

export type SellImageType = z.infer<typeof SellImageUploadSchema>;
export type SellImageError = Partial<Record<keyof SellImageType, string[]>>;