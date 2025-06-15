import { useState } from 'react';
import Cancel from '../icons/Cancel';
import Input from './Input';
import Select from './Select';
import Button from './Button';
import axios from 'axios';
import toast from 'react-hot-toast';

interface CreateContentModalProps {
  open: boolean;
  onClose:()=>void
}

const CreateContentModal = (props: CreateContentModalProps) => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const[title,setTitle]=useState("")
  const[link,setLink]=useState("")
  const[tags,setTags]=useState("")
  const[type,setType]=useState("")
  console.log(title,link,tags,type)
  const submitHandler=async(e:any)=>{
     e.preventDefault()
       try {
      const response = await axios.post(`${apiKey}/content`,{
        title,link,tags:tags.split(",").map(item => item.trim()),contentType:type
      },{
        withCredentials:true
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
  }
  if (!props.open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-slate-500 opacity-60"></div>

      {/* Modal Content */}
      <div className="relative z-50 bg-white  rounded-xl shadow-xl p-4">
        <div className='flex justify-between border-b w-96 border-b-gray-700'>
          <h1 className='font-bold text-lg text-gray-700'>Add Content</h1>
          <div onClick={props.onClose}><Cancel></Cancel></div> 
        </div>
        <form className='flex flex-col gap-3 py-2 mt-4' onSubmit={submitHandler}>
          <Input type="text" placeholder='Title...' w={true} onChange={(e)=>setTitle(e.target.value)} require={true}></Input>
          <Input type="text" placeholder='Link...' w={true} onChange={(e)=>setLink(e.target.value)}require={true}></Input>
          <Select array={["Youtube", "Tweet", "Image", "Instagram", "Doc"]} onChange={(e)=>setType(e.target.value)} ></Select>
          <Input type="text" placeholder='Write different tags in commas' w={true} onChange={(e)=>setTags(e.target.value)} require={true}></Input>
          <div className='flex items-center w-full justify-center'>
            <Button variant='secondary' text="Submit"></Button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateContentModal;
