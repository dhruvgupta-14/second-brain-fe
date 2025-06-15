import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Signup from './Signup'
import Login from './Login'
import Home from './Home'
import GetShareBrain from './GetShareBrain'
import EditProfile from './component/EditProfile'
import { AuthContext } from './AuthContext'
import { FadeLoader } from 'react-spinners'
import ChatApp from './Message'

const AppRouter = () => {
  const { isLogin, loading } = useContext(AuthContext)
  if (loading) return (
    <div className='w-screen h-screen flex flex-col items-center justify-center'>
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
      <FadeLoader color="#6366f1" />
      <footer className='fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border border-slate-200 shadow-sm'>
        <div className=' text-right text-slate-500 py-2 px-4 text-sm'>
          Made by <span className="font-semibold text-purple-600">Dhruv</span> with ❤️
        </div>
      </footer>
    </div>
  )
  return (
    <Routes>
      {/* <Route element={<Layout></Layout>} > */}
      <Route path='/' element={isLogin ? <Home></Home> : <Navigate to="/login" />}></Route>
      <Route path='/edit-profile' element={isLogin ? <EditProfile /> :<Navigate to="/login" />}></Route>
      <Route path='/share/:id' element={<GetShareBrain></GetShareBrain>}></Route>
      <Route path='/chat' element={isLogin ? <ChatApp /> : <Navigate to="/login" />} />
      <Route path='/signup' element={<Signup></Signup>}></Route>
      <Route path='/login' element={<Login></Login>}></Route>
      {/* </Route> */}
    </Routes>
  )
}

export default AppRouter