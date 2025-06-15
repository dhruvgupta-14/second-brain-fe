import axios from "axios";
import {  useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import Card from "./component/Card";

const GetShareBrain = () => {
  const apiKey = import.meta.env.VITE_API_KEY
  const { id } = useParams();
  const [content, setContent] = useState([]);
  const [Loading, setLoading] = useState(true);
  const fetchShareBrain = async () => {
    try {
      const response = await axios.post(
        `${apiKey}/share/brain/` + id,
        {
          withCredentials: true,
        }
      );
      setContent(response.data.data);
      setLoading(false);
    } catch (e: any) {
      // console.log(e);
      toast.error(e.response.data.message || "Something went wrong");
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchShareBrain();
  }, [id]);

  return (
    <div>
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
      <div className="pt-28 px-16">

        <div className="flex gap-5 flex-wrap w-full">
          {Loading ? ( // show spinner when loading is true
            <div className="flex justify-center items-center w-full h-full mt-28">
              <FadeLoader color="#000000" />
            </div>
          ) : content && content.length === 0 ? (
            <p className="font-medium mt-4 text-xl text-center">
              No Content. You can create one by clicking on{" "}
              <strong>Add Content</strong>.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
              {content &&
                content.map((item: any, index: number) => (
                  <Card
                    key={index}
                    contentId={item._id}
                    type={item.contentType}
                    title={item.title}
                    link={item.link}
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
                  />
                ))
              }
            </div>
          )}
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

export default GetShareBrain;
