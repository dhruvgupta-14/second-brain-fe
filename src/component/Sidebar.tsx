import { useContext, useState } from 'react';
import {
  Home,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  MessageCircle
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface SideBarProps {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

const Sidebar = ({ expanded, setExpanded }: SideBarProps) => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { firstName, username, avatar } = useContext(AuthContext);
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, label: 'Dashboard', route: "/" },
    { icon: MessageCircle, label: "Chat", route: "/chat" },
    { icon: User, label: 'Profile', route: "/edit-profile" },
  ];

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleNavigate = (route: string) => {
    navigate(route);
    // Close mobile sidebar after navigation
    setIsMobileOpen(false);
  };

  const Logout = async () => {
    try {
      const response = await axios.get(`${apiKey}/logout`, {
        withCredentials: true
      });
      if (response.data.success) {
        toast.success("Logged out successfully");
        setIsMobileOpen(false); // Close mobile sidebar
        navigate("/login");
      }
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  return (
    <>
      {/* Mobile overlay - FIXED: Uncommented and properly implemented */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Mobile menu button */}
      <button
        onClick={toggleMobileSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white p-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-gradient-to-b from-slate-50 to-slate-100
        border-r border-slate-700 backdrop-blur-xl shadow-2xl z-50
        transition-all duration-300 ease-in-out
        ${expanded ? 'w-64' : 'w-16'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className={`flex items-center space-x-3 ${!expanded && 'justify-center'}`}>
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-thin text-sm">SB</span>
            </div>
            {expanded && (
              <div className="flex flex-col">
                <h1 className="text-gray-800 font-semibold text-lg">Second Brain</h1>
                <p className="text-gray-900 text-xs">v1.0.1</p>
              </div>
            )}
          </div>

          <button
            onClick={toggleSidebar}
            className="hidden lg:flex items-center justify-center w-6 h-6 text-slate-400 hover:text-black transition-colors duration-200"
          >
            {expanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* Navigation - FIXED: Click handler moved to button */}
        <nav className="flex-1 p-2 space-y-1">
          {menuItems.map((item, index) => (
            <div key={index} className="relative group">
              <button
                onClick={() => handleNavigate(item.route)}
                className={`
                  w-full flex items-center space-x-3 px-3 py-3 rounded-xl
                  text-gray-700 hover:bg-gray-100 
                  transition-all duration-200 ease-in-out
                  ${!expanded && 'justify-center'}
                  group-hover:shadow-lg group-hover:scale-105
                `}
              >
                <item.icon size={20} className="flex-shrink-0" />
                {expanded && (
                  <span className="flex-1 text-left font-medium">
                    {item.label}
                  </span>
                )}
              </button>

              {/* Tooltip for collapsed state */}
              {!expanded && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                  {item.label}
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 rotate-45"></div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-slate-700/50">
          <div className={`flex items-center space-x-3 ${!expanded && 'justify-center'}`}>
            {avatar.length === 0 ? (
              <div className="w-10 h-10 border border-gray-700 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-black font-bold text-sm">
                  {firstName?.charAt(0).toUpperCase() || ""}
                </span>
              </div>
            ) : (
              <img
                src={avatar}
                alt="User avatar"
                className='w-10 h-10 border border-gray-700 rounded-full object-cover shadow-sm'
              />
            )}

            {expanded && (
              <div className="flex-1">
                <p className="text-gray-800 font-medium text-sm">{firstName || ""}</p>
                <p className="text-gray-500 text-xs">{username}</p>
              </div>
            )}
          </div>

          {expanded && (
            <button
              className="w-full mt-3 flex items-center justify-center space-x-2 px-3 py-2 bg-gray-50 text-black border rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
              onClick={Logout}
            >
              <LogOut size={16} />
              <span className="font-medium">Log out</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;