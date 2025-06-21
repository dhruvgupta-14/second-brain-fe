import { useEffect, useState } from "react";
import Button from "../component/Button";
import Plus from "../icons/Plus";
import Share from "../icons/Share";
import Card from "../component/Card";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Search } from "lucide-react";
import { FadeLoader } from "react-spinners";
import ShareBrain from "../component/Share";
import Sidebar from "../component/Sidebar";
import ProModal from "../component/Modal";
import FloatingChat from "../component/FloatingChat";


const Home = () => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const navigate = useNavigate();
  const [contentModal, setContentModal] = useState(false);
  const [content, setContent] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [Loading, setLoading] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);
  const fetchContent = async () => {

    try {
      const response = await axios.get(`${apiKey}/content`, {
        withCredentials: true,
      });
      // console.log(response.data.data)
      setContent(response.data.data);
    } catch (e: any) {
      // console.log(e);
      toast.error(e.response.data.message || "Your token is expired");
      navigate("/login");
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchContent();
  }, [contentModal]);
  const SearchQuery = async () => {
    setLoading(true);
    if (query.trim() === "") {
      fetchContent();
      return;
    }
    try {
      const response = await axios.post(
        `${apiKey}/content/search`,
        {
          query: query,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response.data.data.hits)
      const array = response.data.data.hits.map((item: any) => item.fields)

      setContent(array);
      if (response.data.data.length === 0) {
        toast.error("No content found for the given query");
      }
    } catch (e: any) {
      // console.log(e);
      toast.error(e.response.data.message || "Error fetching search results");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <FloatingChat />
      <ProModal open={contentModal} onClose={() => setContentModal((prev) => !prev)} />
      <ShareBrain open={shareOpen} onClose={() => setShareOpen((prev) => !prev)} />
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

            {/* Action Buttons Section */}
            <div className="flex gap-3">
              <Button
                text="Add Content"
                variant="primary"
                startIcon={<Plus />}
                onClick={() => setContentModal((prev) => !prev)}
              />
              <Button
                text="Share Brain"
                variant="secondary"
                startIcon={<Share />}
                onClick={() => setShareOpen((prev) => !prev)}
              />
            </div>
          </div>
        </div>
      </header>
      <div className={`transition-all duration-300 ${isExpanded ? 'lg:ml-64' : 'lg:ml-16'} min-h-screen pt-16`}>
        <div className="p-6 lg:p-8">
          <div className="w-full max-w-4xl mx-auto mb-8 px-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              <div className="relative flex items-center bg-white rounded-xl shadow-lg border border-slate-200/60 hover:shadow-sm transition-all duration-300 overflow-hidden">
                {/* Search icon - left side */}
                <div className="pl-6 pr-2 py-4">
                  <Search className="text-slate-400 group-hover:text-slate-600 transition-colors duration-200" size={20} />
                </div>

                {/* Input field */}
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search your brain..."
                  className="flex-1 px-2 py-4 text-slate-700 placeholder-slate-400 bg-transparent border-none outline-none text-lg "
                  onKeyDown={(e) => e.key === 'Enter' && SearchQuery()}
                />
                <button
                  className="m-2 px-6 py-3 bg-purple-500 cursor-pointer  text-white font-semibold rounded-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
                  onClick={SearchQuery}
                >
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </div>
          </div>
          <div className="w-full px-4 py-6">
            {Loading ? (
              // Centered loading spinner
              <div className="flex justify-center items-center min-h-[400px] w-full">
                <FadeLoader color="#6366f1" />
              </div>
            ) : content && content.length === 0 ? (
              // Empty state message
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="max-w-md">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    No Content Yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Get started by adding your first piece of content. Share links, images, videos, and more!
                  </p>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-lg transition-colors" onClick={() => setContentModal((prev) => !prev)}>
                    Add Content
                  </button>
                </div>
              </div>
            ) : (
              // Content grid
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {content &&
                  content.map((item: any, index: number) => (
                    <div key={item._id || index} className="w-full">

                      <Card
                        contentId={item._id}
                        category={item.type || item.category}
                        title={item.title}
                        date={new Date(item.createdAt).toLocaleString("en-IN", {
                          dateStyle: "long",
                          timeStyle: "short",
                          timeZone: "Asia/Kolkata",
                        })}
                        tags={
                          Array.isArray(item.tags)
                            ? typeof item.tags[0] === "string"
                              ? item.tags // already string array
                              : item.tags.map((tag: any) => tag.title) // array of objects
                            : []
                        }
                        type={item.contentType}
                        link={item.link}
                        content={item.content}
                      />
                    </div>
                  ))}
              </div>
            )}
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
};

export default Home;
