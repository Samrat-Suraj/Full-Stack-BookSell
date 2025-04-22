import { setErrorMessage } from '@/store/slice/authSlice';
import { X } from 'lucide-react';
import React from 'react';
import { useDispatch } from 'react-redux';

const ErrorMessage = () => {
  const dispatch = useDispatch()
  return (
    <div className="text-red-500 bg-red-100 border flex items-center justify-between border-red-400 p-4 text-center">
      <p className='ml-9'>⚠️ You must be logged in to access this feature. Please log in to continue.</p>
      <X onClick={() => dispatch(setErrorMessage(false))} className='ml-9 cursor-pointer ' />
    </div>
  );
};

export default ErrorMessage;