import  { useState } from 'react';
import { X, Link, Type, Tag, FileText, Plus, Loader2 } from 'lucide-react';
import Input from './Input';
import Select from './Select';
import Button from './Button';
import toast from 'react-hot-toast';
import axios from 'axios';

// Mock components for demo
interface CreateContentModalProps {
  open: boolean;
  onClose: () => void
}
const ProModal = (props: CreateContentModalProps) => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [type, setType] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    title: '',
    link: '',
    type: '',
    tags: ''  
  });
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!link.trim()) newErrors.link = 'Link is required';
    if (!type) newErrors.type = 'Content type is required';
    if (!tags.trim()) newErrors.tags = 'At least one tag is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = async (e: any) => {
    e.preventDefault()
    setIsSubmitting(true);
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }
    try {
      const response = await axios.post(`${apiKey}/content`, {
        title, link, tags: tags.split(",").map(item => item.trim()), contentType: type
      }, {
        withCredentials: true
      })
      console.log(response)
      toast.success(response.data.message)
      props.onClose()
      setTags("")
      setLink("")
      setTitle("")
      setType("")
    } catch (e: any) {
      console.log(e)
      toast.error(e.response.data.message || "Something went wrong")
      props.onClose()
      setTags("")
      setLink("")
      setTitle("")
      setType("")
    }
    setIsSubmitting(false);
  };

  if (!props.open) return null;
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 `}>
      {/* Enhanced Background Overlay */}
      <div
        className={`absolute inset-0 bg-slate-300 opacity-60 transition-opacity duration-300 backdrop-blur-sm `}
        onClick={props.onClose}
      />

      {/* Modal Content */}
      <div className={`relative z-50 w-full max-w-md bg-white rounded-2xl shadow-2xl transition-all duration-300 `}>

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Plus size={20} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Add Content</h1>
              <p className="text-sm text-gray-500">Share your favorite content</p>
            </div>
          </div>
          <button
            onClick={props.onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 group"
          >
            <X size={20} className="text-gray-400 group-hover:text-gray-600" />
          </button>
        </div>
        {/* Form */}
        <div className="p-6 space-y-5">
          <Input
            type="text"
            placeholder="Enter a descriptive title"
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            require={true}
            startIcon={<Type />}
            error={errors.title}
          />
          <Input
            type="url"
            placeholder="https://example.com"
            label="Link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            require={true}
            startIcon={<Link />}
            error={errors.link}
          />
          <Select
            array={["Youtube", "Tweet", "Image", "Instagram", "Doc"]}
            placeholder="Select content type"
            label="Content Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            require={true}
            startIcon={<FileText />}
            error={errors.type}
          />
          <Input
            type="text"
            placeholder="tech, design, inspiration"
            label="Tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            require={true}
            startIcon={<Tag />}
            error={errors.tags}
          />
          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              text="Cancel"
              onClick={props.onClose}
              disabled={isSubmitting}
            />
            <Button
              variant="primary"
              text={"Add Content"}
              startIcon={!isSubmitting ? <Plus /> : <Loader2 className="animate-spin" />}
              onClick={submitHandler}
            />
          </div>
        </div>

        {/* Progress indicator */}
        {isSubmitting && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-2xl overflow-hidden">
            <div className="h-full bg-blue-600 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
};
export default ProModal;

