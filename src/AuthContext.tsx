import { createContext,useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
type AuthContextType = {
  userId: string;
  username: string;
  firstName:string;
  avatar: string;
  loading?: boolean;
  isLogin:boolean;
  refreshUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  userId: "",
  username: "",
  firstName:"",
  avatar: "",
  loading:true,
  isLogin:false,
  refreshUser: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const [loading, setLoading] = useState(true);
  const [isLogin,setIsLogin]=useState(false);
  const [userId,setUserId]=useState("")
  const [username,setUsername]=useState("")
  const [firstName,setFirstName]=useState("")
  const [avatar,setAvatar]=useState("")
  const getMe = async () => {
    try {
      const response = await axios.get(`${apiKey}/me`, {
        withCredentials: true
      })
        if (!response.data.success) {
        toast.error("Please login to continue");
        setLoading(false)
        return
      }
      setFirstName(response.data.firstName);
      setUsername(response.data.username);
      setAvatar(response.data.avatar)
      setUserId(response.data.userId)
      setIsLogin(true)
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Please login to continue");
      setLoading(false)
      return
    }
    setLoading(false)
    };
  useEffect(() => {
    getMe();
  }, []);

  return (
    <AuthContext.Provider value={{isLogin,userId,username,firstName,avatar,loading, refreshUser: getMe,  }}>
      {children}
    </AuthContext.Provider>
  );
};


