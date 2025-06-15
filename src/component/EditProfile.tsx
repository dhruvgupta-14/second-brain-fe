import { Camera, Loader2, User } from 'lucide-react';
import  { useContext, useRef, useState } from 'react'
import Input from './Input';
import Sidebar from './Sidebar';
import Button from './Button';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../AuthContext';

const EditProfile = () => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const {firstName,avatar}=useContext(AuthContext)
  const [name, setFirstName] = useState(firstName);
  const [tempImage, setTempImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const handleImageUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        setTempImage(e.target.result);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const update = async () => {
    setLoading(true)
    try {
      const formData = new FormData();
       const fileInput = fileInputRef.current as HTMLInputElement | null;
      formData.append('firstName', name);
      console.log(firstName)
      if (fileInput?.files) {
        formData.append('avatar', fileInput.files[0]); 
      }

      const response = await axios.put(`${apiKey}/edit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials:true
      });

      toast.success(response.data.message)
    } catch (error:any) {
      console.error('Upload failed:', error);
      toast.error(error.response.data.message)
    }
    setLoading(false)
  }

  const [isExpanded, setIsExpanded] = useState(false);
  const currentImage = tempImage || avatar;
  return (
    <div className="">
      <Sidebar expanded={isExpanded} setExpanded={setIsExpanded} />
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
      <div className={`transition-all duration-300 ${isExpanded ? 'lg:ml-64' : 'lg:ml-16'} min-h-screen pt-16`}>
        <div className="p-6 lg:p-8">
          <div className="max-w-[360px] mx-auto mt-6">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Profile</h1>
              <p className="text-gray-600">Update your personal information and profile picture</p>
            </div>
            {/* Main Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden ">
              {/* Profile Image Section */}
              <div className="relative border-b bg-purple-400 border-gray-200 p-8 text-center">
                <div className="relative inline-block">
                  <div className="relative">
                    {
                      currentImage.length === 0 ? (
                        <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center text-gray-500 text-xl font-bold">
                          {firstName.charAt(0).toUpperCase()}
                        </div>
                      ) : (
                        <img
                          src={currentImage}
                          alt="Profile"
                          className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-center"
                        />
                      )
                    }
                    {isUploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent" />
                      </div>
                    )}
                  </div>
                  <button
                    //@ts-ignore
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-gray-100 hover:scale-105"
                    disabled={isUploading}
                  >
                    <Camera size={16} className="text-gray-600" />
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>
              {/* Form Section */}
              <div className="flex flex-col justify-center items-center p-6 gap-4">
                <Input
                  type="text"
                  label="First Name"
                  placeholder="Enter your first name"
                  value={name}
                  onChange={(e) => setFirstName(e.target.value)}
                  startIcon={<User />}
                  require={true}
                />
                {
                  loading ? <Button variant="secondary" text="Loading..." startIcon={<Loader2 />} disabled={true}></Button> :
                    <Button variant="secondary" text="Update" onClick={update}></Button>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className='fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border border-slate-200 shadow-sm'>
        <div className=' text-right text-slate-500 py-2 px-4 text-sm'>
          Made by <span className="font-semibold text-purple-600">Dhruv</span> with ❤️
        </div>
      </footer>
    </div>
  );
}

export default EditProfile