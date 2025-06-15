import Cancel from "../icons/Cancel";
import Button from "./Button";
import axios from "axios";
import toast from "react-hot-toast";
import Clipboard from "../icons/Clipboard";

interface ShareProps {
  open: boolean;
  onClose: () => void;
}

const ShareBrain = (props: ShareProps) => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const Share = async () => {
    try {
      const response = await axios.post(
        `${apiKey}/share`,
        {share:true},
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message+" Link copied to clipboard");
      await navigator.clipboard.writeText(
        `https://second-brain-fe-five.vercel.app/share/${response.data.data}`
      );
    } catch (e: any) {
      console.log(e);
      toast.error(e.response.data.message || "Something went wrong");
    }
  };
  const cancelShare = async () => {
    try {
      const response = await axios.post(
        `${apiKey}/share`,
        {share:false},
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
    } catch (e: any) {
      console.log(e);
      toast.error(e.response.data.message || "Something went wrong");
    }
  };
  if (!props.open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-slate-500 opacity-60 backdrop-blur-sm"></div>

      {/* Modal Content */}
      <div className="relative z-50 bg-white max-w-md  rounded-xl shadow-xl p-4">
        <div className="flex justify-between border-b w-96 border-b-gray-300 p-1">
          <h1 className="font-bold text-lg text-gray-700">
            Share Your Second Brain
          </h1>
          <div onClick={props.onClose}>
            <Cancel></Cancel>
          </div>
        </div>
        <div className="w-96 flex flex-col mt-4 items-center justify-center ">
          <p className="mb-6">
            Share your entire collection of notes,documents,tweet and video with
            others.They'll be able to view and interact with your content
            seamlessly.
          </p>
          <div className="flex  gap-2 items-center justify-center">
            <Button
              startIcon={<Clipboard />}
              text="Share Brain"
              variant="primary"
              onClick={Share}
            />
            <Button startIcon={<Cancel />} text="Cancel Share" variant="secondary" onClick={cancelShare} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareBrain;
