import { Link, useNavigate } from "react-router-dom"
import Button from "./component/Button"
import Input from "./component/Input"
import { useContext, useState } from "react"
import User from "./icons/User"
import HideEye from "./icons/HideEye"
import Lock from "./icons/Lock"
import Eye from "./icons/Eye"
import axios from "axios"
import toast from "react-hot-toast"
import { Loader2 } from "lucide-react"
import { AuthContext } from "./AuthContext"
const Signup = () => {
  const apiKey = import.meta.env.VITE_API_KEY;
const {refreshUser}=useContext(AuthContext)
  const [showPassword, setShowPassword] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const SubmitHandler = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    if (username.trim() === "" || password.trim() === "" || firstName.trim() === "") {
      toast.error("Please fill all fields")
      setLoading(false)
      return
    }
    try {
      const response = await axios.post(`${apiKey}/signup`, {
        username, password, firstName
      }, {
        withCredentials: true
      })
      if (response.data.success) {
        toast.success('Now you can login')
        // await refreshUser()
        navigate('/login')
      }
    } catch (e: any) {
      // console.log(e)
      toast.error(e.response.data.message || "Something went wrong")
    }
    setLoading(false)
  }
  return (
    <div className="flex w-full h-screen items-center justify-center bg-gray-50">
      <header className='fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm'>
        <div className='max-w-7xl mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            {/* Logo and Title Section */}
            <div className='flex items-center gap-4'>
              <div className='relative group'>
                <div className='absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300'></div>
                <img
                  src="/logo.png"
                  alt="Second Brain Logo"
                  className='relative w-12 h-12 rounded-2xl object-cover shadow-lg ring-1 ring-white/20'
                />
              </div>
              <div className='flex flex-col'>
                <h1 className='font-bold text-xl bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent'>
                  Second Brain
                </h1>
                <p className='text-xs text-slate-500 font-medium hidden sm:block'>Your personal knowledge hub</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      <form className="flex flex-col  gap-4 shadow-md  p-6 border-slate-100 bg-white rounded-2xl" onSubmit={SubmitHandler}>
        <h1 className="text-center text-xl font-thin">SignUp</h1>
        <Input type="text" placeholder="Username" require={true} onChange={(e) => setUsername(e.target.value)} startIcon={<User></User>}></Input>
        <Input type="text" placeholder="Firstname" require={true} onChange={(e) => setFirstName(e.target.value)} startIcon={<User></User>}></Input>
        <Input type={showPassword ? "text" : "password"} placeholder="Password" require={true} onChange={(e) => setPassword(e.target.value)} endIcon={showPassword ? <Eye onClick={() => setShowPassword(prev => !prev)}></Eye> : <HideEye onClick={() => setShowPassword(prev => !prev)} ></HideEye>} startIcon={<Lock></Lock>}></Input>
        <p className="px-2">Already have a account <Link to='/login'><span className="text-blue-600">Login ?</span></Link> </p>
        <div className="w-full flex items-center justify-center">
          {
            loading ? <Button variant="primary" text="Loading..." startIcon={<Loader2 />} disabled={true}></Button> :
              <Button variant="primary" text="Signup"></Button>
          }

        </div>
      </form>
      <footer className='fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border border-slate-200 shadow-sm'>
        <div className=' text-right text-slate-500 py-2 px-4 text-sm'>
          Made by <span className="font-semibold text-purple-600">Dhruv</span> with ❤️
        </div>
      </footer>
    </div>
  )
}

export default Signup