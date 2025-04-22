import { z } from "zod";

// 1. FormData
export const bookSellFormDataSchema = z.object({
  title: z.string().min(1, "Please enter the book title."),
  subject: z.string().min(1, "Please enter the book subject."),
  category: z.string().min(1, "Please select the book category."),
  condition: z.string().min(1, "Please select the book condition."),
  classType: z.string().min(1, "Please select the class type."),
  finalPrice: z.string().min(1, "Please enter the final price of the book."),
  shippingCharge: z.string().min(1, "Please enter the shipping charge or Select For Free Shipping"),
});

export type bookSellFromDataType = z.infer<typeof bookSellFormDataSchema>
export type bookSellFromDataError = Partial<Record<keyof bookSellFromDataType, string[]>>

// BookInterformationData
export const bookInterformationDataSchmea = z.object({
  price: z.string().min(1, "Please enter the price of the book."),
  author: z.string().min(1, "Please enter the author name of the book."),
  edition: z.string().min(1, "Please enter the edition Year of the book."),
  description: z.string().min(1, "Please enter the description of the book."),
})

export type bookInterformationDataType = z.infer<typeof bookInterformationDataSchmea>
export type bookInterformationDataError = Partial<Record<keyof bookInterformationDataType , string[]>>


