"use client";
import React, { useEffect, useState } from 'react';
import ProfileSideBar from "../../components/ProfileSideBar";
import { useLoaderUserQuery, useUpdateUserProfileMutation } from '@/store/api/userApi';
import { toast } from 'sonner';

const ProfilePage = () => {
  const { data: userData ,  refetch } = useLoaderUserQuery({})
  const [updateUserProfile, { data, isLoading, isSuccess, isError, error }] = useUpdateUserProfileMutation()
  const [editable, setEditable] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    await updateUserProfile(profileData)
    refetch()

  };

  const handleDiscard = () => {
    setEditable(false);
  };

  useEffect(()=>{
    if(data && isSuccess){
      toast.success(data?.message)
      setEditable(false)
    }if(isError  && error){
      toast.error("Profile Update failed")
    }
  },[data ,isSuccess , error , isError ])

  useEffect(()=>{
    setProfileData({
      name : userData?.user?.name,
      email : userData?.user?.email,
      phoneNumber : userData?.user?.phoneNumber,
    })
  },[userData])

  return (
    <div className="w-[90%] flex items-start gap-8 mt-8 mb-8 mx-auto">
      <ProfileSideBar />
      <div className="w-full space-y-6">

        <div className="bg-pink-50 rounded-xl p-6 text-center text-gray-800 shadow-md border border-pink-200">
          <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl mb-3 text-pink-700">
            My Profile
          </h1>
          <p className="text-lg text-gray-600">
            Manage your personal information and preferences
          </p>
        </div>

        <div className="p-6 rounded-2xl shadow-sm border border-pink-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Personal Information</h2>
          <p className="text-gray-500 mb-4">Update your profile details and contact information</p>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label htmlFor="fullName" className="block text-gray-600 text-sm font-bold mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                  className={`w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none shadow-inner ${editable ? 'border-pink-300' : 'border-gray-300'}`}
                  readOnly={!editable}
                />
              </div>
              <div className="flex-1">
                <label htmlFor="email" className="block text-gray-600 text-sm font-bold mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  className="w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none shadow-inner border-gray-300 cursor-not-allowed"
                  readOnly
                />
              </div>
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-gray-600 text-sm font-bold mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={profileData.phoneNumber}
                onChange={handleChange}
                className={`w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none shadow-inner ${editable ? 'border-pink-300' : 'border-gray-300'}`}
                readOnly={!editable}
              />
            </div>
            {/* You can add more profile fields here */}
          </div>

          <div className="mt-6 flex justify-end">
            {editable ? (
              <div className="space-x-2">
                <button
                  onClick={handleDiscard}
                  className="bg-pink-200 hover:bg-pink-300 text-gray-700 font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-sm"
                >
                  Discard
                </button>
                <button
                  onClick={handleSave}
                  className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-sm"
                >
                  {isLoading ? "Saveing...." : "Save"}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditable(true)}
                className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-sm"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;