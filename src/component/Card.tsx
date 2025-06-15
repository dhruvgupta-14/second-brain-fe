import React from 'react'
import Share from '../icons/Share'
import Trash from '../icons/Trash'
import Embed from './Embed'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'



interface CardProps {
  contentId:any,
  type: 'image' | 'youtube' | 'tweet' | 'instagram' | 'doc',
  title: string,
  link: string,
  tags?: string[],
  date: string
}
const Card = (props: CardProps) => {
   const apiKey = import.meta.env.VITE_API_KEY;
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(props.link)
      toast.success('Link Copied')
      
    } catch (e) {
      console.log(e)
      toast.error('Unable to copy link')
    }
  }
  const deleteContent = async () => {
    try {
      const response=await axios.delete(`${apiKey}/content/delete/`+props.contentId,{withCredentials:true})
      toast.success("Content deleted ,please refresh page")
      window.location.reload();
    } catch (e:any) {
      console.log(e)
      toast.error(e.response.data.message||"Something went wrong")
    }
  }
  return (
    <div className='flex flex-col bg-white shadow-lg border border-gray-200 rounded-xl overflow-hidden max-w-2xl mx-auto'>
      {/* Header */}
      <div className='flex justify-between items-center p-6 border-b border-gray-100'>
        <h1 className='font-bold text-xl text-gray-800 truncate flex-1 mr-4'>
          {props.title}
        </h1>
        <div className='flex gap-2 '>
          <button 
            onClick={copyLink}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Share"
          >
            <Share  />
          </button>
          <button 
            onClick={deleteContent}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash   />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className='flex-1 p-6'>
        <Embed 
          type={props.type} 
          link={props.type === "youtube"
            ? `https://www.youtube.com/embed/${props.link.split('/').pop()?.split('?')[0]}`
            : props.type === "tweet"
              ? props.link.replace("x.com", "twitter.com")
              : props.link
          } 
        />
      </div>

      {/* Footer */}
      <div className='px-6 pb-6 space-y-3'>
        {props.tags && props.tags.length > 0 && (
          <div className='flex flex-wrap gap-2'>
            {props.tags.map((tag, index) => (
              <span 
                key={index} 
                className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700'
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        <div className='text-gray-500 text-sm'>
          Added on {props.date}
        </div>
      </div>
    </div>
  );
}

export default Card;