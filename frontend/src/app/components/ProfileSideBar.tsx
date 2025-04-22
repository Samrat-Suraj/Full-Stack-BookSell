"use client"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BringToFront, Heart, LogOut, ShoppingCart, User2 } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { useLoaderUserQuery, useLogoutMutation } from "@/store/api/userApi"
import { toast } from "sonner"
import { setUser } from "@/store/slice/authSlice"

const ProfileSideBar = () => {
  const dispatch = useDispatch()
  const { refetch : userDataRefetch } = useLoaderUserQuery({})
  const { user } = useSelector((store: any) => store.auth)
  const [Logout , {data , isSuccess}] = useLogoutMutation()
  const router = useRouter()
  const pathname = usePathname()
  const [current, setCurrent] = useState<string>("")

  const menuItems = [
    {
      id: "profile",
      label: "My Profile",
      href: "/account/profile",
      icon: <User2 />,
      activeColor: "bg-pink-600",
    },
    {
      id: "orders",
      label: "My Orders",
      href: "/account/orders",
      icon: <ShoppingCart />,
      activeColor: "bg-orange-500",
    },
    {
      id: "product",
      label: "Selling Products",
      href: "/account/selling-products",
      icon: <BringToFront />,
      activeColor: "bg-green-600",
    },
    {
      id: "wishlist",
      label: "Wishlist",
      href: "/account/wishlist",
      icon: <Heart />,
      activeColor: "bg-red-600",
    },
  ]

  useEffect(() => {
    const matchedItem = menuItems.find(item => pathname.includes(item.id))
    if (matchedItem) {
      setCurrent(matchedItem.id)
    }
  }, [pathname])

  const handleNavigation = (id: string, href: string) => {
    setCurrent(id)
    router.push(href)
  }

  const handelLogout = async () => {
    await Logout({});
  };

  useEffect(()=>{
    if(isSuccess && data){
      router.push("/")
      userDataRefetch()
      dispatch(setUser({}))
      toast.success(data?.message)
    }
  },[isSuccess , data])

  return (
    <div className="w-full hidden lg:flex flex-col relative text-sm bg-gradient-to-br from-purple-600 to-indigo-700 h-[85vh] text-white max-w-xs rounded-sm p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-white">Your Account</h1>

      <div className="flex items-center space-x-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback>{user?.name?.slice(0,2)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-lg font-medium">{user?.name}</p>
          <p className="text-sm">{user?.email}</p>
        </div>
      </div>

      <div className="space-y-3">
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleNavigation(item.id, item.href)}
            className="relative"
          >
            <AnimatePresence>
              {current === item.id && (
                <motion.div
                  layoutId="activeItem"
                  className={`absolute inset-0 rounded-lg z-0 ${item.activeColor}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </AnimatePresence>
            <div
              className={`flex relative z-10 items-center space-x-3 cursor-pointer p-2 rounded-lg transition ${current !== item.id && "hover:bg-white/10"
                }`}
            >
              {item.icon}
              <p>{item.label}</p>
            </div>
          </div>
        ))}

        <div
          onClick={handelLogout}
          className="flex absolute bottom-5 bg-white w-[85%] text-black  items-center space-x-3 cursor-pointer hover:bg-white/90 p-1.5 rounded-lg transition"
        >
          <LogOut />
          <p>LogOut</p>
        </div>
      </div>
    </div>
  )
}

export default ProfileSideBar
