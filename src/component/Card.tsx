import Share from '../icons/Share'
import Trash from '../icons/Trash'
import Embed from './Embed'
import toast from 'react-hot-toast'
import axios from 'axios'
import { FileTextIcon, ImageIcon, InstagramIcon, StickyNoteIcon, TwitterIcon, UploadIcon, YoutubeIcon } from 'lucide-react'

interface CardProps {
  contentId: any,
  category: 'link' | 'note' | 'upload',
  type: 'image' | 'youtube' | 'tweet' | 'instagram' | 'doc' | 'note' | 'upload',
  title: string,
  link?: string,
  tags?: string[],
  date: string,
  content?: string
}
const getIcon = (type: string) => {
  switch (type) {
    case 'image':
      return <ImageIcon className="w-5 h-5 text-gray-600 mr-2" />;
    case 'youtube':
      return <YoutubeIcon className="w-5 h-5 text-red-600 mr-2" />;
    case 'tweet':
      return <TwitterIcon className="w-5 h-5 text-blue-500 mr-2" />;
    case 'instagram':
      return <InstagramIcon className="w-5 h-5 text-pink-500 mr-2" />;
    case 'doc':
      return <FileTextIcon className="w-5 h-5 text-green-600 mr-2" />;
    case 'note':
      return <StickyNoteIcon className="w-5 h-5 text-yellow-600 mr-2" />;
    case 'upload':
      return <UploadIcon className="w-5 h-5 text-gray-500 mr-2" />;
    default:
      return null;
  }
};

const Card = (props: CardProps) => {
  const apiKey = import.meta.env.VITE_API_KEY;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(props.link || "")
      toast.success('Link Copied')
    } catch (e) {
      console.log(e)
      toast.error('Unable to copy link')
    }
  }


  const deleteContent = async () => {
    let url;
    if (props.category === "note") url = `${apiKey}/note/delete/`;
    if (props.category === "link") url = `${apiKey}/content/delete/`;
    if (props.category === "upload") url = `${apiKey}/upload/delete/`;

    const promise = axios.delete(url + props.contentId, { withCredentials: true });

    toast.promise(promise, {
      loading: 'Deleting...',
      success: 'Deleted successfully',
      error: (err) => err?.response?.data?.message || 'Something went wrong',
    });

    try {
      await promise;
      window.location.reload();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className='flex flex-col bg-white shadow-lg border border-gray-200 rounded-xl overflow-hidden max-w-2xl mx-auto'>
      {/* Header */}
      <div className='flex justify-between items-center p-4 border-b border-gray-100 overflow-x-scroll'>
        <div className="flex items-center">
          {getIcon(props.type)}
          <h1 className="font-bold text-xl text-gray-800 truncate flex-1 ">
            {props.title}
          </h1>
        </div>

        <div className='flex gap-1'>
          {
            props.link && <button
              onClick={copyLink}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Share"
            >
              <Share />
            </button>
          }

          <button
            onClick={deleteContent}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className='flex-1 p-6'>
        <Embed
          content={props.content}
          type={props.type}
          link={props.type === "youtube"
            ? `https://www.youtube.com/embed/${props.link?.split('/').pop()?.split('?')[0]}`
            : props.type === "tweet"
              ? props.link?.replace("x.com", "twitter.com")
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

export default Card
