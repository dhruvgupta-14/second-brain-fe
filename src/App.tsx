import  { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRouter from './AppRouter'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './AuthContext'

const App = () => {
  useEffect(() => {
    const loadScript = (src: string) => {
      if (!document.querySelector(`script[src="${src}"]`)) {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        document.body.appendChild(script);
      }
    };
    loadScript("https://platform.twitter.com/widgets.js");
    loadScript("https://www.instagram.com/embed.js");
  }, []);
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position='bottom-right' />
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App