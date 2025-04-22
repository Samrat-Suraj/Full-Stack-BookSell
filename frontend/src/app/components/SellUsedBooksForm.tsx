"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CameraIcon, IdCard, Loader2, X } from 'lucide-react';
import Image from 'next/image';
import { useCreateProductMutation } from '@/store/api/productApi';
import { toast } from 'sonner';
import { bookInterformationDataError, bookInterformationDataSchmea, bookInterformationDataType, bookSellFormDataSchema, bookSellFromDataError, bookSellFromDataType } from '@/types/SellBookForm';
import { useRouter } from 'next/navigation';

const SellUsedBooksForm: React.FC = () => {
  const router = useRouter()
  const [images, setImages] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [paymentMethod, setPaymentMethod] = useState<string>("UPI")
  const [isShippingFree, setIsShippigFree] = useState(false)
  const [CreateProduct, { data, error, isSuccess, isLoading, isError }] = useCreateProductMutation()

  //Error
  const [fromDataError, setFromDataError] = useState<bookSellFromDataError>({})
  const [bookInterformationDataError, setBookInterformationDataError] = useState<bookInterformationDataError>({})
  const [imageError, setImageError] = useState<string>("")
  const [paymentUPIError, setPayementUPIError] = useState<string>("")
  const [paymentBankError, setPaymentBankError] = useState<any>({})

  const uploadMutipalImageHander = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(files.map((file: File) => URL.createObjectURL(file)))
      setImageFiles(files)
    }
  }

  const removeImageHander = (idx: number) => {
    setImages(images.filter((_, index) => index !== idx))
  }

  const [fromData, setFormData] = useState<bookSellFromDataType>({
    title: "",
    subject: "",
    category: "",
    condition: "",
    classType: "",
    finalPrice: "",
    shippingCharge: "",
  })

  const onChangeHander = (e: FormEvent<HTMLSelectElement | HTMLInputElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    setFormData({ ...fromData, [target.name]: target.value })
  };


  const [bookInterformationData, setBookInterformationData] = useState<bookInterformationDataType>({
    price: "",
    author: "",
    edition: "",
    description: "",
  })

  const onChangeBookInfoDataHander = (e: FormEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    setBookInterformationData({ ...bookInterformationData, [target.name]: target.value })
  };

  const [paymentData, setPaymentData] = useState({
    upiId: "",
    bankDetails: {
      accountNumber: "",
      ifscCode: "",
      bankName: "",
    }
  })


  const onChangePayMentDataHander = (e: FormEvent<HTMLSelectElement | HTMLInputElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value } = target;

    if (paymentMethod === "UPI") {
      // setPaymentData((prev) => ({ ...prev, bankDetails: { ...prev.bankDetails, [name]: "" } }));
      setPaymentData((prev) => ({ ...prev, upiId: value }));
    } else {
      setPaymentData((prev) => ({ ...prev, upiId: "" }));
      setPaymentData((prev) => ({ ...prev, bankDetails: { ...prev.bankDetails, [name]: value } }));
    }
  };





  const onSubmitHander = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formDataResult = bookSellFormDataSchema.safeParse(fromData)
    const bookInterformationDataResult = bookInterformationDataSchmea.safeParse(bookInterformationData)

    if (images.length === 0) {
      setImageError("Atlest one Image is Required")
    }

    if (paymentMethod === "UPI") {
      if (!paymentData.upiId) {
        setPayementUPIError("Please enter UPI ID");
        return true;
      }
    }
    
    if (paymentMethod === "Bank Account") {
      const errors: { [key: string]: string } = {};
    
      if (!paymentData.bankDetails.accountNumber.trim()) {
        errors.bankAccount = "Bank Account Number is required";
      }
    
      if (!paymentData.bankDetails.bankName.trim()) {
        errors.bankName = "Bank Name is required";
      }
    
      if (!paymentData.bankDetails.ifscCode.trim()) {
        errors.bankIfsc = "Bank IFSC Code is required";
      }
    
      if (Object.keys(errors).length > 0) {
        setPaymentBankError(errors);
        return false;
      }
    }
    
    if (!formDataResult.success) {
      setFromDataError(formDataResult.error.formErrors.fieldErrors)
    } if (!bookInterformationDataResult.success) {
      setBookInterformationDataError(bookInterformationDataResult.error.formErrors.fieldErrors)
    }
    else {
      let newPaymentDetails = paymentMethod === "UPI" ? JSON.stringify({ upiId: paymentData.upiId }) : JSON.stringify({ bankDetails: paymentData.bankDetails })
      let newshippingCharge = isShippingFree ? 0 : fromData.shippingCharge;

      const form = new FormData()
      form.append("title", fromData.title)
      form.append("subject", fromData.subject)
      form.append("category", fromData.category)
      form.append("condition", fromData.condition)
      form.append("classType", fromData.classType)
      form.append("price", bookInterformationData.price.toString())
      form.append("author", bookInterformationData.author)
      form.append("edition", bookInterformationData.edition)
      form.append("description", bookInterformationData.description)
      form.append("finalPrice", fromData.finalPrice.toString())
      form.append("shippingCharge", newshippingCharge.toString())
      form.append("paymentMode", paymentMethod)
      form.append("paymentDetails", newPaymentDetails)
      if (images) {
        imageFiles.forEach((file) => {
          form.append("images", file);
        });
      }
      await CreateProduct(form)
    }
  }

  useEffect(() => {
    if (isSuccess) {
      router.push("/books")
      toast.success(data?.message)
    }
    if (error) {
      const errorMessage =
        'data' in error && typeof error.data === 'string'
          ? error.data
          : 'An unexpected error occurred';
      toast.error(errorMessage);
    }
  }, [data, error, isSuccess, isError])


  return (
    <div className="max-w-4xl mx-auto p-6 mb-5 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-4xl font-bold mb-4 text-center">Sell Your Used Books</h2>
      <p className='text-center text-xl mb-7'>Submit a free classified ad to sell your used books for cash in India</p>
      <form onSubmit={onSubmitHander} className="space-y-6">

        {/* Book Details Section */}
        <div className='space-y-6'>
          <h1 className='text-3xl font-semibold mb-3 bg-blue-400 p-4 text-white rounded-sm'>📚 Book Details</h1>
          <hr className="border-t-2 border-gray-300 mb-4" />

          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4'>
            <label className="block font-medium mb-1 sm:mb-0">Ad Title</label>
            <input
              type="text"
              name="title"
              onChange={onChangeHander}
              value={fromData.title}
              className="w-full sm:w-[75%] px-4 py-2 border rounded-md"
              placeholder="Enter your ad title"
            />
          </div>
          {fromDataError && <div className='text-sm text-red-600 font-semibold flex justify-end' >{fromDataError?.title}</div>}
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4'>
            <label className="block font-medium mb-1 sm:mb-0">Category</label>
            <select
              name="category"
              onChange={onChangeHander}
              className="w-full sm:w-[75%] px-4 py-2 border rounded-md"

            >
              <option value="">Please select book type</option>
              <option value="College Books (Higher Education Textbooks)">College Books (Higher Education Textbooks)</option>
              <option value="Exam/Test Preparation Books">Exam/Test Preparation Books</option>
              <option value="Reading Books (Novels, Children, Business, Literature, History, etc.)">Reading Books (Novels, Children, Business, Literature, History, etc.)</option>
              <option value="School Books (up to 12th)">School Books (up to 12th)</option>
            </select>
          </div>
          {fromDataError && <div className='text-sm text-red-600 font-semibold flex justify-end' >{fromDataError?.category}</div>}
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4'>
            <label className="block font-medium mb-1 sm:mb-0">Book Condition</label>
            <div className="flex items-center space-x-4">
              {['Excellent', 'Good', 'Fair'].map((condition) => (
                <label key={condition} className="flex cursor-pointer items-center space-x-2">
                  <input
                    type="radio"
                    onChange={onChangeHander}
                    name="condition"
                    value={condition}
                    className='cursor-pointer'
                  />
                  <span>{condition}</span>
                </label>
              ))}
            </div>
          </div>

          {fromDataError && <div className='text-sm text-red-600 font-semibold flex justify-end' >{fromDataError?.condition}</div>}

          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4'>
            <label className="block font-medium mb-1 sm:mb-0">For Class</label>
            <select
              name="classType"
              onChange={onChangeHander}
              className="w-full sm:w-[75%] px-4 py-2 border rounded-md"

            >
              <option value="">Please select class</option>
              {[
                "B.Tech",
                "B.Sc",
                "B.Com",
                "BCA",
                "MBA",
                "M.Tech",
                "M.Sc",
                "Ph.D",
                "12th",
                "11th",
                "10th",
                "9th",
                "8th",
                "7th",
                "6th",
                "5th",
              ].map((cls, i) => (
                <option key={i + 1} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          {fromDataError && <div className='text-sm text-red-600 font-semibold flex justify-end' >{fromDataError?.classType}</div>}

          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4'>
            <label className="block font-medium mb-1 sm:mb-0">Book Title/Subject</label>
            <input
              type="text"
              name="subject"
              onChange={onChangeHander}
              value={fromData.subject}
              className="w-full sm:w-[75%] px-4 py-2 border rounded-md"
              placeholder="Enter book name"

            />
          </div>
          {fromDataError && <div className='text-sm flex justify-end text-red-600 font-semibold' >{fromDataError?.subject}</div>}
          {/* Upload Images */}
          <div>
            <h1>Upload Images</h1>
            <div className='mt-4 p-4 border-dotted border-4 border-blue-600 text-blue-500 flex justify-center flex-col items-center text-center'>
              <label htmlFor='upload' className="block cursor-pointer font-medium mb-1">
                <CameraIcon size={70} />
              </label>
              <input onChange={uploadMutipalImageHander} type="file" accept='image/*' id='upload' hidden name="bookImage" multiple />
              <label htmlFor='upload' className="text-sm cursor-pointer text-gray-500">Upload up to 4 images (Max size: 15MB each)</label>

              <div className='grid mt-3.5 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5'>
                {
                  images.map((img, index) => {
                    return (
                      <div key={index} className=' relative '>
                        <Image src={img} alt='booksUplodimage' width={200} height={100} />
                        <X size={30} className=' cursor-pointer absolute top-0 right-0 text-red-600 rounded-lg p-1 ' onClick={() => removeImageHander(index)} />
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
        </div>
        {images && images.length === 0 && <div className='text-sm text-red-600 font-semibold flex justify-end' >{imageError}</div>}

        <hr className="border-t-2 border-gray-300" />

        {/* Optional Details */}
        <div>
          <h1 className='text-3xl font-semibold mb-3 bg-blue-400 p-4 text-white rounded-sm'>ℹ️ Optional Details</h1>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className='text-[15px]'>Book Information</AccordionTrigger>
              <AccordionContent>
                <div className='flex flex-col sm:flex-row justify-between items-start mb-2'>
                  <label className="block font-medium mb-1 sm:mb-0">Price</label>
                  <input onChange={onChangeBookInfoDataHander} placeholder='Please Enter Price' type="text" name="price" className='w-full sm:w-[75%] px-4 py-2 border rounded-md' />
                </div>
                {bookInterformationDataError && <div className='text-sm mt-2 mb-2 flex justify-end text-red-600 font-semibold'>{bookInterformationDataError.price}</div>}
                <div className='flex flex-col sm:flex-row justify-between items-start mb-2'>
                  <label className="block font-medium mb-1 sm:mb-0">Author</label>
                  <input onChange={onChangeBookInfoDataHander} value={bookInterformationData.author} type="text" name="author" placeholder='Please Write Author Name' className='w-full sm:w-[75%] px-4 py-2 border rounded-md' />
                </div>
                {bookInterformationDataError && <div className='text-sm mt-2 mb-2 flex justify-end text-red-600 font-semibold'>{bookInterformationDataError.author}</div>}
                <div className='flex flex-col sm:flex-row justify-between items-start'>
                  <label className="block font-medium mb-1 sm:mb-0">Edition (Year)</label>
                  <input onChange={onChangeBookInfoDataHander} value={bookInterformationData.edition} type="text" placeholder='Enter Edition Year' name="edition" className='w-full sm:w-[75%] px-4 py-2 border rounded-md' />
                </div>
                {bookInterformationDataError && <div className='text-sm mt-2 mb-2 flex justify-end text-red-600 font-semibold'>{bookInterformationDataError.edition}</div>}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className='text-[15px]'>Description</AccordionTrigger>
              <AccordionContent>
                <div className='flex flex-col sm:flex-row justify-between items-start mb-2'>
                  <label className="block font-medium mb-1 sm:mb-0">Description</label>
                  <textarea onChange={onChangeBookInfoDataHander} value={bookInterformationData.description} placeholder='Write Description' name="description" rows={5} className='w-full sm:w-[75%] resize-none px-4 py-2 border rounded-md' />
                </div>
                {bookInterformationDataError && <div className='text-sm mt-2 mb-2 flex justify-end text-red-600 font-semibold'>{bookInterformationDataError.description}</div>}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <hr className="border-t-2 border-gray-300" />

        {/* Pricing Details */}
        <div>
          <h1 className='text-3xl font-semibold mb-3 bg-blue-400 p-4 text-white rounded-sm'>💰 Pricing Details</h1>
          <div className='flex flex-col sm:flex-row items-start justify-between mb-4'>
            <label className="block font-medium mb-1 sm:mb-0">Final Price (₹)</label>
            <input
              onChange={onChangeHander}
              type="number"
              name="finalPrice"
              value={fromData.finalPrice}
              placeholder='Rs : 300/-'
              className="w-full sm:w-[75%] px-4 py-2 border rounded-md"

            />
          </div>
          {fromDataError && <div className='text-sm text-red-600 font-semibold flex justify-end' >{fromDataError?.finalPrice}</div>}
          <div className='flex flex-col sm:flex-row items-start justify-between mb-4'>
            <label className="block font-medium mb-1 sm:mb-0">Shipping Charges</label>
            <div className="w-full sm:w-[75%] flex flex-col sm:flex-row items-start sm:items-center">
              <input
                onChange={onChangeHander}
                type="number"
                value={fromData.shippingCharge}
                name='shippingCharge'
                className="w-full sm:w-[34%] px-4 py-2 border rounded-md mb-2 sm:mb-0"
                placeholder="Enter shipping charges"
              />
              <p className="mx-2">OR</p>
              <div className='flex gap-2 items-center'>
                <input onClick={() => setIsShippigFree(!isShippingFree)} type="checkbox" id='shipping' className='cursor-pointer' />
                <label htmlFor='shipping' className='cursor-pointer'>Free Shipping</label>
              </div>
            </div>
          </div>
          {fromDataError && <div className='text-sm text-red-600 font-semibold flex justify-end' >{fromDataError?.shippingCharge}</div>}
        </div>

        <hr className="border-t-2 border-gray-300" />

        {/* Payment Details */}
        <div>
          <h1 className='text-3xl flex items-center gap-4 font-semibold mb-3 bg-blue-400 p-4 text-white rounded-sm'><IdCard size={30} /> Bank Details</h1>
          <div>
            {/* <label className="block font-medium mb-1">Payment Method</label> */}
            <div className="flex items-center space-x-4">
              <label onClick={() => setPaymentMethod("UPI")} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="paymentMode"
                  value="UPI"
                  checked={paymentMethod === "UPI"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>UPI</span>
              </label>

              <label onClick={() => setPaymentMethod("Bank Account")} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="paymentMode"
                  value="Bank Account"
                  checked={paymentMethod === "Bank Account"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Bank Account</span>
              </label>
            </div>
          </div>

          <div className='mt-4'>
            {
              paymentMethod === "UPI" ?
                <div>
                  <div className='flex flex-col sm:flex-row justify-between items-start mb-2'>
                    <label className="block font-medium mb-1 sm:mb-0">UPI ID</label>
                    <input type="text"
                      id="upiId"
                      name="upiId"
                      value={paymentData.upiId}
                      onChange={onChangePayMentDataHander}
                      placeholder='Please Enter UPI Id'
                      className='w-full sm:w-[75%] px-4 py-2 border rounded-md' />
                  </div>
                  {paymentUPIError && <div className='text-sm mt-2 mb-2 flex justify-end text-red-600 font-semibold'>{paymentUPIError}</div>}
                </div>

                :
                <div>
                  <div className='flex flex-col sm:flex-row justify-between items-start mb-2'>
                    <label className="block font-medium mb-1 sm:mb-0">Bank Name</label>
                    <input placeholder='Please Enter Bank Name' type="text" onChange={onChangePayMentDataHander} value={paymentData.bankDetails.bankName} name="bankName" className='w-full sm:w-[75%] px-4 py-2 border rounded-md' />
                  </div>
                  {paymentBankError && <div className='text-sm mt-2 mb-2 flex justify-end text-red-600 font-semibold'>{paymentBankError.bankName}</div>}
                  <div className='flex flex-col sm:flex-row justify-between items-start mb-2'>
                    <label className="block font-medium mb-1 sm:mb-0">Bank Account No.</label>
                    <input placeholder='Please Enter Bank Account No.' onChange={onChangePayMentDataHander} value={paymentData.bankDetails.accountNumber} type="text" name="accountNumber" className='w-full sm:w-[75%] px-4 py-2 border rounded-md' />
                  </div>
                  {paymentBankError && <div className='text-sm mt-2 mb-2 flex justify-end text-red-600 font-semibold'>{paymentBankError.bankAccount}</div>}
                  <div className='flex flex-col sm:flex-row justify-between items-start mb-2'>
                    <label className="block font-medium mb-1 sm:mb-0">IFSC Code</label>
                    <input placeholder='Please Enter IFSC Code' onChange={onChangePayMentDataHander} type="text" value={paymentData.bankDetails.ifscCode} name="ifscCode" className='w-full sm:w-[75%] px-4 py-2 border rounded-md' />
                  </div>
                  {paymentBankError && <div className='text-sm mt-2 mb-2 flex justify-end text-red-600 font-semibold'>{paymentBankError.bankIfsc}</div>}
                </div>
            }
          </div>

        </div>


        <button
          type="submit"
          className="w-full flex justify-center items-center bg-blue-500 cursor-pointer hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 mt-4"
        >
          {isLoading ? <Loader2 className='animate-spin  w-5 h-5' /> : "Post Your Book"}
        </button>
      </form>
    </div>
  );
};

export default SellUsedBooksForm;
