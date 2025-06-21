import { useState } from "react";
import {
  X,
  Link,
  Type,
  Tag,
  FileText,
  Plus,
  Loader2,
  Edit3,
  Image,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import Input from "./Input";
import Select from "./Select";
import TextArea from "./TextArea";
import FileUpload from "./FileUpload";
import Button from "./Button";

interface CreateContentModalProps {
  open: boolean;
  onClose: () => void;
}
interface FormErrors {
  title?: string;
  link?: string;
  type?: string;
  tags?: string;
  content?: string;
  files?: string;
}
const ProModal = (props: CreateContentModalProps) => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const [activeTab, setActiveTab] = useState("link");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestedTitle, setSuggestedTitle] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [linkTitle, setLinkTitle] = useState("");
  const [link, setLink] = useState("");
  const [linkType, setLinkType] = useState("");
  const [linkTags, setLinkTags] = useState("");

  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteTags, setNoteTags] = useState("");

  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadFiles, setUploadFiles] = useState<FileList | null>(null);
  const [uploadTags, setUploadTags] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});

  const tabs = [
    { id: "link", label: "Link", icon: Link },
    { id: "note", label: "Note", icon: Edit3 },
    { id: "upload", label: "Image/Doc", icon: Image },
  ];

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (activeTab === "link") {
      if (!linkTitle.trim()) newErrors.title = "Title is required";
      if (!link.trim()) newErrors.link = "Link is required";
      if (!linkType) newErrors.type = "Content type is required";
      if (!linkTags.trim()) newErrors.tags = "At least one tag is required";
    } else if (activeTab === "note") {
      if (!noteTitle.trim()) newErrors.title = "Title is required";
      if (!noteContent.trim()) newErrors.content = "Note content is required";
      if (!noteTags.trim()) newErrors.tags = "At least one tag is required";
    } else if (activeTab === "upload") {
      if (!uploadTitle.trim()) newErrors.title = "Title is required";
      if (!uploadFiles) newErrors.files = "Please select files to upload";
      if (!uploadTags.trim()) newErrors.tags = "At least one tag is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const GenerateTitle = async () => {
    if (noteContent.length < 20) {
      toast.error("Insufficient Content to Generate")
    }
    setIsGenerating(true)
    try {
      const response = await axios.post(`${apiKey}/ask/ai/title`, { query: noteContent }, { withCredentials: true })
      setSuggestedTitle(response.data.title)
    } catch (e) {
      console.error('Error generating title:', e)
    } finally {
      setIsGenerating(false)
    }
  }
  const acceptSuggestion = () => {
    setNoteTitle(suggestedTitle)
    setSuggestedTitle('')
  }

  const rejectSuggestion = () => {
    setSuggestedTitle('')
  }
  const submitHandler = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }
    try {
      let payload = {};
      let endpoint = "";
      if (activeTab === "link") {
        payload = {
          title: linkTitle,
          link: link,
          contentType: linkType,
          tags: linkTags.split(",").map((item) => item.trim()),
          type: "link",
        };
        endpoint = `${apiKey}/content`;
      } else if (activeTab === "note") {
        payload = {
          title: noteTitle,
          content: noteContent,
          tags: noteTags.split(",").map((item) => item.trim()),
          type: "note",
        };
        endpoint = `${apiKey}/note`;
      } else if (activeTab === "upload") {
        const formData = new FormData();
        formData.append("title", uploadTitle);
        formData.append("tags", uploadTags);
        if (uploadFiles && uploadFiles.length > 0) {
          formData.append("file", uploadFiles[0]);
        }
        payload = formData;
        endpoint = `${apiKey}/upload`;
      }
      const response = await axios.post(endpoint, payload, {
        withCredentials: true,
        headers:
          activeTab === "upload"
            ? { "Content-Type": "multipart/form-data" }
            : {},
      });
      console.log(response);
      toast.success(response.data.message);
      resetForm();
      props.onClose();
    } catch (e: any) {
      console.log(e);
      toast.error(e.response?.data?.message || "Something went wrong");
      resetForm();
      props.onClose();
    }
    setIsSubmitting(false);
  };

  const resetForm = () => {
    setLinkTitle("");
    setLink("");
    setLinkType("");
    setLinkTags("");
    setNoteTitle("");
    setNoteContent("");
    setNoteTags("");
    setUploadTitle("");
    setUploadFiles(null);
    setUploadTags("");
    setErrors({});
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadFiles(e.target.files);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "link":
        return (
          <div className="space-y-5">

            <Input
              type="text"
              placeholder="Enter a descriptive title"
              label="Title"
              value={linkTitle}
              onChange={(e) => setLinkTitle(e.target.value)}
              require={true}
              startIcon={<Type size={18} />}
              error={errors.title}
            />


            <Input
              type="url"
              placeholder="https://example.com"
              label="Link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              require={true}
              startIcon={<Link size={18} />}
              error={errors.link}
            />
            <Select
              array={["Youtube", "Tweet", "Image", "Instagram", "Doc"]}
              placeholder="Select content type"
              label="Content Type"
              value={linkType}
              onChange={(e) => setLinkType(e.target.value)}
              require={true}
              startIcon={<FileText size={18} />}
              error={errors.type}
            />
            <Input
              type="text"
              placeholder="tech, design, inspiration"
              label="Tags"
              value={linkTags}
              onChange={(e) => setLinkTags(e.target.value)}
              require={true}
              startIcon={<Tag size={18} />}
              error={errors.tags}
            />
          </div>
        );

      case "note":
        return (
          <div className="space-y-5">
            <TextArea
              placeholder="Write your note content here..."
              label="Content"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              require={true}
              startIcon={<Edit3 size={18} />}
              error={errors.content}
              rows={6}
            />
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter note title"
                  label="Title"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  require={true}
                  startIcon={<Type size={18} />}
                  error={errors.title}
                />
              </div>

              {/* Suggestion controls */}
              <div className="flex items-center  gap-2">
                <button
                  onClick={GenerateTitle}
                  disabled={isGenerating || noteContent.length < 20}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      Suggest Title
                    </>
                  )}
                </button>

                {suggestedTitle && (
                  <div className="flex items-center gap-2 ">
                    <span className="text-gray-400 text-[10px]">Suggestion:</span>
                    <span className="font-medium text-xs text-gray-600 max-w-xs ">
                      {suggestedTitle}
                    </span>
                    <button
                      onClick={acceptSuggestion}
                      className="px-2 py-1 text- rounded text-[10px] hover:bg-gray-400"
                    >
                      ✓ Accept
                    </button>
                    <button
                      onClick={rejectSuggestion}
                      className="px-2 py-1 rounded text-[10px] hover:bg-gray-600"
                    >
                      ✗ Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
            <Input
              type="text"
              placeholder="personal, ideas, thoughts"
              label="Tags"
              value={noteTags}
              onChange={(e) => setNoteTags(e.target.value)}
              require={true}
              startIcon={<Tag size={18} />}
              error={errors.tags}
            />
          </div>
        );

      case "upload":
        return (
          <div className="space-y-5">
            <Input
              type="text"
              placeholder="Enter title for your files"
              label="Title"
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              require={true}
              startIcon={<Type size={18} />}
              error={errors.title}
            />
            <FileUpload
              label="Files"
              accept="image/*,.pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
              error={errors.files}
              require={true}
              maxSize={4}
            />
            <Input
              type="text"
              placeholder="documents, images, resources"
              label="Tags"
              value={uploadTags}
              onChange={(e) => setUploadTags(e.target.value)}
              require={true}
              startIcon={<Tag size={18} />}
              error={errors.tags}
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (!props.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  transition-all duration-300">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-slate-300 opacity-60 transition-opacity duration-300 backdrop-blur-sm"
        onClick={props.onClose}
      />

      {/* Modal Content */}
      <div className="relative z-50 w-full max-w-xl bg-white rounded-2xl shadow-2xl transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Plus size={20} className="text-purple-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Add Content</h1>
              <p className="text-sm text-gray-500">
                Share your favorite content
              </p>
            </div>
          </div>
          <button
            onClick={props.onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 group"
          >
            <X size={20} className="text-gray-400 group-hover:text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex-1 ${activeTab === tab.id
                    ? "bg-white text-purple-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {renderTabContent()}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6">
            <Button
              variant="secondary"
              text="Cancel"
              onClick={props.onClose}
              disabled={isSubmitting}
            />
            <Button
              variant="primary"
              text="Add Content"
              startIcon={
                !isSubmitting ? (
                  <Plus size={18} />
                ) : (
                  <Loader2 size={18} className="animate-spin" />
                )
              }
              onClick={submitHandler}
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Progress indicator */}
        {isSubmitting && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-2xl overflow-hidden">
            <div className="h-full bg-purple-600 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProModal;
